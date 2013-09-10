#! /usr/local/bin/node

var vm = require("vm"),
    fs = require("fs"),
    XMLHttpRequest;
var sqlite3 = require("sqlite3");
var indexeddbjs = require("indexeddb-js");
var engine    = new sqlite3.Database(':memory:');
var scope     = indexeddbjs.makeScope('sqlite3', engine);

try {
   XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
} catch(e) {
   console.log("Please run \"npm install xmlhttprequest\" if you want to use enyo.Ajax!");
}

var enyo = {
        args: {
            root: "lib/enyo"
        },
        locateScript: function(inPath) {
            return false;
        }
    },

    // Our execution context for enyo
    context = vm.createContext({
        enyo: enyo,
        navigator: {},
        addEventListener: function() {},
        // A mock document object
        document: (function() {
            function DOMElement() {
                this.style = {cssText: ""};
            }
            DOMElement.prototype = {
                addEventListener: function() {},
                setAttribute: function() {}
            };
            var document = new DOMElement();
            document.createElement = function(tagName) {
                var el = new DOMElement();
                el.tagName = tagName || "div";
                return el;
            };
            document.getElementById = document.write = document.getElementsByTagName = function() {};
            return document;
        })(),
        indexedDB: scope.indexedDB,
        XMLHttpRequest: XMLHttpRequest,
        console: console,
        require: require
    }),


    machine = {
        // No Stylesheets needed here
        sheet: function() {},
        // A script loading machine using the node vm module
        script: function(inPath, onSuccess, onError) {
            var code = fs.readFileSync(inPath, "utf-8");
            if (!code) {
                return onError && onError(err);
            }
            vm.runInContext(code, context, inPath);
            onSuccess && onSuccess();

        }
    };

// Add the window object to the context
context.window = context;

// Enyo bootstrap
machine.script("lib/enyo/loader.js");
machine.script("lib/enyo/source/boot/boot.js");

// Override the loading machine
enyo.loader.machine = machine;

enyo.depends(
    "lib/enyo/source/kernel/log.js",
    "lib/enyo/source/kernel/lang.js"
);

// Override enyo's global property
enyo.global = context;

// Use node's process.nextTick instead of setTimeout
enyo.asyncMethod = function() {
    return process.nextTick(enyo.bind.apply(enyo, arguments));
};

// Load the rest of the framework
enyo.depends(
    "lib/enyo/source/kernel/job.js",
    "lib/enyo/source/kernel/macroize.js",
    "lib/enyo/source/kernel/Oop.js",
    "lib/enyo/source/kernel/Object.js",
    "lib/enyo/source/kernel/Component.js",
    "lib/enyo/source/kernel/UiComponent.js",
    "lib/enyo/source/kernel/Layout.js",
    "lib/enyo/source/kernel/Signals.js",
    "lib/enyo/source/ajax",
    "lib/enyo/source/dom",
    "lib/enyo/source/touch",
    "lib/enyo/source/ui",
    "test/sundaydata/testnode.js",
    //"test/sundaydata/tests",
    "test/sundaydata/tests/SundayDataIDBTest.js",
    "source"
);

// Load the default source folder or the dependencies specified via command line
var dependencies = process.argv.slice(2);

if (dependencies.length === 0) {
    dependencies.push("source");
} else if (dependencies.length === 1 && dependencies[0] === '-h') {
    console.log([
        "ENYO on Node.JS",
        "USAGE: ./enyo-nodejs [dependency1.js, dependency2.js, ...]",
        "The default dependency is \"source\"",
    ].join("\n"));

    return;
}

//enyo.depends.apply(enyo, dependencies);

/*var SD = new enyo.global.SundayData("idb://testdb3/");
testing = SD.put({_id: "prufa", prufa: 1},{}).done(function(value){
		console.log("value",value);
});*/
var test = new enyo.global.enyo.TestRunner();
