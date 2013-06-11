
// enyo.js

(function() {
var e = "enyo.js";
enyo = window.enyo || {}, enyo.locateScript = function(e) {
var t = document.getElementsByTagName("script");
for (var n = t.length - 1, r, i, s = e.length; n >= 0 && (r = t[n]); n--) if (!r.located) {
i = r.getAttribute("src") || "";
if (i.slice(-s) == e) return r.located = !0, {
path: i.slice(0, Math.max(0, i.lastIndexOf("/"))),
node: r
};
}
}, enyo.args = enyo.args || {};
var t = enyo.locateScript(e);
if (t) {
enyo.args.root = (enyo.args.root || t.path).replace("/source", "");
for (var n = 0, r; r = t.node.attributes.item(n); n++) enyo.args[r.nodeName] = r.value;
}
})();

// ../../loader.js

(function() {
enyo = window.enyo || {}, enyo.path = {
paths: {},
addPath: function(e, t) {
return this.paths[e] = t;
},
addPaths: function(e) {
if (e) for (var t in e) this.addPath(t, e[t]);
},
includeTrailingSlash: function(e) {
return e && e.slice(-1) !== "/" ? e + "/" : e;
},
rewritePattern: /\$([^\/\\]*)(\/)?/g,
rewrite: function(e) {
var t, n = this.includeTrailingSlash, r = this.paths, i = function(e, i) {
return t = !0, n(r[i]) || "";
}, s = e;
do t = !1, s = s.replace(this.rewritePattern, i); while (t);
return s;
}
}, enyo.loaderFactory = function(e) {
this.machine = e, this.packages = [], this.modules = [], this.sheets = [], this.stack = [];
}, enyo.loaderFactory.prototype = {
packageName: "",
packageFolder: "",
verbose: !1,
finishCallbacks: {},
loadScript: function(e) {
this.machine.script(e);
},
loadSheet: function(e) {
this.machine.sheet(e);
},
loadPackage: function(e) {
this.machine.script(e);
},
report: function() {},
load: function() {
this.more({
index: 0,
depends: arguments || []
});
},
more: function(e) {
if (e && this.continueBlock(e)) return;
var t = this.stack.pop();
t ? (this.verbose && console.groupEnd("* finish package (" + (t.packageName || "anon") + ")"), this.packageFolder = t.folder, this.packageName = "", this.more(t)) : this.finish();
},
finish: function() {
this.packageFolder = "", this.verbose && console.log("-------------- fini");
for (var e in this.finishCallbacks) this.finishCallbacks[e] && (this.finishCallbacks[e](), this.finishCallbacks[e] = null);
},
continueBlock: function(e) {
while (e.index < e.depends.length) {
var t = e.depends[e.index++];
if (t) if (typeof t == "string") {
if (this.require(t, e)) return !0;
} else enyo.path.addPaths(t);
}
},
require: function(e, t) {
var n = enyo.path.rewrite(e), r = this.getPathPrefix(e);
n = r + n;
if (n.slice(-4) == ".css" || n.slice(-5) == ".less") this.verbose && console.log("+ stylesheet: [" + r + "][" + e + "]"), this.requireStylesheet(n); else {
if (n.slice(-3) != ".js" || n.slice(-10) == "package.js") return this.requirePackage(n, t), !0;
this.verbose && console.log("+ module: [" + r + "][" + e + "]"), this.requireScript(e, n);
}
},
getPathPrefix: function(e) {
var t = e.slice(0, 1);
return t != "/" && t != "\\" && t != "$" && e.slice(0, 5) != "http:" ? this.packageFolder : "";
},
requireStylesheet: function(e) {
this.sheets.push(e), this.loadSheet(e);
},
requireScript: function(e, t) {
this.modules.push({
packageName: this.packageName,
rawPath: e,
path: t
}), this.loadScript(t);
},
decodePackagePath: function(e) {
var t = "", n = "", r = "", i = "package.js", s = e.replace(/\\/g, "/").replace(/\/\//g, "/").replace(/:\//, "://").split("/");
if (s.length) {
var o = s.pop() || s.pop() || "";
o.slice(-i.length) !== i ? s.push(o) : i = o, r = s.join("/"), r = r ? r + "/" : "", i = r + i;
for (var u = s.length - 1; u >= 0; u--) if (s[u] == "source") {
s.splice(u, 1);
break;
}
n = s.join("/");
for (var u = s.length - 1, a; a = s[u]; u--) if (a == "lib" || a == "enyo") {
s = s.slice(u + 1);
break;
}
for (var u = s.length - 1, a; a = s[u]; u--) (a == ".." || a == ".") && s.splice(u, 1);
t = s.join("-");
}
return {
alias: t,
target: n,
folder: r,
manifest: i
};
},
aliasPackage: function(e) {
var t = this.decodePackagePath(e);
this.manifest = t.manifest, t.alias && (enyo.path.addPath(t.alias, t.target), this.packageName = t.alias, this.packages.push({
name: t.alias,
folder: t.folder
})), this.packageFolder = t.folder;
},
requirePackage: function(e, t) {
t.folder = this.packageFolder, this.aliasPackage(e), t.packageName = this.packageName, this.stack.push(t), this.report("loading package", this.packageName), this.verbose && console.group("* start package [" + this.packageName + "]"), this.loadPackage(this.manifest);
}
};
})();

// boot.js

enyo.machine = {
sheet: function(e) {
var t = "text/css", n = "stylesheet", r = e.slice(-5) == ".less";
r && (window.less ? (t = "text/less", n = "stylesheet/less") : e = e.slice(0, e.length - 4) + "css");
var i;
enyo.runtimeLoading || r ? (i = document.createElement("link"), i.href = e, i.media = "screen", i.rel = n, i.type = t, document.getElementsByTagName("head")[0].appendChild(i)) : document.write('<link href="' + e + '" media="screen" rel="' + n + '" type="' + t + '" />'), r && window.less && (less.sheets.push(i), enyo.loader.finishCallbacks.lessRefresh || (enyo.loader.finishCallbacks.lessRefresh = function() {
less.refresh(!0);
}));
},
script: function(e, t, n) {
if (!enyo.runtimeLoading) document.write('<script src="' + e + '"' + (t ? ' onload="' + t + '"' : "") + (n ? ' onerror="' + n + '"' : "") + "></scri" + "pt>"); else {
var r = document.createElement("script");
r.src = e, r.onLoad = t, r.onError = n, document.getElementsByTagName("head")[0].appendChild(r);
}
},
inject: function(e) {
document.write('<script type="text/javascript">' + e + "</script>");
}
}, enyo.loader = new enyo.loaderFactory(enyo.machine), enyo.depends = function() {
var e = enyo.loader;
if (!e.packageFolder) {
var t = enyo.locateScript("package.js");
t && t.path && (e.aliasPackage(t.path), e.packageFolder = t.path + "/");
}
e.load.apply(e, arguments);
}, function() {
function n(r) {
r && r();
if (t.length) {
var i = t.shift(), s = i[0], o = e.isArray(s) ? s : [ s ], u = i[1];
e.loader.finishCallbacks.runtimeLoader = function() {
n(function() {
u && u(s);
});
}, e.loader.packageFolder = "./", e.depends.apply(this, o);
} else e.runtimeLoading = !1, e.loader.packageFolder = "";
}
var e = window.enyo, t = [];
e.load = function(r, i) {
t.push(arguments), e.runtimeLoading || (e.runtimeLoading = !0, n());
};
}(), enyo.path.addPaths({
enyo: enyo.args.root,
lib: "$enyo/../lib"
});

// log.js

enyo.logging = {
level: 99,
levels: {
log: 20,
warn: 10,
error: 0
},
shouldLog: function(e) {
var t = parseInt(this.levels[e], 0);
return t <= this.level;
},
_log: function(e, t) {
var n = enyo.isArray(t) ? t : enyo.cloneArray(t);
enyo.dumbConsole && (n = [ n.join(" ") ]);
var r = console[e];
r && r.apply ? r.apply(console, n) : console.log.apply ? console.log.apply(console, n) : console.log(n.join(" "));
},
log: function(e, t) {
window.console && this.shouldLog(e) && this._log(e, t);
}
}, enyo.setLogLevel = function(e) {
var t = parseInt(e, 0);
isFinite(t) && (enyo.logging.level = t);
}, enyo.log = function() {
enyo.logging.log("log", arguments);
}, enyo.warn = function() {
enyo.logging.log("warn", arguments);
}, enyo.error = function() {
enyo.logging.log("error", arguments);
};

// lang.js

(function() {
enyo.global = this, enyo._getProp = function(e, t, n) {
var r = n || enyo.global;
for (var i = 0, s; r && (s = e[i]); i++) r = s in r ? r[s] : t ? r[s] = {} : undefined;
return r;
}, enyo.setObject = function(e, t, n) {
var r = e.split("."), i = r.pop(), s = enyo._getProp(r, !0, n);
return s && i ? s[i] = t : undefined;
}, enyo.getObject = function(e, t, n) {
return enyo._getProp(e.split("."), t, n);
}, enyo.irand = function(e) {
return Math.floor(Math.random() * e);
}, enyo.cap = function(e) {
return e.slice(0, 1).toUpperCase() + e.slice(1);
}, enyo.uncap = function(e) {
return e.slice(0, 1).toLowerCase() + e.slice(1);
}, enyo.format = function(e) {
var t = /\%./g, n = 0, r = e, i = arguments, s = function(e) {
return i[++n];
};
return r.replace(t, s);
};
var e = Object.prototype.toString;
enyo.isString = function(t) {
return e.call(t) === "[object String]";
}, enyo.isFunction = function(t) {
return e.call(t) === "[object Function]";
}, enyo.isArray = Array.isArray || function(t) {
return e.call(t) === "[object Array]";
}, enyo.indexOf = function(e, t, n) {
if (t.indexOf) return t.indexOf(e, n);
if (n) {
n < 0 && (n = 0);
if (n > t.length) return -1;
}
for (var r = n || 0, i = t.length, s; (s = t[r]) || r < i; r++) if (s == e) return r;
return -1;
}, enyo.remove = function(e, t) {
var n = enyo.indexOf(e, t);
n >= 0 && t.splice(n, 1);
}, enyo.forEach = function(e, t, n) {
if (e) {
var r = n || this;
if (enyo.isArray(e) && e.forEach) e.forEach(t, r); else {
var i = Object(e), s = i.length >>> 0;
for (var o = 0; o < s; o++) o in i && t.call(r, i[o], o, i);
}
}
}, enyo.map = function(e, t, n) {
var r = n || this;
if (enyo.isArray(e) && e.map) return e.map(t, r);
var i = [], s = function(e, n, s) {
i.push(t.call(r, e, n, s));
};
return enyo.forEach(e, s, r), i;
}, enyo.filter = function(e, t, n) {
var r = n || this;
if (enyo.isArray(e) && e.filter) return e.filter(t, r);
var i = [], s = function(e, n, s) {
var o = e;
t.call(r, e, n, s) && i.push(o);
};
return enyo.forEach(e, s, r), i;
}, enyo.keys = Object.keys || function(e) {
var t = [], n = Object.prototype.hasOwnProperty;
for (var r in e) n.call(e, r) && t.push(r);
if (!{
toString: null
}.propertyIsEnumerable("toString")) {
var i = [ "toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor" ];
for (var s = 0, o; o = i[s]; s++) n.call(e, o) && t.push(o);
}
return t;
}, enyo.cloneArray = function(e, t, n) {
var r = n || [];
for (var i = t || 0, s = e.length; i < s; i++) r.push(e[i]);
return r;
}, enyo.toArray = enyo.cloneArray, enyo.clone = function(e) {
return enyo.isArray(e) ? enyo.cloneArray(e) : enyo.mixin({}, e);
};
var t = {};
enyo.mixin = function(e, n) {
e = e || {};
if (n) {
var r, i, s;
for (r in n) i = n[r], t[r] !== i && (e[r] = i);
}
return e;
}, enyo.bind = function(e, t) {
t || (t = e, e = null), e = e || enyo.global;
if (enyo.isString(t)) {
if (!e[t]) throw [ 'enyo.bind: scope["', t, '"] is null (scope="', e, '")' ].join("");
t = e[t];
}
if (enyo.isFunction(t)) {
var n = enyo.cloneArray(arguments, 2);
return t.bind ? t.bind.apply(t, [ e ].concat(n)) : function() {
var r = enyo.cloneArray(arguments);
return t.apply(e, n.concat(r));
};
}
throw [ 'enyo.bind: scope["', t, '"] is not a function (scope="', e, '")' ].join("");
}, enyo.asyncMethod = function(e, t) {
return setTimeout(enyo.bind.apply(enyo, arguments), 1);
}, enyo.call = function(e, t, n) {
var r = e || this;
if (t) {
var i = r[t] || t;
if (i && i.apply) return i.apply(r, n || []);
}
}, enyo.now = Date.now || function() {
return (new Date).getTime();
}, enyo.nop = function() {}, enyo.nob = {}, enyo.nar = [], enyo.instance = function() {}, enyo.setPrototype || (enyo.setPrototype = function(e, t) {
e.prototype = t;
}), enyo.delegate = function(e) {
return enyo.setPrototype(enyo.instance, e), new enyo.instance;
}, $L = function(e) {
return e;
};
})();

// job.js

enyo.job = function(e, t, n) {
enyo.job.stop(e), enyo.job._jobs[e] = setTimeout(function() {
enyo.job.stop(e), t();
}, n);
}, enyo.job.stop = function(e) {
enyo.job._jobs[e] && (clearTimeout(enyo.job._jobs[e]), delete enyo.job._jobs[e]);
}, enyo.job._jobs = {};

// macroize.js

enyo.macroize = function(e, t, n) {
var r, i, s = e, o = n || enyo.macroize.pattern, u = function(e, n) {
return r = enyo.getObject(n, !1, t), r === undefined || r === null ? "{$" + n + "}" : (i = !0, r);
}, a = 0;
do {
i = !1, s = s.replace(o, u);
if (++a >= 20) throw "enyo.macroize: recursion too deep";
} while (i);
return s;
}, enyo.quickMacroize = function(e, t, n) {
var r, i, s = e, o = n || enyo.macroize.pattern, u = function(e, n) {
return n in t ? r = t[n] : r = enyo.getObject(n, !1, t), r === undefined || r === null ? "{$" + n + "}" : r;
};
return s = s.replace(o, u), s;
}, enyo.macroize.pattern = /\{\$([^{}]*)\}/g;

// Oop.js

enyo.kind = function(e) {
enyo._kindCtors = {};
var t = e.name || "";
delete e.name;
var n = "kind" in e, r = e.kind;
delete e.kind;
var i = enyo.constructorForKind(r), s = i && i.prototype || null;
if (n && r === undefined || i === undefined) throw "enyo.kind: Attempt to subclass an undefined kind. Check dependencies for [" + (t || "<unnamed>") + "].";
var o = enyo.kind.makeCtor();
return e.hasOwnProperty("constructor") && (e._constructor = e.constructor, delete e.constructor), enyo.setPrototype(o, s ? enyo.delegate(s) : {}), enyo.mixin(o.prototype, e), o.prototype.kindName = t, o.prototype.base = i, o.prototype.ctor = o, enyo.forEach(enyo.kind.features, function(t) {
t(o, e);
}), enyo.setObject(t, o), o;
}, enyo.singleton = function(e, t) {
var n = e.name;
delete e.name;
var r = enyo.kind(e);
enyo.setObject(n, new r, t);
}, enyo.kind.makeCtor = function() {
return function() {
if (!(this instanceof arguments.callee)) throw "enyo.kind: constructor called directly, not using 'new'";
var e;
this._constructor && (e = this._constructor.apply(this, arguments)), this.constructed && this.constructed.apply(this, arguments);
if (e) return e;
};
}, enyo.kind.defaultNamespace = "enyo", enyo.kind.features = [], enyo.kind.features.push(function(e, t) {
var n = e.prototype;
n.inherited || (n.inherited = enyo.kind.inherited);
if (n.base) for (var r in t) {
var i = t[r];
enyo.isFunction(i) && (i._inherited = n.base.prototype[r] || enyo.nop, i.nom = n.kindName + "." + r + "()");
}
}), enyo.kind.inherited = function(e, t) {
return e.callee._inherited.apply(this, t || e);
}, enyo.kind.features.push(function(e, t) {
enyo.mixin(e, enyo.kind.statics), t.statics && (enyo.mixin(e, t.statics), delete e.prototype.statics);
var n = e.prototype.base;
while (n) n.subclass(e, t), n = n.prototype.base;
}), enyo.kind.statics = {
subclass: function(e, t) {},
extend: function(e) {
enyo.mixin(this.prototype, e);
var t = this;
enyo.forEach(enyo.kind.features, function(n) {
n(t, e);
});
}
}, enyo._kindCtors = {}, enyo.constructorForKind = function(e) {
if (e === null || enyo.isFunction(e)) return e;
if (e) {
var t = enyo._kindCtors[e];
return t ? t : enyo._kindCtors[e] = enyo.Theme[e] || enyo[e] || enyo.getObject(e, !1, enyo) || window[e] || enyo.getObject(e);
}
return enyo.defaultCtor;
}, enyo.Theme = {}, enyo.registerTheme = function(e) {
enyo.mixin(enyo.Theme, e);
};

// Object.js

enyo.kind({
name: "enyo.Object",
kind: null,
constructor: function() {
enyo._objectCount++;
},
setPropertyValue: function(e, t, n) {
if (this[n]) {
var r = this[e];
this[e] = t, this[n](r);
} else this[e] = t;
},
_setProperty: function(e, t, n) {
this.setPropertyValue(e, t, this.getProperty(e) !== t && n);
},
destroyObject: function(e) {
this[e] && this[e].destroy && this[e].destroy(), this[e] = null;
},
getProperty: function(e) {
var t = "get" + enyo.cap(e);
return this[t] ? this[t]() : this[e];
},
setProperty: function(e, t) {
var n = "set" + enyo.cap(e);
this[n] ? this[n](t) : this._setProperty(e, t, e + "Changed");
},
log: function() {
var e = arguments.callee.caller, t = ((e ? e.nom : "") || "(instance method)") + ":";
enyo.logging.log("log", [ t ].concat(enyo.cloneArray(arguments)));
},
warn: function() {
this._log("warn", arguments);
},
error: function() {
this._log("error", arguments);
},
_log: function(e, t) {
if (enyo.logging.shouldLog(e)) try {
throw new Error;
} catch (n) {
enyo.logging._log(e, [ t.callee.caller.nom + ": " ].concat(enyo.cloneArray(t))), enyo.log(n.stack);
}
}
}), enyo._objectCount = 0, enyo.Object.subclass = function(e, t) {
this.publish(e, t);
}, enyo.Object.publish = function(e, t) {
var n = t.published;
if (n) {
var r = e.prototype;
for (var i in n) enyo.Object.addGetterSetter(i, n[i], r);
}
}, enyo.Object.addGetterSetter = function(e, t, n) {
var r = e;
n[r] = t;
var i = enyo.cap(r), s = "get" + i;
n[s] || (n[s] = function() {
return this[r];
});
var o = "set" + i, u = r + "Changed";
n[o] || (n[o] = function(e) {
this._setProperty(r, e, u);
});
};

// Component.js

enyo.kind({
name: "enyo.Component",
kind: enyo.Object,
published: {
name: "",
id: "",
owner: null
},
statics: {
_kindPrefixi: {},
_unnamedKindNumber: 0
},
defaultKind: "Component",
handlers: {},
toString: function() {
return this.kindName;
},
constructor: function() {
this._componentNameMap = {}, this.$ = {}, this.inherited(arguments);
},
constructed: function(e) {
this.importProps(e), this.create();
},
importProps: function(e) {
if (e) for (var t in e) this[t] = e[t];
this.handlers = enyo.mixin(enyo.clone(this.kindHandlers), this.handlers);
},
create: function() {
this.ownerChanged(), this.initComponents();
},
initComponents: function() {
this.createChrome(this.kindComponents), this.createClientComponents(this.components);
},
createChrome: function(e) {
this.createComponents(e, {
isChrome: !0
});
},
createClientComponents: function(e) {
this.createComponents(e, {
owner: this.getInstanceOwner()
});
},
getInstanceOwner: function() {
return !this.owner || this.owner.notInstanceOwner ? this : this.owner;
},
destroy: function() {
this.destroyComponents(), this.setOwner(null), this.destroyed = !0;
},
destroyComponents: function() {
enyo.forEach(this.getComponents(), function(e) {
e.destroyed || e.destroy();
});
},
makeId: function() {
var e = "_", t = this.owner && this.owner.getId(), n = this.name || "@@" + ++enyo.Component._unnamedKindNumber;
return (t ? t + e : "") + n;
},
ownerChanged: function(e) {
e && e.removeComponent(this), this.owner && this.owner.addComponent(this), this.id || (this.id = this.makeId());
},
nameComponent: function(e) {
var t = enyo.Component.prefixFromKindName(e.kindName), n, r = this._componentNameMap[t] || 0;
do n = t + (++r > 1 ? String(r) : ""); while (this.$[n]);
return this._componentNameMap[t] = Number(r), e.name = n;
},
addComponent: function(e) {
var t = e.getName();
t || (t = this.nameComponent(e)), this.$[t] && this.warn('Duplicate component name "' + t + '" in owner "' + this.id + '" violates unique-name-under-owner rule, replacing existing component in the hash and continuing, but this is an error condition and should be fixed.'), this.$[t] = e;
},
removeComponent: function(e) {
delete this.$[e.getName()];
},
getComponents: function() {
var e = [];
for (var t in this.$) e.push(this.$[t]);
return e;
},
adjustComponentProps: function(e) {
this.defaultProps && enyo.mixin(e, this.defaultProps), e.kind = e.kind || e.isa || this.defaultKind, e.owner = e.owner || this;
},
_createComponent: function(e, t) {
if (!e.kind && "kind" in e) throw "enyo.create: Attempt to create a null kind. Check dependencies for [" + e.name + "].";
var n = enyo.mixin(enyo.clone(t), e);
return this.adjustComponentProps(n), enyo.Component.create(n);
},
createComponent: function(e, t) {
return this._createComponent(e, t);
},
createComponents: function(e, t) {
if (e) {
var n = [];
for (var r = 0, i; i = e[r]; r++) n.push(this._createComponent(i, t));
return n;
}
},
getBubbleTarget: function() {
return this.owner;
},
bubble: function(e, t, n) {
var r = t || {};
return "originator" in r || (r.originator = n || this), this.dispatchBubble(e, r, n);
},
bubbleUp: function(e, t, n) {
var r = this.getBubbleTarget();
return r ? r.dispatchBubble(e, t, this) : !1;
},
dispatchEvent: function(e, t, n) {
this.decorateEvent(e, t, n);
if (this.handlers[e] && this.dispatch(this.handlers[e], t, n)) return !0;
if (this[e]) return this.bubbleDelegation(this.owner, this[e], e, t, this);
},
dispatchBubble: function(e, t, n) {
return this.dispatchEvent(e, t, n) ? !0 : this.bubbleUp(e, t, n);
},
decorateEvent: function(e, t, n) {},
bubbleDelegation: function(e, t, n, r, i) {
var s = this.getBubbleTarget();
if (s) return s.delegateEvent(e, t, n, r, i);
},
delegateEvent: function(e, t, n, r, i) {
return this.decorateEvent(n, r, i), e == this ? this.dispatch(t, r, i) : this.bubbleDelegation(e, t, n, r, i);
},
dispatch: function(e, t, n) {
var r = e && this[e];
if (r) return r.call(this, n || this, t);
},
waterfall: function(e, t, n) {
if (this.dispatchEvent(e, t, n)) return !0;
this.waterfallDown(e, t, n || this);
},
waterfallDown: function(e, t, n) {
for (var r in this.$) this.$[r].waterfall(e, t, n);
}
}), enyo.defaultCtor = enyo.Component, enyo.create = enyo.Component.create = function(e) {
if (!e.kind && "kind" in e) throw "enyo.create: Attempt to create a null kind. Check dependencies for [" + (e.name || "") + "].";
var t = e.kind || e.isa || enyo.defaultCtor, n = enyo.constructorForKind(t);
return n || (console.error('no constructor found for kind "' + t + '"'), n = enyo.Component), new n(e);
}, enyo.Component.subclass = function(e, t) {
var n = e.prototype;
t.components && (n.kindComponents = t.components, delete n.components);
if (t.handlers) {
var r = n.kindHandlers;
n.kindHandlers = enyo.mixin(enyo.clone(r), n.handlers), n.handlers = null;
}
t.events && this.publishEvents(e, t);
}, enyo.Component.publishEvents = function(e, t) {
var n = t.events;
if (n) {
var r = e.prototype;
for (var i in n) this.addEvent(i, n[i], r);
}
}, enyo.Component.addEvent = function(e, t, n) {
var r, i;
enyo.isString(t) ? (e.slice(0, 2) != "on" && (enyo.warn("enyo.Component.addEvent: event names must start with 'on'. " + n.kindName + " event '" + e + "' was auto-corrected to 'on" + e + "'."), e = "on" + e), r = t, i = "do" + enyo.cap(e.slice(2))) : (r = t.value, i = t.caller), n[e] = r, n[i] || (n[i] = function(t) {
return this.bubble(e, t);
});
}, enyo.Component.prefixFromKindName = function(e) {
var t = enyo.Component._kindPrefixi[e];
if (!t) {
var n = e.lastIndexOf(".");
t = n >= 0 ? e.slice(n + 1) : e, t = t.charAt(0).toLowerCase() + t.slice(1), enyo.Component._kindPrefixi[e] = t;
}
return t;
};

// UiComponent.js

enyo.kind({
name: "enyo.UiComponent",
kind: enyo.Component,
published: {
container: null,
parent: null,
controlParentName: "client",
layoutKind: ""
},
handlers: {
onresize: "resizeHandler"
},
addBefore: undefined,
statics: {
_resizeFlags: {
showingOnly: !0
}
},
create: function() {
this.controls = [], this.children = [], this.containerChanged(), this.inherited(arguments), this.layoutKindChanged();
},
destroy: function() {
this.destroyClientControls(), this.setContainer(null), this.inherited(arguments);
},
importProps: function(e) {
this.inherited(arguments), this.owner || (this.owner = enyo.master);
},
createComponents: function() {
var e = this.inherited(arguments);
return this.discoverControlParent(), e;
},
discoverControlParent: function() {
this.controlParent = this.$[this.controlParentName] || this.controlParent;
},
adjustComponentProps: function(e) {
e.container = e.container || this, this.inherited(arguments);
},
containerChanged: function(e) {
e && e.removeControl(this), this.container && this.container.addControl(this, this.addBefore);
},
parentChanged: function(e) {
e && e != this.parent && e.removeChild(this);
},
isDescendantOf: function(e) {
var t = this;
while (t && t != e) t = t.parent;
return e && t == e;
},
getControls: function() {
return this.controls;
},
getClientControls: function() {
var e = [];
for (var t = 0, n = this.controls, r; r = n[t]; t++) r.isChrome || e.push(r);
return e;
},
destroyClientControls: function() {
var e = this.getClientControls();
for (var t = 0, n; n = e[t]; t++) n.destroy();
},
addControl: function(e, t) {
this.controls.push(e), this.addChild(e, t);
},
removeControl: function(e) {
return e.setParent(null), enyo.remove(e, this.controls);
},
indexOfControl: function(e) {
return enyo.indexOf(e, this.controls);
},
indexOfClientControl: function(e) {
return enyo.indexOf(e, this.getClientControls());
},
indexInContainer: function() {
return this.container.indexOfControl(this);
},
clientIndexInContainer: function() {
return this.container.indexOfClientControl(this);
},
controlAtIndex: function(e) {
return this.controls[e];
},
addChild: function(e, t) {
if (this.controlParent) this.controlParent.addChild(e); else {
e.setParent(this);
if (t !== undefined) {
var n = t === null ? 0 : this.indexOfChild(t);
this.children.splice(n, 0, e);
} else this.children.push(e);
}
},
removeChild: function(e) {
return enyo.remove(e, this.children);
},
indexOfChild: function(e) {
return enyo.indexOf(e, this.children);
},
layoutKindChanged: function() {
this.layout && this.layout.destroy(), this.layout = enyo.createFromKind(this.layoutKind, this), this.generated && this.render();
},
flow: function() {
this.layout && this.layout.flow();
},
reflow: function() {
this.layout && this.layout.reflow();
},
resized: function() {
this.waterfall("onresize", enyo.UiComponent._resizeFlags), this.waterfall("onpostresize", enyo.UiComponent._resizeFlags);
},
resizeHandler: function() {
this.reflow();
},
waterfallDown: function(e, t, n) {
for (var r in this.$) this.$[r] instanceof enyo.UiComponent || this.$[r].waterfall(e, t, n);
for (var i = 0, s = this.children, o; o = s[i]; i++) (o.showing || !t || !t.showingOnly) && o.waterfall(e, t, n);
},
getBubbleTarget: function() {
return this.parent;
}
}), enyo.createFromKind = function(e, t) {
var n = e && enyo.constructorForKind(e);
if (n) return new n(t);
}, enyo.master = new enyo.Component({
name: "master",
notInstanceOwner: !0,
eventFlags: {
showingOnly: !0
},
getId: function() {
return "";
},
isDescendantOf: enyo.nop,
bubble: function(e, t, n) {
e == "onresize" ? (enyo.master.waterfallDown("onresize", this.eventFlags), enyo.master.waterfallDown("onpostresize", this.eventFlags)) : enyo.Signals.send(e, t);
}
});

// Signals.js

enyo.kind({
name: "enyo.Signals",
kind: enyo.Component,
create: function() {
this.inherited(arguments), enyo.Signals.addListener(this);
},
destroy: function() {
enyo.Signals.removeListener(this), this.inherited(arguments);
},
notify: function(e, t) {
this.dispatchEvent(e, t);
},
statics: {
listeners: [],
addListener: function(e) {
this.listeners.push(e);
},
removeListener: function(e) {
enyo.remove(e, this.listeners);
},
send: function(e, t) {
enyo.forEach(this.listeners, function(n) {
n.notify(e, t);
});
}
}
});

// Async.js

enyo.kind({
name: "enyo.Async",
kind: enyo.Object,
published: {
timeout: 0
},
failed: !1,
context: null,
constructor: function() {
this.responders = [], this.errorHandlers = [];
},
accumulate: function(e, t) {
var n = t.length < 2 ? t[0] : enyo.bind(t[0], t[1]);
e.push(n);
},
response: function() {
return this.accumulate(this.responders, arguments), this;
},
error: function() {
return this.accumulate(this.errorHandlers, arguments), this;
},
route: function(e, t) {
var n = enyo.bind(this, "respond");
e.response(function(e, t) {
n(t);
});
var r = enyo.bind(this, "fail");
e.error(function(e, t) {
r(t);
}), e.go(t);
},
handle: function(e, t) {
var n = t.shift();
if (n) if (n instanceof enyo.Async) this.route(n, e); else {
var r = enyo.call(this.context || this, n, [ this, e ]);
r = r !== undefined ? r : e, (this.failed ? this.fail : this.respond).call(this, r);
}
},
startTimer: function() {
this.startTime = enyo.now(), this.timeout && (this.timeoutJob = setTimeout(enyo.bind(this, "timeoutComplete"), this.timeout));
},
endTimer: function() {
this.timeoutJob && (this.endTime = enyo.now(), clearTimeout(this.timeoutJob), this.timeoutJob = null, this.latency = this.endTime - this.startTime);
},
timeoutComplete: function() {
this.timedout = !0, this.fail("timeout");
},
respond: function(e) {
this.failed = !1, this.endTimer(), this.handle(e, this.responders);
},
fail: function(e) {
this.failed = !0, this.endTimer(), this.handle(e, this.errorHandlers);
},
recover: function() {
this.failed = !1;
},
go: function(e) {
return enyo.asyncMethod(this, function() {
this.respond(e);
}), this;
}
});

// json.js

enyo.json = {
stringify: function(e, t, n) {
return JSON.stringify(e, t, n);
},
parse: function(e, t) {
return e ? JSON.parse(e, t) : null;
}
};

// cookie.js

enyo.getCookie = function(e) {
var t = document.cookie.match(new RegExp("(?:^|; )" + e + "=([^;]*)"));
return t ? decodeURIComponent(t[1]) : undefined;
}, enyo.setCookie = function(e, t, n) {
var r = e + "=" + encodeURIComponent(t), i = n || {}, s = i.expires;
if (typeof s == "number") {
var o = new Date;
o.setTime(o.getTime() + s * 24 * 60 * 60 * 1e3), s = o;
}
s && s.toUTCString && (i.expires = s.toUTCString());
var u, a;
for (u in i) r += "; " + u, a = i[u], a !== !0 && (r += "=" + a);
document.cookie = r;
};

// xhr.js

enyo.xhr = {
request: function(e) {
var t = this.getXMLHttpRequest(e), n = e.method || "GET", r = !e.sync;
e.username ? t.open(n, enyo.path.rewrite(e.url), r, e.username, e.password) : t.open(n, enyo.path.rewrite(e.url), r), enyo.mixin(t, e.xhrFields), e.callback && this.makeReadyStateHandler(t, e.callback);
if (e.headers && t.setRequestHeader) for (var i in e.headers) t.setRequestHeader(i, e.headers[i]);
return typeof t.overrideMimeType == "function" && e.mimeType && t.overrideMimeType(e.mimeType), t.send(e.body || null), !r && e.callback && t.onreadystatechange(t), t;
},
cancel: function(e) {
e.onload && (e.onload = null), e.onreadystatechange && (e.onreadystatechange = null), e.abort && e.abort();
},
makeReadyStateHandler: function(e, t) {
window.XDomainRequest && e instanceof XDomainRequest && (e.onload = function() {
var n;
typeof e.responseText == "string" && (n = e.responseText), t.apply(null, [ n, e ]);
}), e.onreadystatechange = function() {
if (e.readyState == 4) {
var n;
typeof e.responseText == "string" && (n = e.responseText), t.apply(null, [ n, e ]);
}
};
},
inOrigin: function(e) {
var t = document.createElement("a"), n = !1;
t.href = e;
if (t.protocol === ":" || t.protocol === window.location.protocol && t.hostname === window.location.hostname && t.port === (window.location.port || (window.location.protocol === "https:" ? "443" : "80"))) n = !0;
return n;
},
getXMLHttpRequest: function(e) {
try {
if (enyo.platform.ie < 10 && window.XDomainRequest && !e.headers && !this.inOrigin(e.url) && !/^file:\/\//.test(window.location.href)) return new XDomainRequest;
} catch (t) {}
try {
return new XMLHttpRequest;
} catch (t) {}
return null;
}
};

// AjaxProperties.js

enyo.AjaxProperties = {
cacheBust: !0,
url: "",
method: "GET",
handleAs: "json",
contentType: "application/x-www-form-urlencoded",
sync: !1,
headers: null,
postBody: "",
username: "",
password: "",
xhrFields: null,
mimeType: null
};

// Ajax.js

enyo.kind({
name: "enyo.Ajax",
kind: enyo.Async,
published: enyo.AjaxProperties,
constructor: function(e) {
enyo.mixin(this, e), this.inherited(arguments);
},
go: function(e) {
return this.startTimer(), this.request(e), this;
},
request: function(e) {
var t = this.url.split("?"), n = t.shift() || "", r = t.length ? t.join("?").split("&") : [], i = null;
enyo.isString(e) ? i = e : e && r.push(enyo.Ajax.objectToQuery(e)), this.method == "GET" && (i && (r.push(i), i = null), this.cacheBust && !/^file:/i.test(n) && r.push(Math.random()));
var s = r.length ? [ n, r.join("&") ].join("?") : n, o = {};
i = this.postBody || i, this.method != "GET" && (this.method === "POST" && window.FormData && i instanceof FormData || (o["Content-Type"] = this.contentType)), enyo.mixin(o, this.headers), enyo.keys(o).length === 0 && (o = undefined);
try {
this.xhr = enyo.xhr.request({
url: s,
method: this.method,
callback: enyo.bind(this, "receive"),
body: i,
headers: o,
sync: window.PalmSystem ? !1 : this.sync,
username: this.username,
password: this.password,
xhrFields: this.xhrFields,
mimeType: this.mimeType
});
} catch (u) {
this.fail(u);
}
},
receive: function(e, t) {
if (!this.failed && !this.destroyed) {
var n;
typeof t.responseText == "string" && (n = t.responseText), this.xhrResponse = {
status: t.status,
headers: enyo.Ajax.parseResponseHeaders(t),
body: n
}, this.isFailure(t) ? this.fail(t.status) : this.respond(this.xhrToResponse(t));
}
},
fail: function(e) {
this.xhr && (enyo.xhr.cancel(this.xhr), this.xhr = null), this.inherited(arguments);
},
xhrToResponse: function(e) {
if (e) return this[(this.handleAs || "text") + "Handler"](e);
},
isFailure: function(e) {
try {
var t = "";
return typeof e.responseText == "string" && (t = e.responseText), e.status === 0 && t === "" ? !0 : e.status !== 0 && (e.status < 200 || e.status >= 300);
} catch (n) {
return !0;
}
},
xmlHandler: function(e) {
return e.responseXML;
},
textHandler: function(e) {
return e.responseText;
},
jsonHandler: function(e) {
var t = e.responseText;
try {
return t && enyo.json.parse(t);
} catch (n) {
return enyo.warn("Ajax request set to handleAs JSON but data was not in JSON format"), t;
}
},
statics: {
objectToQuery: function(e) {
var t = encodeURIComponent, n = [], r = {};
for (var i in e) {
var s = e[i];
if (s != r[i]) {
var o = t(i) + "=";
if (enyo.isArray(s)) for (var u = 0; u < s.length; u++) n.push(o + t(s[u])); else n.push(o + t(s));
}
}
return n.join("&");
},
parseResponseHeaders: function(e) {
var t = {}, n = [];
e.getAllResponseHeaders && (n = e.getAllResponseHeaders().split(/\r?\n/));
for (var r = 0; r < n.length; r++) {
var i = n[r], s = i.indexOf(": ");
if (s > 0) {
var o = i.substring(0, s), u = i.substring(s + 2);
t[o] = u;
}
}
return t;
}
}
});

// Jsonp.js

enyo.kind({
name: "enyo.JsonpRequest",
kind: enyo.Async,
published: {
url: "",
charset: null,
callbackName: "callback",
cacheBust: !0
},
statics: {
nextCallbackID: 0
},
addScriptElement: function() {
var e = document.createElement("script");
e.src = this.src, e.async = "async", this.charset && (e.charset = this.charset), e.onerror = enyo.bind(this, function() {
this.fail(400);
});
var t = document.getElementsByTagName("script")[0];
t.parentNode.insertBefore(e, t), this.scriptTag = e;
},
removeScriptElement: function() {
var e = this.scriptTag;
this.scriptTag = null, e.onerror = null, e.parentNode && e.parentNode.removeChild(e);
},
constructor: function(e) {
enyo.mixin(this, e), this.inherited(arguments);
},
go: function(e) {
return this.startTimer(), this.jsonp(e), this;
},
jsonp: function(e) {
var t = "enyo_jsonp_callback_" + enyo.JsonpRequest.nextCallbackID++;
this.src = this.buildUrl(e, t), this.addScriptElement(), window[t] = enyo.bind(this, this.respond);
var n = enyo.bind(this, function() {
this.removeScriptElement(), window[t] = null;
});
this.response(n), this.error(n);
},
buildUrl: function(e, t) {
var n = this.url.split("?"), r = n.shift() || "", i = n.join("?").split("&"), s = this.bodyArgsFromParams(e, t);
return i.push(s), this.cacheBust && i.push(Math.random()), [ r, i.join("&") ].join("?");
},
bodyArgsFromParams: function(e, t) {
if (enyo.isString(e)) return e.replace("=?", "=" + t);
var n = enyo.mixin({}, e);
return n[this.callbackName] = t, enyo.Ajax.objectToQuery(n);
}
});

// WebService.js

enyo.kind({
name: "enyo._AjaxComponent",
kind: enyo.Component,
published: enyo.AjaxProperties
}), enyo.kind({
name: "enyo.WebService",
kind: enyo._AjaxComponent,
published: {
jsonp: !1,
callbackName: "callback",
charset: null,
timeout: 0
},
events: {
onResponse: "",
onError: ""
},
constructor: function(e) {
this.inherited(arguments);
},
send: function(e) {
return this.jsonp ? this.sendJsonp(e) : this.sendAjax(e);
},
sendJsonp: function(e) {
var t = new enyo.JsonpRequest;
for (var n in {
url: 1,
callbackName: 1,
charset: 1,
timeout: 1
}) t[n] = this[n];
return this.sendAsync(t, e);
},
sendAjax: function(e) {
var t = new enyo.Ajax;
for (var n in enyo.AjaxProperties) t[n] = this[n];
return t.timeout = this.timeout, this.sendAsync(t, e);
},
sendAsync: function(e, t) {
return e.go(t).response(this, "response").error(this, "error");
},
response: function(e, t) {
this.doResponse({
ajax: e,
data: t
});
},
error: function(e, t) {
this.doError({
ajax: e,
data: t
});
}
});

// ../lib/uuid.js

(function() {
var e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
Math.uuid = function(t, n) {
var r = e, i = [];
n = n || r.length;
if (t) for (var s = 0; s < t; s++) i[s] = r[0 | Math.random() * n]; else {
var o;
i[8] = i[13] = i[18] = i[23] = "-", i[14] = "4";
for (var s = 0; s < 36; s++) i[s] || (o = 0 | Math.random() * 16, i[s] = r[s == 19 ? o & 3 | 8 : o]);
}
return i.join("");
}, Math.uuidFast = function() {
var t = e, n = new Array(36), r = 0, i;
for (var s = 0; s < 36; s++) s == 8 || s == 13 || s == 18 || s == 23 ? n[s] = "-" : s == 14 ? n[s] = "4" : (r <= 2 && (r = 33554432 + Math.random() * 16777216 | 0), i = r & 15, r >>= 4, n[s] = t[s == 19 ? i & 3 | 8 : i]);
return n.join("");
}, Math.uuidCompact = function() {
return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
var t = Math.random() * 16 | 0, n = e == "x" ? t : t & 3 | 8;
return n.toString(16);
}).toUpperCase();
};
})();

