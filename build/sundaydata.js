
// enyo.js

var enyo = {};

enyo.pathResolverFactory = function() {
this.paths = {};
}, enyo.pathResolverFactory.prototype = {
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
}, enyo.log = function(e) {
console.log(e);
}, enyo.path = new enyo.pathResolverFactory, enyo.platform = {}, enyo.json = JSON, enyo.warn = enyo.log;

// lang.js

(function() {
enyo.global = this, enyo._getProp = function(e, t, n) {
var r = n || enyo.global;
for (var i = 0, s; r && (s = e[i]); i++) s === "enyo" ? r = enyo : r = s in r ? r[s] : t ? r[s] = {} : undefined;
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
}, enyo.isTrue = function(e) {
return e !== "false" && e !== !1 && e !== 0 && e !== null && e !== undefined;
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

// ../lib/enyo/source/kernel/job.js

enyo.job = function(e, t, n) {
enyo.job.stop(e), enyo.job._jobs[e] = setTimeout(function() {
enyo.job.stop(e), t();
}, n);
}, enyo.job.stop = function(e) {
enyo.job._jobs[e] && (clearTimeout(enyo.job._jobs[e]), delete enyo.job._jobs[e]);
}, enyo.job._jobs = {};

// ../lib/enyo/source/kernel/macroize.js

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

// ../lib/enyo/source/kernel/Oop.js

enyo.kind = function(e) {
enyo._kindCtors = {};
var t = e.name || "";
delete e.name;
var n = "kind" in e, r = e.kind;
delete e.kind;
var i = enyo.constructorForKind(r), s = i && i.prototype || null;
if (n && r === undefined || i === undefined) {
var o = r === undefined ? "undefined kind" : "unknown kind (" + r + ")";
throw "enyo.kind: Attempt to subclass an " + o + ". Check dependencies for [" + (t || "<unnamed>") + "].";
}
var u = enyo.kind.makeCtor();
return e.hasOwnProperty("constructor") && (e._constructor = e.constructor, delete e.constructor), enyo.setPrototype(u, s ? enyo.delegate(s) : {}), enyo.mixin(u.prototype, e), u.prototype.kindName = t, u.prototype.base = i, u.prototype.ctor = u, enyo.forEach(enyo.kind.features, function(t) {
t(u, e);
}), enyo.setObject(t, u), u;
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

// ../lib/enyo/source/kernel/Object.js

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

// ../lib/enyo/source/ajax/Async.js

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

// ../lib/enyo/source/ajax/xhr.js

enyo.xhr = {
request: function(e) {
var t = this.getXMLHttpRequest(e), n = enyo.path.rewrite(this.simplifyFileURL(e.url)), r = e.method || "GET", i = !e.sync, s = Math.random();
e.username ? t.open(r, n, i, e.username, e.password) : t.open(r, n, i), enyo.mixin(t, e.xhrFields), e.callback && this.makeReadyStateHandler(t, e.callback), e.headers = e.headers || {}, r !== "GET" && enyo.platform.ios && enyo.platform.ios >= 6 && e.headers["cache-control"] !== null && (e.headers["cache-control"] = e.headers["cache-control"] || "no-cache");
if (t.setRequestHeader) for (var o in e.headers) e.headers[o] && t.setRequestHeader(o, e.headers[o]);
return typeof t.overrideMimeType == "function" && e.mimeType && t.overrideMimeType(e.mimeType), t.send(e.body || null), !i && e.callback && t.onreadystatechange(t), t;
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
simplifyFileURL: function(e) {
var t = document.createElement("a"), n = !1;
return t.href = e, t.protocol === "file:" || t.protocol === ":" && window.location.protocol === "file:" ? t.protocol + "//" + t.host + t.pathname : t.protocol === ":" && window.location.protocol === "x-wmapp0:" ? window.location.protocol + "//" + window.location.pathname.split("/")[0] + "/" + t.host + t.pathname : e;
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

// ../lib/enyo/source/ajax/formdata.js

(function(e) {
function i() {
this.fake = !0, this._fields = [], this.boundary = "--------------------------";
for (var e = 0; e < 24; e++) this.boundary += Math.floor(Math.random() * 10).toString(16);
}
function s(e, t) {
this.name = t.name, this.type = t.type || "application/octet-stream";
if (!enyo.isArray(e)) throw new Error("enyo.Blob only handles Arrays of Strings");
if (e.length > 0 && typeof e[0] != "string") throw new Error("enyo.Blob only handles Arrays of Strings");
this._bufs = e;
}
if (e.FormData) try {
var t = new e.FormData, n = new e.Blob;
enyo.FormData = e.FormData, enyo.Blob = e.Blob;
return;
} catch (r) {}
i.prototype.getContentType = function() {
return "multipart/form-data; boundary=" + this.boundary;
}, i.prototype.append = function(e, t, n) {
this._fields.push([ e, t, n ]);
}, i.prototype.toString = function() {
var e = this.boundary, t = "";
return enyo.forEach(this._fields, function(n) {
t += "--" + e + "\r\n";
if (n[2] || n[1].name) {
var r = n[1], i = n[2] || r.name;
t += 'Content-Disposition: form-data; name="' + n[0] + '"; filename="' + i + '"\r\n', t += "Content-Type: " + r.type + "\r\n\r\n", t += r.getAsBinary() + "\r\n";
} else t += 'Content-Disposition: form-data; name="' + n[0] + '";\r\n\r\n', t += n[1] + "\r\n";
}), t += "--" + e + "--", t;
}, enyo.FormData = i, s.prototype.getAsBinary = function() {
var e = "", t = e.concat.apply(e, this._bufs);
return t;
}, enyo.Blob = s;
})(window);

// ../lib/enyo/source/ajax/AjaxProperties.js

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

// ../lib/enyo/source/ajax/Ajax.js

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
enyo.isString(e) ? i = e : e && (i = enyo.Ajax.objectToQuery(e)), i && (r.push(i), i = null), this.cacheBust && r.push(Math.random());
var s = r.length ? [ n, r.join("&") ].join("?") : n, o = {}, u;
this.method != "GET" && (u = this.postBody, this.method === "POST" && u instanceof enyo.FormData ? u.fake && (o["Content-Type"] = u.getContentType(), u = u.toString()) : (o["Content-Type"] = this.contentType, u instanceof Object && (this.contentType === "application/json" ? u = JSON.stringify(u) : this.contentType === "application/x-www-form-urlencoded" ? u = enyo.Ajax.objectToQuery(u) : u = u.toString()))), enyo.mixin(o, this.headers), enyo.keys(o).length === 0 && (o = undefined);
try {
this.xhr = enyo.xhr.request({
url: s,
method: this.method,
callback: enyo.bind(this, "receive"),
body: u,
headers: o,
sync: window.PalmSystem ? !1 : this.sync,
username: this.username,
password: this.password,
xhrFields: this.xhrFields,
mimeType: this.mimeType
});
} catch (a) {
this.fail(a);
}
},
receive: function(e, t) {
if (!this.failed && !this.destroyed) {
var n;
typeof t.responseText == "string" ? n = t.responseText : n = t.responseBody, this.xhrResponse = {
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
var o = i.substring(0, s).toLowerCase(), u = i.substring(s + 2);
t[o] = u;
}
}
return t;
}
}
});

// ../lib/enyo/source/ajax/Jsonp.js

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

// ../lib/sha1.js

function hex_sha1(e) {
return binb2hex(core_sha1(str2binb(e), e.length * chrsz));
}

function b64_sha1(e) {
return binb2b64(core_sha1(str2binb(e), e.length * chrsz));
}

function str_sha1(e) {
return binb2str(core_sha1(str2binb(e), e.length * chrsz));
}

function hex_hmac_sha1(e, t) {
return binb2hex(core_hmac_sha1(e, t));
}

function b64_hmac_sha1(e, t) {
return binb2b64(core_hmac_sha1(e, t));
}

function str_hmac_sha1(e, t) {
return binb2str(core_hmac_sha1(e, t));
}

function sha1_vm_test() {
return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

function core_sha1(e, t) {
e[t >> 5] |= 128 << 24 - t % 32, e[(t + 64 >> 9 << 4) + 15] = t;
var n = Array(80), r = 1732584193, i = -271733879, s = -1732584194, o = 271733878, u = -1009589776;
for (var a = 0; a < e.length; a += 16) {
var f = r, l = i, c = s, h = o, p = u;
for (var d = 0; d < 80; d++) {
d < 16 ? n[d] = e[a + d] : n[d] = rol(n[d - 3] ^ n[d - 8] ^ n[d - 14] ^ n[d - 16], 1);
var v = safe_add(safe_add(rol(r, 5), sha1_ft(d, i, s, o)), safe_add(safe_add(u, n[d]), sha1_kt(d)));
u = o, o = s, s = rol(i, 30), i = r, r = v;
}
r = safe_add(r, f), i = safe_add(i, l), s = safe_add(s, c), o = safe_add(o, h), u = safe_add(u, p);
}
return Array(r, i, s, o, u);
}

function sha1_ft(e, t, n, r) {
return e < 20 ? t & n | ~t & r : e < 40 ? t ^ n ^ r : e < 60 ? t & n | t & r | n & r : t ^ n ^ r;
}

function sha1_kt(e) {
return e < 20 ? 1518500249 : e < 40 ? 1859775393 : e < 60 ? -1894007588 : -899497514;
}

function core_hmac_sha1(e, t) {
var n = str2binb(e);
n.length > 16 && (n = core_sha1(n, e.length * chrsz));
var r = Array(16), i = Array(16);
for (var s = 0; s < 16; s++) r[s] = n[s] ^ 909522486, i[s] = n[s] ^ 1549556828;
var o = core_sha1(r.concat(str2binb(t)), 512 + t.length * chrsz);
return core_sha1(i.concat(o), 672);
}

function safe_add(e, t) {
var n = (e & 65535) + (t & 65535), r = (e >> 16) + (t >> 16) + (n >> 16);
return r << 16 | n & 65535;
}

function rol(e, t) {
return e << t | e >>> 32 - t;
}

function str2binb(e) {
var t = Array(), n = (1 << chrsz) - 1;
for (var r = 0; r < e.length * chrsz; r += chrsz) t[r >> 5] |= (e.charCodeAt(r / chrsz) & n) << 32 - chrsz - r % 32;
return t;
}

function binb2str(e) {
var t = "", n = (1 << chrsz) - 1;
for (var r = 0; r < e.length * 32; r += chrsz) t += String.fromCharCode(e[r >> 5] >>> 32 - chrsz - r % 32 & n);
return t;
}

function binb2hex(e) {
var t = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", n = "";
for (var r = 0; r < e.length * 4; r++) n += t.charAt(e[r >> 2] >> (3 - r % 4) * 8 + 4 & 15) + t.charAt(e[r >> 2] >> (3 - r % 4) * 8 & 15);
return n;
}

function binb2b64(e) {
var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = "";
for (var r = 0; r < e.length * 4; r += 3) {
var i = (e[r >> 2] >> 8 * (3 - r % 4) & 255) << 16 | (e[r + 1 >> 2] >> 8 * (3 - (r + 1) % 4) & 255) << 8 | e[r + 2 >> 2] >> 8 * (3 - (r + 2) % 4) & 255;
for (var s = 0; s < 4; s++) r * 8 + s * 6 > e.length * 32 ? n += b64pad : n += t.charAt(i >> 6 * (3 - s) & 63);
}
return n;
}

var hexcase = 0, b64pad = "=", chrsz = 8;

// fixidb.js

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB, window.IDBCursor = window.IDBCursor || window.webkitIDBCursor, window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange, window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction, IDBTransaction = IDBTransaction || {}, IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || "readwrite", IDBTransaction.READ = IDBTransaction.READ || "readonly", IDBCursor = IDBCursor || {}, IDBCursor.NEXT = IDBCursor.NEXT || "next", IDBCursor.PREV = IDBCursor.PREV || "prev";

// DataLayout.js

enyo.kind({
name: "DataLayout",
kind: null,
constructor: function(e) {
this.container = e;
},
destroy: function() {}
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
DOC_STORE: "doc-store",
CONFIG_STORE: "config-store",
ATTACHMENT_STORE: "attachment-store",
idb: !1,
max_number: 9007199254740992,
viewfunctions: {},
returnarray: {},
returnend: {},
returnattachments: {},
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
this.idb = e.target.result;
var t = this.idb.transaction(this.DOC_STORE, window.IDBTransaction.READ), n = t.objectStore(this.DOC_STORE).openCursor();
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
var e = this.preque, t = e.length;
for (var n = 0; n < t; n++) e[n].type === "builkDocs" ? this.bulkDocs(e[n].docs, e[n].async) : e[n].type === "allDocs" ? this.allDocs(e[n].options, e[n].async, e[n].config) : e[n].type === "put" ? this.put(e[n].doc, e[n].options, e[n].async, e[n].config) : e[n].type === "putAttachment" ? this.put(e[n].docid, e[n].rev, e[n].name, e[n].doc, e[n].async) : e[n].type === "putupdate" ? this.putupdate(e[n].async, e[n].doc, e[n].options, e[n].ev) : e[n].type === "runview" ? this.runview(e[n].view, e[n].funstring, e[n].docu) : e[n].type === "get" ? this.get(e[n].docid, e[n].async, e[n].config) : e[n].type === "getAttachment" ? this.get(e[n].docid, e[n].options, e[n].config) : e[n].type === "remove" ? this.remove(e[n].docid, e[n].localrev, e[n].async, e[n].config) : e[n].type === "query" && this.query(e[n].fun, e[n].options, e[n].async);
this.preque.pop();
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
}), r = e.target.result.createObjectStore(this.ATTACHMENT_STORE), i = e.target.transaction.objectStore(this.DOC_STORE);
i.createIndex("changes", "_update_seq", {
unique: !1
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
runview: function(view, funstring, docu, viewid, last) {
if (this.idb) if (docu !== undefined) {
if (docu._id !== undefined) {
var newdoc = {}, emit = function(e, t) {
newdoc["_view_" + view] = e, newdoc["_view_" + view + "_value"] = t;
}, log = console.log;
eval("var fun = " + funstring), fun(docu), "_view_" + view in newdoc || (newdoc["_view_" + view] = null, newdoc["_view_" + view + "_value"] = null);
if (view === last) {
enyo.mixin(docu, newdoc);
for (var viewdoc in this.returnarray[viewid]) enyo.mixin(docu, this.returnarray[viewid][viewdoc]);
async = new enyo.Async;
var txn = this.idb.transaction(this.DOC_STORE, window.IDBTransaction.READ_WRITE), datastore = txn.objectStore(this.DOC_STORE).get(docu._id);
datastore.onsuccess = enyo.bind(this, this.putupdate, async, docu, {
update_seq: !0
}), datastore.onerror = enyo.bind(this, this.handleerror, async);
} else this.returnarray[viewid].push(newdoc);
}
} else {
var async = new enyo.Async, parent = this;
async.response(function(e, t) {
for (var n in t.rows) {
var r = t.rows[n].id.match(/^_design\/(.*)/), i = t.rows[n].id;
r === null && (parent.returnarray[viewid + "_" + i] === undefined && (parent.returnarray[viewid + "_" + i] = []), parent.runview(view, funstring, t.rows[n].doc, viewid + "_" + i, last));
}
}), this.allDocs({
include_docs: !0
}, async);
} else this.preque.push({
type: "runview",
view: view,
funstring: funstring,
docu: docu
});
},
upgradeneededview: function(e, t) {
var n = t.currentTarget.transaction.objectStore(this.DOC_STORE);
for (var r in e) {
var i = e[r].replace("/", "_");
n.indexNames.contains(i) === !1 && n.createIndex(i, "_view_" + i, {
unique: !1
});
}
},
putview: function(e, t, n) {
this.idb = n.target.result;
var r = this.idb.transaction(this.DOC_STORE, window.IDBTransaction.READ_WRITE), i = r.objectStore(this.DOC_STORE).get(e._id);
i.onsuccess = enyo.bind(this, this.putupdate, t, e, {
update_seq: !0
}), i.onerror = enyo.bind(this, this.handleerror, t), this.unrollpreque();
},
put: function(e, t, n, r) {
n === undefined && (n = new enyo.Async);
var i = t ? t.update_seq : !1;
if (this.idb) {
var s = null, o, u, a;
r || (e._id === undefined && (e._id = Math.uuid(32, 16).toLowerCase()), e._localrev === undefined && (e._localrev = "1-" + Math.uuid(32, 16).toLowerCase()), s = e._id.match(/_design\/(.*)/));
if (s === null) {
var f = this.DOC_STORE, l;
if (r) {
f = this.CONFIG_STORE, l = this.idb.transaction(f, window.IDBTransaction.READ_WRITE);
var c = l.objectStore(f).put(e);
c.onsuccess = enyo.bind(this, this.putsuccess, n, ""), c.onerror = enyo.bind(this, this.handleerror, n);
} else {
l = this.idb.transaction(f, window.IDBTransaction.READ_WRITE);
var h = l.objectStore(f).get(e._id);
h.onsuccess = enyo.bind(this, this.putupdate, n, e, t), h.onerror = enyo.bind(this, this.handleerror, n), o = [];
for (var p in this.viewfunctions) o.push(p);
if (o.length !== 0) {
a = "views" + Math.uuid(32, 16).toLowerCase(), this.returnarray[a] = [], u = o[o.length - 1];
for (var d in this.viewfunctions) this.runview(d, this.viewfunctions[d], e, a, u);
}
}
} else if (e.views !== undefined) {
var v = e._id.match(/^_design\/(.*)/), m = [];
o = [];
for (var g in e.views) o.push(g);
u = v[1] + "_" + o[o.length - 1], a = "views" + Math.uuid(32, 16).toLowerCase();
for (var y in e.views) {
var b = v[1] + "_" + y;
this.viewfunctions[b] = e.views[y].map, m.push(b), enyo.job(b, enyo.bind(this, "runview", b, e.views[y].map, undefined, a, u), 50);
}
var w = this.idb.version;
this.idb.close(), this.idb = !1;
var E = indexedDB.open(this.database, w + 1);
E.onsuccess = enyo.bind(this, this.putview, e, n), E.onerror = enyo.bind(this, this.handleerror, this.dbcallback), E.onupgradeneeded = enyo.bind(this, this.upgradeneededview, m), E.onblocked = function(e) {};
}
} else this.preque.push({
type: "put",
doc: e,
options: t,
config: r,
async: n
});
return n;
},
putAttachment: function(e, t, n) {
n === undefined && (n = new enyo.Async);
if (this.idb) {
store = this.ATTACHMENT_STORE, txn = this.idb.transaction(store, window.IDBTransaction.READ_WRITE);
var r = txn.objectStore(store).put(t, e);
r.onsuccess = enyo.bind(this, this.putsuccess, n, ""), r.onerror = enyo.bind(this, this.handleerror, n);
} else this.preque.push({
type: "putAttachment",
docid: docd,
rev: rev,
name: name,
doc: t,
async: n
});
return n;
},
putupdate: function(e, t, n, r) {
if (this.idb) {
var i = r.target.result, s = this.DOC_STORE, o = this.idb.transaction(s, window.IDBTransaction.READ_WRITE), u = {}, a = n ? n.update_seq : !1;
if (i) {
var f = i._deleted ? !0 : !1, l = i._rev !== undefined ? i._rev[0] : 0, c = t._rev !== undefined ? t._rev[0] : 0, h = c > l, p = /^_view_.*/;
for (var d in i.doc) d.match(p) !== null && t[d] === undefined && (t[d] = i[d]);
if (h || i._localrev !== undefined || f) if (h || f || i._localrev === t._localrev || parseInt(t._localrev[0], 10) > parseInt(i._localrev[0], 10)) {
if (!f && !a) {
var v;
h ? v = parseInt(i._localrev[0], 10) + 1 : v = parseInt(t._localrev[0], 10) + 1, t._localrev = v + "-" + Math.uuid(32, 16).toLowerCase();
}
t._revhistory = i, a || (t._update_seq = this.max_number), u = o.objectStore(s).put(t), u.onsuccess = enyo.bind(this, this.putsuccess, e, t._localrev), u.onerror = enyo.bind(this, this.handleerror, e);
} else e.responders.length === 0 ? e.response(function(e, t) {
return {
error: "conflict",
reason: "Document update conflict."
};
}) : e.go({
error: "conflict",
reason: "Document update conflict."
});
} else a || (t._update_seq = this.max_number), u = o.objectStore(s).put(t), u.onsuccess = enyo.bind(this, this.putsuccess, e, t._localrev), u.onerror = enyo.bind(this, this.handleerror, e);
} else this.preque.push({
type: "putupdate",
doc: t,
options: n,
ev: r,
async: e
});
},
putsuccess: function(e, t, n) {
var r = n.target.result;
e.responders.length === 0 ? e.response(function(e, n) {
return {
ok: !0,
id: r,
rev: t
};
}) : e.go({
ok: !0,
id: r,
rev: t
});
},
bulkDocs: function(e, t, n) {
var r = this;
n === undefined && (n = new enyo.Async);
var i = t.update_seq ? {
update_seq: !0
} : {};
if (this.idb) {
var s = "bulk" + Math.uuid(32, 16).toLowerCase();
this.returnarray[s] = [];
var o = e.length, u = function(e, t) {
t.ok === !0 ? this.bulkDocsresults(n, o, s, {
id: t.id,
rev: t.rev
}) : this.bulkDocsresults(n, o, s, t);
}, a = function(e, t) {
t.ok === !0 ? this.bulkDocsresults(n, o, s, {
id: t.id,
rev: t.rev,
_deleted: !0
}) : this.bulkDocsresults(n, o, s, t);
};
for (var f = 0; f < o; f++) {
var l = e[f];
if (l._deleted === undefined) {
var c = this.put(l, i);
c.response(this, u);
} else {
var h = this.remove(l._id, l._localrev);
h.response(this, a);
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
get: function(e, t, n) {
t === undefined && (t = new enyo.Async);
if (this.idb) {
var r = this.DOC_STORE;
n && (r = this.CONFIG_STORE);
var i = this.idb.transaction(r, window.IDBTransaction.READ), s = i.objectStore(r).get(e);
s.onsuccess = enyo.bind(this, this.getsuccess, t), s.onerror = enyo.bind(this, this.handleerror, t);
} else this.preque.push({
type: "get",
docid: e,
config: n,
async: t
});
return t;
},
getAttachment: function(e, t, n) {
n === undefined && (n = new enyo.Async);
if (this.idb) {
var r = this.ATTACHMENT_STORE, i = this.idb.transaction(r, window.IDBTransaction.READ), s = i.objectStore(r).get(e);
s.onsuccess = enyo.bind(this, this.getsuccess, n), s.onerror = enyo.bind(this, this.handleerror, n);
} else this.preque.push({
type: "getAttachment",
docid: e,
options: t,
async: n
});
return n;
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
allDocs: function(e, t, n) {
t === undefined && (t = new enyo.Async);
if (this.idb) {
var r = "all" + Math.uuid(32, 16).toLowerCase();
this.returnarray[r] = [];
var i = this.DOC_STORE;
n && (i = this.CONFIG_STORE);
var s = this.idb.transaction(i, window.IDBTransaction.READ), o = s.objectStore(i).openCursor();
o.onsuccess = enyo.bind(this, this.allDocssuccess, t, r, e), o.onerror = enyo.bind(this, this.handleerror, t);
} else this.preque.push({
type: "allDocs",
options: e,
config: n,
async: t
});
return t;
},
attachmentResponse: function(e, t, n, r, i, s, o, u) {
var a = new this.async;
a.error(function(t, n) {
var r = {
error: "Unknown",
reason: n
};
return e.recover(), r;
}), a.response(function(r, a) {
e.returnattachments[n].pop();
if (o !== undefined && o.base64) {
var f = /^data:.+\/(.+);base64,(.*)$/, l = a.match(f);
l.length > 2 && (i.doc._attachments[s].data = l[2]);
} else i.doc._attachments[s].data = a;
o !== undefined && !o.include_docs && delete i.doc, e.returnarray[n].push(i), e.returnattachments[n].length === 0 && e.returnend[n] === !0 && u(t, n, {}, {
target: {
result: !1
}
});
}), this.getAttachment(r, {}, a);
},
allDocssuccess: function(e, t, n, r) {
var i = r.target.result;
if (i) {
var s = {
key: i.key,
id: i.primaryKey,
value: {
rev: i.value._localrev
},
doc: i.value
};
if (s.doc._deleted === undefined) {
delete s.doc._revhistory;
var o = /^_view_.*/;
for (var u in s.doc) u.match(o) !== null && delete s.doc[u];
if (n !== undefined && n.attachments) {
this.returnattachments[t] === undefined && (this.returnattachments[t] = []);
for (var a in s.doc._attachments) {
this.returnattachments[t].push(a);
var f = s.doc._attachments[a].data, l = this;
this.attachmentResponse(l, e, t, f, s, a, n, enyo.bind(this, this.allDocssuccess));
}
} else n !== undefined && !n.include_docs && delete s.doc, this.returnarray[t].push(s);
}
i["continue"]();
} else if (n !== undefined && !n.attachments || this.returnattachments[t] === undefined || this.returnattachments[t].length === 0) {
var c = {
total_rows: this.returnarray[t].length,
rows: this.returnarray[t]
};
delete this.returnarray[t], e.responders.length === 0 ? e.response(this, function(e, t) {
return c;
}) : e.go(c);
} else this.returnend[t] = !0;
},
changes: function(e, t) {
t === undefined && (t = new enyo.Async);
if (this.idb) {
var n = "changes" + Math.uuid(32, 16).toLowerCase();
this.returnarray[n] = [];
var r = this.idb.transaction(this.DOC_STORE, window.IDBTransaction.READ), i = r.objectStore(this.DOC_STORE), s = i.index("changes").openCursor();
s.onsuccess = enyo.bind(this, this.changessuccess, t, n, e), s.onerror = enyo.bind(this, this.handleerror, t);
} else this.preque.push({
type: "query",
fun: fun,
options: e,
async: t
});
return t;
},
changessuccess: function(e, t, n, r) {
var i = r.target.result;
if (i) {
if (i.key !== null && i.value._update_seq === this.max_number) {
var s = {
id: i.primaryKey,
changes: [ {
rev: i.value._localrev
} ],
doc: i.value
};
delete s.doc._revhistory;
var o = /^_view_.*/;
for (var u in s.doc) u.match(o) !== null && delete s.doc[u];
if (n !== undefined && n.attachments) {
this.returnattachments[t] === undefined && (this.returnattachments[t] = []);
for (var a in s.doc._attachments) {
this.returnattachments[t].push(a);
var f = s.doc._attachments[a].data, l = this;
this.attachmentResponse(l, e, t, f, s, a, n, enyo.bind(this, this.changessuccess));
}
} else n !== undefined && !n.include_docs && delete s.doc, this.returnarray[t].push(s);
}
i["continue"]();
} else if (n !== undefined && !n.attachments || this.returnattachments[t] === undefined || this.returnattachments[t].length === 0) {
var c = {
results: this.returnarray[t]
};
delete this.returnarray[t], e.responders.length === 0 ? e.response(this, function(e, t) {
return c;
}) : e.go(c);
} else this.returnend[t] = !0;
},
query: function(e, t, n) {
n === undefined && (n = new enyo.Async);
if (this.idb) {
var r = "query" + Math.uuid(32, 16).toLowerCase();
this.returnarray[r] = [];
var i = this.idb.transaction(this.DOC_STORE, window.IDBTransaction.READ), s = i.objectStore(this.DOC_STORE);
if (s.indexNames.contains(e.replace("/", "_"))) {
var o = s.index(e.replace("/", "_")).openCursor();
o.onsuccess = enyo.bind(this, this.querysuccess, n, r, e), o.onerror = enyo.bind(this, this.handleerror, n);
} else n.response(function(t, n) {
return {
ok: !1,
error: {
status: 500,
error: "query function does not excist",
reason: e
}
};
});
} else this.preque.push({
type: "query",
fun: e,
options: t,
async: n
});
return n;
},
querysuccess: function(e, t, n, r) {
var i = r.target.result;
if (i) {
if (i.key !== null) {
var s = {
key: i.key,
id: i.primaryKey,
value: i.value["_view_" + n.replace("/", "_") + "_value"],
doc: i.value
};
if (s.doc && s.doc._deleted === undefined) {
delete s.doc._revhistory;
var o = /^_view_.*/;
for (var u in s.doc) u.match(o) !== null && delete s.doc[u];
this.returnarray[t].push(s);
}
}
i["continue"]();
} else {
var a = {
rows: this.returnarray[t]
};
delete this.returnarray[t], e.responders.length === 0 ? e.response(this, function(e, t) {
return a;
}) : e.go(a);
}
},
remove: function(e, t, n, r) {
n === undefined && (n = new enyo.Async);
if (this.idb) {
var i = this.DOC_STORE;
r && (i = this.CONFIG_STORE);
var s = this.idb.transaction(i, window.IDBTransaction.READ_WRITE), o = s.objectStore(i).get(e);
o.onsuccess = enyo.bind(this, this.removeget, n, t, r), o.onerror = enyo.bind(this, this.handleerror, n);
} else this.preque.push({
type: "remove",
docid: e,
localrev: t,
config: r,
async: n
});
return n;
},
removeget: function(e, t, n, r) {
var i = r.target.result, s = this.DOC_STORE;
n && (s = this.CONFIG_STORE);
if (i && t === i._localrev) {
doc = {
_deleted: !0
}, doc._id = i._id, doc._localrev = i._localrev, doc._revhistory = i;
var o = this.idb.transaction(s, window.IDBTransaction.READ_WRITE), u = o.objectStore(s).put(doc);
u.onsuccess = enyo.bind(this, this.removesuccess, e, doc._id, doc._localrev), u.onerror = enyo.bind(this, this.handleerror, e);
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
replicate: function(e, t, n) {
var r = new e.async, i = new e.async, s = new this.async, o = this;
r.response(function(e, t) {
var r = [], i = t.update_seq;
i !== undefined && o.put({
config: "update_seq",
value: i
}, undefined, undefined, !0);
for (var s in t.rows) delete t.rows[s].doc._localrev, i !== undefined && (t.rows[s].doc._update_seq = i), r.push(t.rows[s].doc);
t.total_rows > 0 ? o.bulkDocs(r, {
update_seq: !0
}, n) : n.go({});
}), i.response(function(e, t) {
var r = [], i = t.last_seq;
i !== undefined && o.put({
config: "update_seq",
value: i
}, undefined, undefined, !0);
for (var s in t.results) delete t.results[s].doc._localrev, i !== undefined && (t.results[s].doc._update_seq = i), r.push(t.results[s].doc);
r.length > 0 ? o.bulkDocs(r, {
update_seq: !0
}, n) : n.go({});
}), s.response(function(n, s) {
s.value !== undefined ? e.changes(s.value, t, i) : t !== undefined ? (t.include_docs = !0, t.update_seq = !0, e.allDocs(t, r)) : e.allDocs({
include_docs: !0,
update_seq: !0
}, r);
}), this.get("update_seq", s, !0);
}
});

// SundayDataHTTP.js

enyo.kind({
name: "SundayDataHTTP",
kind: "DataLayout",
published: {
database: "",
host: "",
dbcallback: {},
username: "",
password: ""
},
async: enyo.Ajax,
returnarray: {},
authHeader: function() {
var e = "Basic " + binb2b64(str2binb(this.username + ":" + this.password));
return e;
},
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
constructor: function(e, t, n, r) {
this.inherited(arguments), this.start();
},
start: function(e, t, n, r) {
e === undefined && t === undefined && this.container !== undefined && (this.host = this.container.host, this.database = this.container.database, this.username = this.container.username, this.password = this.container.password), typeof t == "string" && t && (this.database = t), typeof e == "string" && e && (this.host = e), typeof n == "string" && n && (this.username = n), typeof r == "string" && r && (this.password = r), this.dbcallback = new enyo.Ajax({
url: this.host + "/" + this.database + "/",
method: "PUT",
contentType: "application/json",
cacheBust: !1
}), this.username !== "" && this.password !== "" && (this.dbcallback.headers = {
Authorization: this.authHeader()
}), this.dbcallback.go();
},
removeDB: function(e) {
return e === undefined && (e = new enyo.Ajax), e.url = this.host + "/" + this.database + "/", e.cacheBust = !1, e.method = "DELETE", this.username !== "" && this.password !== "" && (e.headers = {
Authorization: this.authHeader()
}), e.go(), e;
},
put: function(e, t, n) {
return n === undefined && (n = new enyo.Ajax), n.contentType = "application/json", n.cacheBust = !1, n.url = this.host + "/" + this.database + "/", n.method = "POST", n.postBody = JSON.stringify(e), this.username !== "" && this.password !== "" && (n.headers = {
Authorization: this.authHeader()
}), n.go(), n;
},
bulkDocs: function(e, t, n) {
n === undefined && (n = new enyo.Ajax), n.url = this.host + "/" + this.database + "/_bulk_docs", n.method = "POST", n.contentType = "application/json", n.cacheBust = !1;
var r = enyo.mixin({
docs: e
}, t);
return n.postBody = JSON.stringify(r), this.username !== "" && this.password !== "" && (n.headers = {
Authorization: this.authHeader()
}), n.go(), n;
},
get: function(e, t) {
return t === undefined && (t = new enyo.Ajax), t.url = this.host + "/" + this.database + "/" + e, t.method = "GET", t.cacheBust = !1, this.username !== "" && this.password !== "" && (t.headers = {
Authorization: this.authHeader()
}), t.go(), t;
},
allDocs: function(e, t) {
return t === undefined && (t = new enyo.Ajax), t.url = this.host + "/" + this.database + "/_all_docs", t.method = "GET", t.contentType = "application/json", t.cacheBust = !1, this.username !== "" && this.password !== "" && (t.headers = {
Authorization: this.authHeader()
}), t.go(e), t;
},
query: function(e, t, n) {
var r, i;
if (typeof e == "string") {
var s = e.split("/");
r = s[0], i = s[1];
}
return n === undefined && (n = new enyo.Ajax), n.url = this.host + "/" + this.database + "/_design/" + r + "/_view/" + i, n.method = "GET", n.contentType = "application/json", n.cacheBust = !1, this.username !== "" && this.password !== "" && (n.headers = {
Authorization: this.authHeader()
}), n.go(JSON.stringify(t)), n;
},
remove: function(e, t, n) {
return n === undefined && (n = new enyo.Ajax), n.url = this.host + "/" + this.database + "/" + e + "?rev=" + t, n.method = "DELETE", n.cacheBust = !1, this.username !== "" && this.password !== "" && (n.headers = {
Authorization: this.authHeader()
}), n.go(), n;
},
changes: function(e, t, n) {
e === undefined && (e = 0);
var r = "";
if (t !== undefined) for (var i in t) r += "&" + i + "=" + t[i];
return n === undefined && (n = new enyo.Ajax), n.url = this.host + "/" + this.database + "/_changes?include_docs=true&since=" + e + r, n.method = "GET", n.cacheBust = !1, this.username !== "" && this.password !== "" && (n.headers = {
Authorization: this.authHeader()
}), n.go(), n;
},
replicate: function(e, t, n) {
var r = new e.async, i = new this.async, s = this, o = [];
i.response(function(t, r) {
if (o.length > 0) {
var i = [];
for (var s in r) {
var u = r[s], a = o[s];
u.ok && (a._rev = u.rev), i.push(a);
}
e.bulkDocs(o, {
update_seq: !0
}, n);
} else n.go(r);
}), r.response(function(e, t) {
var r = [];
for (var u in t.results) {
var a = t.results[u].doc;
o.push(a), delete a._localrev, delete a._update_seq, r.push(a);
}
r.length > 0 ? s.bulkDocs(r, {}, i) : n.go({});
}), t !== undefined && t.attachments ? e.changes({
include_docs: !0,
attachments: !0,
base64: !0
}, r) : e.changes({
include_docs: !0
}, r);
}
});

// SundayData.js

enyo.kind({
name: "SundayData",
kind: "enyo.Object",
published: {
dataStore: "",
url: "",
database: "",
username: "",
password: "",
host: ""
},
data: null,
idbcheck: /idb\:\/\/([\w\-]+)\/?/,
httpcheck: /((https?\:\/\/)?(\w*\:\w*@)?[\w\.]*\:?\d*)\/([\w\-]+)/,
constructor: function(e) {
this.inherited(arguments), e !== undefined && typeof e == "string" && this.setUrl(e);
},
setUrl: function(e) {
if (typeof e == "string") {
var t = e.match(this.idbcheck);
if (t !== null) t[1] !== "" && (this.setDatabase(t[1]), this.setDataStore("SundayDataIDB")); else {
var n = e.match(this.httpcheck);
if (n !== null && n[1] !== "" && n[4] !== "") {
if (n[3] !== undefined) {
var r = n[3];
r = r.replace(/@$/, "").split(":"), this.setUsername(r[0]), this.setPassword(r[1]);
}
this.setHost(n[1].replace(n[3], "")), this.setDatabase(n[4]), this.setDataStore("SundayDataHTTP");
}
}
}
},
dataStoreChanged: function() {
this.data && this.data.destroy(), this.data = enyo.createFromKind(this.dataStore, this), this.generated && this.render();
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
t.parent.data.destroy(), t.parent.dataStore = "", t.parent.url = "", t.parent.database = "", t.parent.username = "", t.parent.password = "", t.parent.host = "", t.setValue(n);
}), this.data.removeDB(e), t;
}
},
put: function(e, t, n) {
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
putAttachment: function(e, t, n) {
if (this.data) {
n === undefined && (n = new this.data.async, getasync = new this.data.async);
var r = new SundayDataReturn;
r.parent = this;
var i = this;
return getasync.error(function(e, t) {
var n = {
error: "Unknown",
reason: t
};
return this.recover(), n;
}), getasync.response(function(e, s) {
r.setValue(s);
var o = s;
o._attachments === undefined && (o._attachments = {});
var u;
t.name in o._attachments ? u = o._attachments[t.name].data : (u = Math.uuid(32, 16).toLowerCase(), o._attachments[t.name] = {
content_type: t.type,
data: u
});
var a = new FileReader;
a.onload = function(e) {
i.data.putAttachment(u, e.target.result, n);
}, a.readAsDataURL(t), i.data.put(o, {
update_seq: !0
}, n);
}), n.error(function(e, t) {
var n = {
error: "Unknown",
reason: t
};
return this.recover(), n;
}), n.response(function(e, t) {
r.setValue(t);
}), this.data.get(e, getasync), r;
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
getAttachment: function(e, t, n) {
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
}), this.data.getAttachment(e, t, n), r;
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
replicate: function(e, t, n) {
if (this.data) {
n === undefined && (n = new this.data.async);
var r = new SundayDataReturn;
r.parent = this, n.error(function(e, t) {
var n = {
error: "Unknown",
reason: t
};
return this.recover(), n;
}), n.response(function(e, t) {
r.setValue(t);
});
var i = {}, s, o = new enyo.Async;
if (typeof e != "object") {
var u = e.match(this.idbcheck);
if (u !== null) u[1] !== "" && (i.database = u[1], i.dataStore = "SundayDataIDB"); else {
var a = e.match(this.httpcheck);
if (a !== null && a[1] !== "" && a[4] !== "") {
i.dataStore = "SundayDataHTTP", i.host = a[1].replace(a[3], ""), i.database = a[4];
if (a[3] !== undefined) {
var f = a[3];
f = f.replace(/@$/, "").split(":"), i.username = f[0], i.password = f[1];
}
}
}
s = enyo.createFromKind(i.dataStore, i);
} else s = e.data;
var l = this.data;
return this.dataStore === "SundayDataIDB" ? (o.response(function(e, r) {
s.replicate(l, t, n);
}), l.replicate(s, t, o)) : (o.response(function(e, r) {
l.replicate(s, t, n);
}), s.replicate(l, t, o)), r;
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
return console.log("value:", JSON.stringify(e)), e;
});
if (this.value === null) this.resultStack.push(e); else {
var t = e(this.value);
t !== undefined ? this.setValue(t) : this.setValue(this.value);
}
return this;
}, this._results = function(e) {
if (this.resultStack.length > 0) {
var t = this.resultStack.shift(), n = t(e);
n !== null && (n !== undefined ? this.setValue(n) : this.setValue(this.value));
}
}, this.get = function(e, t) {
var n = this;
if (this.value !== null && this.resultStack.length === 0) return e === undefined && (e = this.value.id === undefined ? this.value._id : this.value.id), e !== undefined ? (this.parent.get(this.value, t).done(function(e) {
n.setValue(e);
}), null) : this;
var r = function(t) {
if (t !== undefined || e !== undefined) {
var r;
e === undefined ? r = t.id === undefined ? t._id : t.id : r = e, r !== undefined ? n.parent.get(r).done(function(e) {
n.setValue(e);
}) : n.setValue(t);
}
return null;
};
return this.resultStack.push(r), this;
}, this.put = function(e, t) {
var n = this;
if (this.value !== null && this.resultStack.length === 0) return e === undefined && (this.value = e), id = this.value.id === undefined ? this.value._id : this.value.id, id !== undefined ? (this.parent.put(this.value, t).done(function(e) {
n.setValue(e);
}), null) : this;
var r = function(r) {
e !== undefined && (r = e);
if (r !== undefined) {
var i = r.id === undefined ? r._id : r.id;
i !== undefined ? n.parent.put(r, t).done(function(e) {
n.setValue(e);
}) : n.setValue(r);
}
return null;
};
return this.resultStack.push(r), this;
}, this.removeDB = function() {
var e = this, t = function(t) {
if (t !== undefined) return e.parent.removeDB().done(function(t) {
e.setValue(t);
}), null;
};
return this.resultStack.push(t), this;
}, this.bulkDocs = function(e, t) {
if (e === undefined) {
var n = this, r = function(e) {
return e !== undefined && e instanceof Array ? n.parent.bulkDocs(e, t).done(function(e) {
n.setValue(e);
}) : n.setValue(e), null;
};
return this.resultStack.push(r), this;
}
return this.parent.bulkDocs(e, t);
}, this.allDocs = function(e) {
var t = this, n = function(n) {
return t.parent.allDocs(e).done(function(e) {
t.setValue(e);
}), null;
};
return this.resultStack.push(n), this;
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
var n = this, r = function(r) {
return n.parent.query(e, t).done(function(e) {
n.setValue(e);
}), null;
};
return this.resultStack.push(r), this;
}, this.replicate = function(e) {
var t = this, n = function(n) {
return t.parent.replicate(e).done(function(e) {
t.setValue(e);
}), null;
};
return this.resultStack.push(n), this;
};
};

// global.js

global.SundayData = SundayData;
