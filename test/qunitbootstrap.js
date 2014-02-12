#! /usr/local/bin/node

var fs = require("fs"),
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

window = {
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
	IDBTransaction: {},
	IDBCursor: {},
        indexedDB: scope.indexedDB,
        XMLHttpRequest: XMLHttpRequest,
        console: console,
        require: require
};

document = window.document;
IDBTransaction = window.IDBTransaction;
IDBCursor = window.IDBCursor;
indexedDB = window.indexedDB;