var Crypto = {};

(function() {
Crypto.MD5 = function(e) {
function t(e, t) {
return e << t | e >>> 32 - t;
}
function n(e, t) {
var n, r, i, s, o;
return i = e & 2147483648, s = t & 2147483648, n = e & 1073741824, r = t & 1073741824, o = (e & 1073741823) + (t & 1073741823), n & r ? o ^ 2147483648 ^ i ^ s : n | r ? o & 1073741824 ? o ^ 3221225472 ^ i ^ s : o ^ 1073741824 ^ i ^ s : o ^ i ^ s;
}
function r(e, t, n) {
return e & t | ~e & n;
}
function i(e, t, n) {
return e & n | t & ~n;
}
function s(e, t, n) {
return e ^ t ^ n;
}
function o(e, t, n) {
return t ^ (e | ~n);
}
function u(e, i, s, o, u, a, f) {
return e = n(e, n(n(r(i, s, o), u), f)), n(t(e, a), i);
}
function a(e, r, s, o, u, a, f) {
return e = n(e, n(n(i(r, s, o), u), f)), n(t(e, a), r);
}
function f(e, r, i, o, u, a, f) {
return e = n(e, n(n(s(r, i, o), u), f)), n(t(e, a), r);
}
function l(e, r, i, s, u, a, f) {
return e = n(e, n(n(o(r, i, s), u), f)), n(t(e, a), r);
}
function c(e) {
var t, n = e.length, r = n + 8, i = (r - r % 64) / 64, s = (i + 1) * 16, o = Array(s - 1), u = 0, a = 0;
while (a < n) t = (a - a % 4) / 4, u = a % 4 * 8, o[t] = o[t] | e.charCodeAt(a) << u, a++;
return t = (a - a % 4) / 4, u = a % 4 * 8, o[t] = o[t] | 128 << u, o[s - 2] = n << 3, o[s - 1] = n >>> 29, o;
}
function h(e) {
var t = "", n = "", r, i;
for (i = 0; i <= 3; i++) r = e >>> i * 8 & 255, n = "0" + r.toString(16), t += n.substr(n.length - 2, 2);
return t;
}
var p = Array(), d, v, m, g, y, b, w, E, S, x = 7, T = 12, N = 17, C = 22, k = 5, L = 9, A = 14, O = 20, M = 4, _ = 11, D = 16, P = 23, H = 6, B = 10, j = 15, F = 21;
p = c(e), b = 1732584193, w = 4023233417, E = 2562383102, S = 271733878;
for (d = 0; d < p.length; d += 16) v = b, m = w, g = E, y = S, b = u(b, w, E, S, p[d + 0], x, 3614090360), S = u(S, b, w, E, p[d + 1], T, 3905402710), E = u(E, S, b, w, p[d + 2], N, 606105819), w = u(w, E, S, b, p[d + 3], C, 3250441966), b = u(b, w, E, S, p[d + 4], x, 4118548399), S = u(S, b, w, E, p[d + 5], T, 1200080426), E = u(E, S, b, w, p[d + 6], N, 2821735955), w = u(w, E, S, b, p[d + 7], C, 4249261313), b = u(b, w, E, S, p[d + 8], x, 1770035416), S = u(S, b, w, E, p[d + 9], T, 2336552879), E = u(E, S, b, w, p[d + 10], N, 4294925233), w = u(w, E, S, b, p[d + 11], C, 2304563134), b = u(b, w, E, S, p[d + 12], x, 1804603682), S = u(S, b, w, E, p[d + 13], T, 4254626195), E = u(E, S, b, w, p[d + 14], N, 2792965006), w = u(w, E, S, b, p[d + 15], C, 1236535329), b = a(b, w, E, S, p[d + 1], k, 4129170786), S = a(S, b, w, E, p[d + 6], L, 3225465664), E = a(E, S, b, w, p[d + 11], A, 643717713), w = a(w, E, S, b, p[d + 0], O, 3921069994), b = a(b, w, E, S, p[d + 5], k, 3593408605), S = a(S, b, w, E, p[d + 10], L, 38016083), E = a(E, S, b, w, p[d + 15], A, 3634488961), w = a(w, E, S, b, p[d + 4], O, 3889429448), b = a(b, w, E, S, p[d + 9], k, 568446438), S = a(S, b, w, E, p[d + 14], L, 3275163606), E = a(E, S, b, w, p[d + 3], A, 4107603335), w = a(w, E, S, b, p[d + 8], O, 1163531501), b = a(b, w, E, S, p[d + 13], k, 2850285829), S = a(S, b, w, E, p[d + 2], L, 4243563512), E = a(E, S, b, w, p[d + 7], A, 1735328473), w = a(w, E, S, b, p[d + 12], O, 2368359562), b = f(b, w, E, S, p[d + 5], M, 4294588738), S = f(S, b, w, E, p[d + 8], _, 2272392833), E = f(E, S, b, w, p[d + 11], D, 1839030562), w = f(w, E, S, b, p[d + 14], P, 4259657740), b = f(b, w, E, S, p[d + 1], M, 2763975236), S = f(S, b, w, E, p[d + 4], _, 1272893353), E = f(E, S, b, w, p[d + 7], D, 4139469664), w = f(w, E, S, b, p[d + 10], P, 3200236656), b = f(b, w, E, S, p[d + 13], M, 681279174), S = f(S, b, w, E, p[d + 0], _, 3936430074), E = f(E, S, b, w, p[d + 3], D, 3572445317), w = f(w, E, S, b, p[d + 6], P, 76029189), b = f(b, w, E, S, p[d + 9], M, 3654602809), S = f(S, b, w, E, p[d + 12], _, 3873151461), E = f(E, S, b, w, p[d + 15], D, 530742520), w = f(w, E, S, b, p[d + 2], P, 3299628645), b = l(b, w, E, S, p[d + 0], H, 4096336452), S = l(S, b, w, E, p[d + 7], B, 1126891415), E = l(E, S, b, w, p[d + 14], j, 2878612391), w = l(w, E, S, b, p[d + 5], F, 4237533241), b = l(b, w, E, S, p[d + 12], H, 1700485571), S = l(S, b, w, E, p[d + 3], B, 2399980690), E = l(E, S, b, w, p[d + 10], j, 4293915773), w = l(w, E, S, b, p[d + 1], F, 2240044497), b = l(b, w, E, S, p[d + 8], H, 1873313359), S = l(S, b, w, E, p[d + 15], B, 4264355552), E = l(E, S, b, w, p[d + 6], j, 2734768916), w = l(w, E, S, b, p[d + 13], F, 1309151649), b = l(b, w, E, S, p[d + 4], H, 4149444226), S = l(S, b, w, E, p[d + 11], B, 3174756917), E = l(E, S, b, w, p[d + 2], j, 718787259), w = l(w, E, S, b, p[d + 9], F, 3951481745), b = n(b, v), w = n(w, m), E = n(E, g), S = n(S, y);
var I = h(b) + h(w) + h(E) + h(S);
return I.toLowerCase();
};
})();

// fixidb.js

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB, window.IDBCursor = window.IDBCursor || window.webkitIDBCursor, window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange, window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction, IDBTransaction = IDBTransaction || {}, IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || "readwrite", IDBTransaction.READ = IDBTransaction.READ || "readonly", IDBCursor = IDBCursor || {}, IDBCursor.NEXT = IDBCursor.NEXT || "next", IDBCursor.PREV = IDBCursor.PREV || "prev";

// RandomizedTimer.js

enyo.kind({
name: "RandomizedTimer",
kind: enyo.Component,
minInterval: 50,
published: {
baseInterval: 100,
percentTrigger: 50
},
events: {
onTriggered: ""
},
create: function() {
this.inherited(arguments), this.start();
},
destroy: function() {
this.stopTimer(), this.inherited(arguments);
},
start: function() {
this.job = window.setInterval(enyo.bind(this, "timer"), this.baseInterval);
},
stop: function() {
window.clearInterval(this.job);
},
timer: function() {
Math.random() < this.percentTrigger * .01 && this.doTriggered({
time: (new Date).getTime()
});
},
baseIntervalChanged: function(e) {
console.log("base"), this.baseInterval = Math.max(this.minInterval, this.baseInterval), this.stop(), this.start();
}
});

// DataLayout.js

enyo.kind({
name: "DataLayout",
kind: null,
constructor: function(e) {
this.container = e, e;
},
destroy: function() {
this.container;
}
});

// SundayDataIDB.js

enyo.kind({
name: "SundayDataIDB",
kind: "DataLayout",
published: {
database: "",
dbcallback: {},
needupgrade: !1
},
async: enyo.Async,
components: [ {
kind: "Signals",
onCommit: "commit"
} ],
DOC_STORE: "doc-store",
CONFIG_STORE: "config-store",
VIEW_STORE: "view-store",
idb: !1,
viewfunctions: {},
returnarray: {},
commit: function(e, t) {
var n = t.dispatchTarget;
},
handleerror: function(e, t) {
e.responders.length === 0 ? e.response(function(e, n) {
return {
ok: !1,
error: {
status: 500,
error: t.type,
reason: t.target
}
};
}) : e.go({
ok: !1,
error: {
status: 500,
error: t.type,
reason: t.target
}
});
},
success: function(e) {
console.log("onsuccess", e), this.idb = e.target.result;
var t = this.idb.transaction(this.DOC_STORE, IDBTransaction.READ), n = t.objectStore(this.DOC_STORE).openCursor();
n.onsuccess = enyo.bind(this, this.viewresults), n.onerror = enyo.bind(this, this.handleerror);
},
viewresults: function(e) {
var t = e.target.result;
if (t) {
var n = {
key: t.key,
id: t.primaryKey,
value: t.value
}, r = n.id.match(/^_design\/(.*)/);
if (r !== null) for (var i in n.value.views) this.viewfunctions[r[1] + "_" + i] = n.value.views[i].map;
t["continue"]();
} else this.unrollpreque();
},
unrollpreque: function() {
pq = this.preque;
var e = pq.length;
for (var t = 0; t < e; t++) pq[t].type === "builkDocs" ? this.bulkDocs(pq[t].docs, pq[t].async) : pq[t].type === "allDocs" ? this.allDocs(null, pq[t].async) : pq[t].type === "put" ? this.put(pq[t].doc, pq[t].options, pq[t].async) : pq[t].type === "get" ? this.get(pq[t].docid, pq[t].async) : pq[t].type === "remove" ? this.remove(pq[t].docid, pq[t].localrev, pq[t].async) : pq[t].type === "query" && this.remove(pq[t].fun, pq[t].options, pq[t].async);
this.preque = [];
},
versioncomplete: function(e) {
this.dbcallback.responders.length === 0 ? this.dbcallback.response(function(e, t) {
return {
ok: !0
};
}) : this.dbcallback.go({
ok: !0
});
},
versionsuccess: function(e, t) {
t.target.result.oncomplete = enyo.bind(this, this.versioncomplete), this.upgradeneeded(e);
},
upgradeneeded: function(e) {
var t = e.target.result.createObjectStore(this.DOC_STORE, {
keyPath: "_id"
}), n = e.target.result.createObjectStore(this.CONFIG_STORE, {
keyPath: "config"
});
},
constructor: function(e) {
this.inherited(arguments), this.preque = [], this.dbcallback = new enyo.Async, typeof e == "string" ? e && (this.database = e) : this.container.database !== undefined && (this.database = this.container.database);
var t = indexedDB.open(this.database);
t.onsuccess = enyo.bind(this, this.success), t.onerror = enyo.bind(this, this.handleerror, this.dbcallback), t.onupgradeneeded = enyo.bind(this, this.upgradeneeded), t.onblocked = function(e) {};
},
removeDB: function(e) {
this.idb.close();
var t = enyo.global.indexedDB.deleteDatabase(this.database);
return t.onsuccess = enyo.bind(this, this.removeDBsuccess, e), t.onerror = enyo.bind(this, this.handleerror, e), e;
},
removeDBsuccess: function(e, t) {
e.responders.length === 0 ? e.response(function(e, t) {
return {
ok: !0
};
}) : e.go({
ok: !0
});
},
runview: function(view, funstring, docu) {
if (docu !== undefined) {
var emit = function(e, t) {
docu["_view_" + view] = e, docu["_view_" + view + "_value"] = t;
};
eval("var fun = " + funstring), fun(docu), "_view_" + view in docu || (docu["_view_" + view] = null, docu["_view_" + view + "_value"] = null), async = new enyo.Async;
var txn = this.idb.transaction(this.DOC_STORE, IDBTransaction.READ_WRITE), datastore = txn.objectStore(this.DOC_STORE).get(docu._id);
datastore.onsuccess = enyo.bind(this, this.putupdate, async, docu), datastore.onerror = enyo.bind(this, this.handleerror, async);
} else {
var async = new enyo.Async, parent = this;
async.response(function(e, t) {
console.log("inSender", e), console.log("inResponse", t), console.log("parent", parent);
for (var n in t.rows) {
var r = t.rows[n].id.match(/^_design\/(.*)/);
r === null && parent.runview(view, funstring, t.rows[n].value);
}
}), this.allDocs({}, async);
}
},
upgradeneededview: function(e, t) {
var n = t.currentTarget.transaction.objectStore(this.DOC_STORE);
for (var r in e) n.createIndex(e[r].replace("/", "_"), "_view_" + e[r].replace("/", "_"), {
unique: !1
});
},
putview: function(e, t, n) {
this.idb = n.target.result;
var r = this.idb.transaction(this.DOC_STORE, IDBTransaction.READ_WRITE), i = r.objectStore(this.DOC_STORE).get(e._id);
i.onsuccess = enyo.bind(this, this.putupdate, t, e), i.onerror = enyo.bind(this, this.handleerror, t);
},
put: function(e, t, n) {
n === undefined && (n = new enyo.Async);
if (this.idb) {
e._id === undefined && (e._id = Math.uuid(32, 16).toLowerCase());
var r = e._id.match(/_design\/(.*)/);
e._localrev === undefined && (e._localrev = "1-" + Math.uuid(32, 16).toLowerCase());
if (r === null) {
if (this.viewfunctions.length !== 0) {
var i = this.idb.transaction(this.DOC_STORE, IDBTransaction.READ_WRITE), s = i.objectStore(this.DOC_STORE).get(e._id);
s.onsuccess = enyo.bind(this, this.putupdate, n, e), s.onerror = enyo.bind(this, this.handleerror, n);
for (var o in this.viewfunctions) this.runview(o, this.viewfunctions[o], e);
}
} else if (e.views !== undefined) {
var u = e._id.match(/^_design\/(.*)/), a = [];
for (var f in e.views) this.viewfunctions[u[1] + "_" + f] = e.views[f].map, a.push(u[1] + "/" + f), this.runview(u[1] + "/" + f, e.views[f].map);
var l = this.idb.version;
this.idb.close(), this.idb = !1;
var c = indexedDB.open(this.database, l + 1);
c.onsuccess = enyo.bind(this, this.putview, e, n), c.onerror = enyo.bind(this, this.handleerror, this.dbcallback), c.onupgradeneeded = enyo.bind(this, this.upgradeneededview, a), c.onblocked = function(e) {
console.log("got blocked:" + e);
};
}
} else this.preque.push({
type: "put",
doc: e,
options: t,
async: n
});
return n;
},
putupdate: function(e, t, n) {
var r = n.target.result, i = this.idb.transaction(this.DOC_STORE, IDBTransaction.READ_WRITE), s = {};
if (r) {
var o = r._deleted ? !0 : !1;
if (r._localrev !== undefined || o) if (o || r._localrev === t._localrev || parseInt(t._localrev[0], 10) > parseInt(r._localrev[0], 10)) {
if (!o) {
var u = parseInt(t._localrev[0], 10) + 1;
t._localrev = u + "-" + Math.uuid(32, 16).toLowerCase();
}
t._revhistory = r, s = i.objectStore(this.DOC_STORE).put(t), s.onsuccess = enyo.bind(this, this.putsuccess, e, t._localrev), s.onerror = enyo.bind(this, this.handleerror, e);
} else e.responders.length === 0 ? e.response(function(e, t) {
return {
error: "conflict",
reason: "Document update conflict."
};
}) : e.go({
error: "conflict",
reason: "Document update conflict."
});
} else s = i.objectStore(this.DOC_STORE).put(t), s.onsuccess = enyo.bind(this, this.putsuccess, e, t._localrev), s.onerror = enyo.bind(this, this.handleerror, e);
},
putsuccess: function(e, t, n) {
var r = n.target.result;
enyo.Signals.send("onCommit", {
status: "changed",
id: r,
sender: "SundayData.put",
database: this.databaseName
}), e.responders.length === 0 ? e.response(function(e, n) {
return {
ok: !0,
id: r,
localrev: t
};
}) : e.go({
ok: !0,
id: r,
localrev: t
});
},
bulkDocs: function(e, t, n) {
n === undefined && (n = new enyo.Async);
if (this.idb) {
var r = "bulk" + Math.uuid(32, 16).toLowerCase();
this.returnarray[r] = [];
var i = e.length;
putrespfun = function(e, t) {
t.ok === !0 ? this.bulkDocsresults(n, i, r, {
id: t.id,
localrev: t.localrev
}) : this.bulkDocsresults(n, i, r, t);
}, removerespfun = function(e, t) {
t.ok === !0 ? this.bulkDocsresults(n, i, r, {
id: t.id,
localrev: t.localrev,
_deleted: !0
}) : this.bulkDocsresults(n, i, r, t);
};
for (var s = 0; s < i; s++) {
var o = e[s];
if (o._deleted === undefined) {
var u = this.put(o);
u.response(this, putrespfun);
} else {
var a = this.remove(o._id, o._localrev);
a.response(this, removerespfun);
}
}
} else this.preque.push({
type: "builkDocs",
docs: e,
async: n
});
return n;
},
bulkDocsresults: function(e, t, n, r) {
this.returnarray[n].push(r);
if (this.returnarray[n].length === t) {
var i = this.returnarray[n];
delete this.returnarray[n], e.responders.length === 0 ? e.response(this, function(e, t) {
return i;
}) : e.go(i);
}
},
get: function(e, t) {
t === undefined && (t = new enyo.Async);
if (this.idb) {
var n = this.idb.transaction(this.DOC_STORE, IDBTransaction.READ), r = n.objectStore(this.DOC_STORE).get(e);
r.onsuccess = enyo.bind(this, this.getsuccess, t), r.onerror = enyo.bind(this, this.handleerror, t);
} else this.preque.push({
type: "get",
docid: e,
async: t
});
return t;
},
getsuccess: function(e, t) {
var n = t.target.result;
if (n !== undefined) {
if (n._revhistory !== undefined) {
delete n._revhistory;
var r = /^_view_.*/;
for (var i in n) i.match(r) !== null && delete n[i];
}
n._deleted ? e.responders.length === 0 ? e.response(function(e, t) {
return {
error: "Not Found",
reason: "Deleted"
};
}) : e.go({
error: "Not Found",
reason: "Deleted"
}) : e.responders.length === 0 ? e.response(function(e, t) {
return n;
}) : e.go(n);
} else e.responders.length === 0 ? e.response(function(e, t) {
return {
error: "Not Found"
};
}) : e.go({
error: "Not Found"
});
},
allDocs: function(e, t) {
t === undefined && (t = new enyo.Async);
if (this.idb) {
var n = "all" + Math.uuid(32, 16).toLowerCase();
this.returnarray[n] = [];
var r = this.idb.transaction(this.DOC_STORE, IDBTransaction.READ), i = r.objectStore(this.DOC_STORE).openCursor();
i.onsuccess = enyo.bind(this, this.allDocssuccess, t, n), i.onerror = enyo.bind(this, this.handleerror, t);
} else this.preque.push({
type: "allDocs",
async: t
});
return t;
},
allDocssuccess: function(e, t, n) {
var r = event.target.result;
if (r) {
var i = {
key: r.key,
id: r.primaryKey,
value: r.value
};
if (i.value._deleted === undefined) {
delete i.value._revhistory;
var s = /^_view_.*/;
for (var o in i.value) o.match(s) !== null && delete i.value[o];
this.returnarray[t].push(i);
}
r["continue"]();
} else {
var u = {
total_rows: this.returnarray[t].length,
rows: this.returnarray[t]
};
delete this.returnarray[t], e.responders.length === 0 ? e.response(this, function(e, t) {
return u;
}) : e.go(u);
}
},
query: function(e, t, n) {
n === undefined && (n = new enyo.Async);
if (this.idb) {
var r = "query" + Math.uuid(32, 16).toLowerCase();
this.returnarray[r] = [];
var i = this.idb.transaction(this.DOC_STORE, IDBTransaction.READ), s = i.objectStore(this.DOC_STORE), o = s.index(e.replace("/", "_")).openCursor();
o.onsuccess = enyo.bind(this, this.querysuccess, n, r, e), o.onerror = enyo.bind(this, this.handleerror, n);
} else this.preque.push({
type: "query",
fun: e,
options: t,
async: n
});
return n;
},
querysuccess: function(e, t, n, r) {
var i = event.target.result;
if (i) {
if (i.key !== null || i.value["_view_" + n.replace("/", "_") + "_value"] !== null) {
var s = {
key: i.key,
id: i.primaryKey,
value: i.value["_view_" + n.replace("/", "_") + "_value"]
};
if (s.value._deleted === undefined) {
delete s.value._revhistory;
var o = /^_view_.*/;
for (var u in s.value) u.match(o) !== null && delete s.value[u];
this.returnarray[t].push(s);
}
}
i["continue"]();
} else {
var a = {
total_rows: this.returnarray[t].length,
rows: this.returnarray[t]
};
delete this.returnarray[t], e.responders.length === 0 ? e.response(this, function(e, t) {
return a;
}) : e.go(a);
}
},
remove: function(e, t, n) {
n === undefined && (n = new enyo.Async);
if (this.idb) {
var r = this.idb.transaction(this.DOC_STORE, IDBTransaction.READ_WRITE), i = r.objectStore(this.DOC_STORE).get(e);
i.onsuccess = enyo.bind(this, this.removeget, n, t), i.onerror = enyo.bind(this, this.handleerror, n);
} else this.preque.push({
type: "remove",
docid: e,
localrev: t,
async: n
});
return n;
},
removeget: function(e, t, n) {
var r = n.target.result;
if (t === r._localrev) {
doc = {
_deleted: !0
}, doc._id = r._id, doc._localrev = r._localrev, doc._revhistory = r;
var i = this.idb.transaction(this.DOC_STORE, IDBTransaction.READ_WRITE), s = i.objectStore(this.DOC_STORE).put(doc);
s.onsuccess = enyo.bind(this, this.removesuccess, e, doc._id, doc._localrev), s.onerror = enyo.bind(this, this.handleerror, e);
}
},
removesuccess: function(e, t, n, r) {
e.responders.length === 0 ? e.response(function(e, r) {
return {
ok: !0,
id: t,
localrev: n
};
}) : e.go({
ok: !0,
id: t,
localrev: n
});
},
getConfig: function(e, t) {
t === undefined && (t = new enyo.Async);
if (this.idb) {
var n = this.idb.transaction(this.CONFIG_STORE, IDBTransaction.READ), r = n.objectStore(this.CONFIG_STORE).get(e);
r.onsuccess = enyo.bind(this, this.getconfigsuccess, t), r.onerror = enyo.bind(this, this.handleerror, t);
} else this.preque.push({
type: "get",
docid: e,
async: t
});
return t;
},
getconfigsuccess: function(e, t) {
var n = t.target.result;
n !== undefined && (e.responders.length === 0 ? e.response(function(e, t) {
return n;
}) : e.go(n));
}
});

// SundayDataHTTP.js

enyo.kind({
name: "SundayDataHTTP",
kind: "DataLayout",
published: {
database: "",
host: "",
dbcallback: {}
},
async: enyo.Ajax,
components: [ {
kind: "Signals",
onCommit: "commit"
} ],
returnarray: {},
commit: function(e, t) {
var n = t.dispatchTarget;
console.log("inSender", e), console.log("inEvent", t), console.log("dtarget", n);
},
handleerror: function(e, t) {
e.responders.length === 0 ? e.response(function(e, n) {
return {
ok: !1,
error: {
status: 500,
error: t.type,
reason: t.target
}
};
}) : e.go({
ok: !1,
error: {
status: 500,
error: t.type,
reason: t.target
}
});
},
constructor: function(e, t) {
this.inherited(arguments), this.start();
},
start: function(e, t) {
console.log("this", this), console.log("container", this.container), e === undefined && t === undefined && this.container !== undefined && (this.host = this.container.host, this.database = this.container.database), typeof t == "string" && t && (this.database = t), typeof e == "string" && e && (this.host = e), console.log("database", this.database), console.log("host", this.host), this.dbcallback = new enyo.Ajax({
url: this.host + "/" + this.database + "/",
method: "PUT",
contentType: "application/json",
cacheBust: !1
}), this.dbcallback.go();
},
removeDB: function(e) {
return e === undefined && (e = new enyo.Ajax), e.url = this.host + "/" + db + "/", e.go(), e;
},
put: function(e, t, n) {
return n === undefined && (n = new enyo.Ajax), n.url = this.host + "/" + this.database + "/", n.method = "POST", n.contentType = "application/json", n.cacheBust = !1, n.postBody = JSON.stringify(e), n.go(), n;
},
bulkDocs: function(e, t, n) {
return n === undefined && (n = new enyo.Ajax), n.url = this.host + "/" + this.database + "/_bulk_docs", n.method = "POST", n.contentType = "application/json", n.cacheBust = !1, n.go(JSON.stringify({
docs: e
})), n;
},
get: function(e, t) {
return t === undefined && (t = new enyo.Ajax), t.url = this.host + "/" + this.database + "/" + e, t.method = "GET", t.cacheBust = !1, t.go(), t;
},
allDocs: function(e, t) {
return t === undefined && (t = new enyo.Ajax), t.url = this.host + "/" + this.database + "/_all_docs", t.method = "GET", t.contentType = "application/json", t.cacheBust = !1, t.go(e), t;
},
query: function(e, t, n) {
var r, i;
if (typeof e == "string") {
var s = e.split("/");
r = s[0], i = s[1];
}
return n === undefined && (n = new enyo.Ajax), n.url = this.host + "/" + this.database + "/_design/" + r + "/_view/" + i, n.method = "GET", n.contentType = "application/json", n.cacheBust = !1, n.go(JSON.stringify(t)), n;
},
remove: function(e, t, n) {
return n === undefined && (n = new enyo.Ajax), n.url = this.host + "/" + this.database + "/" + e + "?rev=" + t, n.method = "DELETE", n.cacheBust = !1, n.go(), n;
},
changes: function(e, t) {
return e === undefined && (e = 0), t === undefined && (t = new enyo.Ajax), t.url = this.host + "/" + this.database + "/_changes?since=" + e, t.method = "GET", t.cacheBust = !1, t.go(), t;
}
});

// SundayData.js

enyo.kind({
name: "SundayData",
kind: "enyo.Component",
published: {
dataStore: "",
url: "",
database: "",
host: ""
},
data: null,
constructor: function(e) {
this.inherited(arguments), e !== undefined && typeof e == "string" && this.setUrl(e);
},
setUrl: function(e) {
var t = /idb\:\/\/(\w*)\/?/, n = /(https?\:\/\/\w*\:?\d*)\/(\w*)/;
if (typeof e == "string") {
var r = e.match(t);
if (r !== null) r[1] !== "" && (this.setDatabase(r[1]), this.setDataStore("SundayDataIDB")); else {
var i = e.match(n);
console.log(i), i !== null && i[1] !== "" && i[2] !== "" && (console.log("http"), this.setHost(i[1]), this.setDatabase(i[2]), this.setDataStore("SundayDataHTTP"));
}
}
},
dataStoreChanged: function() {
this.data && this.data.destroy(), this.host !== "" ? this.data = enyo.createFromKind(this.dataStore, this) : this.data = enyo.createFromKind(this.dataStore, this), this.generated && this.render();
},
removeDB: function(e) {
if (this.data) {
e === undefined && (e = new this.data.async);
var t = new SundayDataReturn;
return t.parent = this, e.error(function(e, t) {
var n = {
error: "Unknown",
reason: t
};
return this.recover(), n;
}), e.response(function(e, n) {
t.setValue(n), t.parent.data.destroy();
}), this.data.removeDB(e), t;
}
},
put: function(e, t, n) {
console.log("doc", e);
if (this.data) {
n === undefined && (n = new this.data.async);
var r = new SundayDataReturn;
return r.parent = this, n.error(function(e, t) {
var n = {
error: "Unknown",
reason: t
};
return this.recover(), n;
}), n.response(function(e, t) {
r.setValue(t);
}), this.data.put(e, t, n), r;
}
},
get: function(e, t, n) {
if (this.data) {
n === undefined && (n = new this.data.async);
var r = new SundayDataReturn;
return r.parent = this, n.error(function(e, t) {
var n = {
error: "Unknown",
reason: t
};
return t === 404 && (n = {
error: "Not Found",
reason: t
}), this.recover(), n;
}), n.response(function(e, t) {
r.setValue(t);
}), this.data.get(e, n), r;
}
},
allDocs: function(e, t) {
if (this.data) {
t === undefined && (t = new this.data.async);
var n = new SundayDataReturn;
return n.parent = this, t.error(function(e, t) {
var n = {
error: "Unknown",
reason: t
};
return this.recover(), n;
}), t.response(function(e, t) {
n.setValue(t);
}), this.data.allDocs(e, t), n;
}
},
bulkDocs: function(e, t, n) {
if (this.data) {
n === undefined && (n = new this.data.async);
var r = new SundayDataReturn;
return r.parent = this, n.error(function(e, t) {
var n = {
error: "Unknown",
reason: t
};
return this.recover(), n;
}), n.response(function(e, t) {
r.setValue(t);
}), this.data.bulkDocs(e, t, n), r;
}
},
remove: function(e, t, n) {
if (this.data) {
n === undefined && (n = new this.data.async);
var r = new SundayDataReturn;
return r.parent = this, n.error(function(e, t) {
var n = {
error: "Unknown",
reason: t
};
return t === 404 ? n = {
error: "Not Found",
reason: t
} : t === 409 && (n = {
error: "Conflict",
reason: t
}), this.recover(), n;
}), n.response(function(e, t) {
r.setValue(t);
}), this.data.remove(e, t, n), r;
}
},
query: function(e, t, n) {
if (this.data) {
n === undefined && (n = new this.data.async);
var r = new SundayDataReturn;
return r.parent = this, n.error(function(e, t) {
var n = {
error: "Unknown",
reason: t
};
return this.recover(), n;
}), n.response(function(e, t) {
r.setValue(t);
}), this.data.query(e, t, n), r;
}
},
replicate: function(e, t) {
if (this.data) {
var n = {}, r = /idb\:\/\/(\w*)\/?/, i = /(https?\:\/\/\w*\:?\d*)\/(\w*)/, s = e.match(r);
if (s !== null) s[1] !== "" && (n.database = s[1], n.dataStore = "SundayDataIDB", t = new enyo.Async); else {
var o = e.match(i);
o !== null && o[1] !== "" && o[2] !== "" && (n.host = o[1], n.database = o[2], n.dataStore = "SundayDataHTTP", t = new enyo.Ajax);
}
var u = enyo.createFromKind(n.DataStore, n);
console.log(u);
var a = this.data;
console.log("parent", a), t.response(function(e, t) {
console.log("inSender", e), console.log("inResponse", t), console.log("parent", a);
var n = [];
for (var r in t.rows) n.push(t.rows[r].doc);
console.log("docs", n), a.bulkDocs(n);
}), u.allDocs("include_docs=true&update_seq=true", t);
}
}
}), enyo.createFromKind = function(e, t) {
var n = e && enyo.constructorForKind(e);
if (n) return new n(t);
};

var SundayDataReturn = function() {
this.resultStack = [], this.value = null, this.parent = null, this.setValue = function(e) {
this.value = e, this._results(e);
}, this.done = function(e) {
e === undefined && (e = function(e) {
return console.log("value:", e), e;
});
if (this.value === null) this.resultStack.push(e); else {
var t = e(value);
t !== undefined ? this.setValue(t) : this.setValue(this.value);
}
return this;
}, this._results = function(e) {
if (this.resultStack.length > 0) {
var t = this.resultStack.shift(), n = t(e);
n !== null && (n !== undefined ? this.setValue(n) : this.setValue(this.value));
}
}, this.get = function(e, t) {
if (e === undefined) {
if (this.value !== null) return e = this.value.id === undefined ? this.value._id : this.value.id, e !== undefined ? this.parent.get(e) : this;
var n = this, r = function(e) {
if (e !== undefined) {
var t = e.id === undefined ? e._id : e.id;
t !== undefined ? n.parent.get(t).done(function(e) {
n.setValue(e);
}) : n.setValue(e);
}
return null;
};
return this.resultStack.push(r), this;
}
return this.parent.get(e, t);
}, this.put = function(e, t) {
if (e === undefined) {
if (this.value !== null) return id = this.value.id === undefined ? this.value._id : this.value.id, id !== undefined ? this.parent.put(this.value) : this;
var n = this, r = function(e) {
if (e !== undefined) {
var t = e.id === undefined ? e._id : e.id;
t !== undefined ? n.parent.put(e).done(function(e) {
n.setValue(e);
}) : n.setValue(e);
}
return null;
};
return this.resultStack.push(r), this;
}
return this.parent.put(e, t);
}, this.removeDB = function() {
return this.parent.removeDB();
}, this.bulkDocs = function(e, t) {
return this.parent.bulkDocs(e, t);
}, this.remove = function(e, t) {
if (e === undefined) {
if (this.value !== null) return e = this.value.id === undefined ? this.value._id : this.value.id, t = this.value.rev === undefined ? this.value._rev : this.value.rev, e !== undefined ? this.parent.remove(e, t) : this;
var n = this, r = function(e) {
if (e !== undefined) {
var t = e.id === undefined ? e._id : e.id, r = e.rev === undefined ? e._rev : e.rev;
t !== undefined ? n.parent.remove(t, r).done(function(e) {
n.setValue(e);
}) : n.setValue(e);
}
return null;
};
return this.resultStack.push(r), this;
}
return this.parent.remove(e, t);
}, this.query = function(e, t) {
return this.parent.query(e, t);
}, this.replicate = function(e) {
return this.parent.replicate(e);
};
};
