enyo.kind({
	name: "SundayDataIDB",
	kind: "DataLayout",
	published: {
		database: "",
		dbcallback: {},
		needupgrade: false
	},
	async: enyo.Async,
	/*components: [{
			kind: "Signals",
			onCommit: "commit"
		}
	],*/
	DOC_STORE: 'doc-store',
	CONFIG_STORE: 'config-store',
	ATTACHMENT_STORE: 'attachment-store',
	idb: false,
	max_number: 9007199254740992,
	viewfunctions: {},
	returnarray: {},
	returnend: {},
	returnattachments: {},
	commit: function (inSender, inEvent) {
		var dtarget = inEvent.dispatchTarget;
	},
	handleerror: function (async, ev) {
		if (async.responders.length === 0) {
			async.response(function (inSender, inResponse) {
				return {
					ok: false,
					error: {
						status: 500,
						error: ev.type,
						reason: ev.target
					}
				};
			});
		} else {
			async.go({
				ok: false,
				error: {
					status: 500,
					error: ev.type,
					reason: ev.target
				}
			});
		}
	},
	success: function (ev) {
		//console.log("onsuccess", ev);
		this.idb = ev.target.result;
		var txn = this.idb.transaction(this.DOC_STORE, window.IDBTransaction.READ);
		var datastore = txn.objectStore(this.DOC_STORE).openCursor();
		datastore.onsuccess = enyo.bind(this, this.viewresults);
		datastore.onerror = enyo.bind(this, this.handleerror);
	},
	viewresults: function (ev) {
		var cursor = ev.target.result;
		if (cursor) {
			var row = {
				key: cursor.key,
				id: cursor.primaryKey,
				value: cursor.value
			};
			var rmatch = row.id.match(/^_design\/(.*)/);
			if (rmatch !== null) {
				for (var view in row.value.views) {
					this.viewfunctions[rmatch[1] + "_" + view] = row.value.views[view].map;
				}
			}
			cursor["continue"]();
		} else {
			this.unrollpreque();
		}
	},
	unrollpreque: function () {
		var pq = this.preque;
		var length = pq.length;
		for (var i = 0; i < length; i++) {
			if (pq[i].type === "builkDocs") {
				this.bulkDocs(pq[i].docs, pq[i].async);
			} else if (pq[i].type === "allDocs") {
				this.allDocs(pq[i].options, pq[i].async, pq[i].config);
			} else if (pq[i].type === "put") {
				this.put(pq[i].doc, pq[i].options, pq[i].async, pq[i].config);
			} else if (pq[i].type === "putAttachment") {
				this.put(pq[i].docid, pq[i].rev, pq[i].name, pq[i].doc, pq[i].async);
			} else if (pq[i].type === "putupdate") {
				this.putupdate(pq[i].async, pq[i].doc, pq[i].options, pq[i].ev);
			} else if (pq[i].type === "runview") {
				this.runview(pq[i].view, pq[i].funstring, pq[i].docu);
			} else if (pq[i].type === "get") {
				this.get(pq[i].docid, pq[i].async, pq[i].config);
			} else if (pq[i].type === "getAttachment") {
				this.get(pq[i].docid, pq[i].options, pq[i].config);
			} else if (pq[i].type === "remove") {
				this.remove(pq[i].docid, pq[i].localrev, pq[i].async, pq[i].config);
			} else if (pq[i].type === "query") {
				this.query(pq[i].fun, pq[i].options, pq[i].async);
			}
		}
		this.preque.pop();
	},
	versioncomplete: function (ev) {
		if (this.dbcallback.responders.length === 0) {
			this.dbcallback.response(function (inSender, inResponse) {
					return {
						ok: true
					};
				});
		} else {
			this.dbcallback.go({
					ok: true
				});
		}
	},
	versionsuccess: function (ev, evt) {
		evt.target.result.oncomplete = enyo.bind(this, this.versioncomplete);
		this.upgradeneeded(ev);
	},
	upgradeneeded: function (ev) {
		var objectStore = ev.target.result.createObjectStore(this.DOC_STORE, {
				keyPath: '_id'
			});
		var configStore = ev.target.result.createObjectStore(this.CONFIG_STORE, {
				keyPath: 'config'
			});
		var attachmentStore = ev.target.result.createObjectStore(this.ATTACHMENT_STORE);
		var objs = ev.target.transaction.objectStore(this.DOC_STORE);
		objs.createIndex("changes", "_update_seq", {unique: false});
		//objectStore.createIndex("changes", "_update_seq", {unique: false});
	},
	constructor: function (database) {
		//console.log("database",database);
		this.inherited(arguments);
		this.preque = [];
		this.dbcallback = new enyo.Async();
		if (typeof database === "string") {
			if (database) {
				this.database = database;
			}
		} else if (this.container.database !== undefined) {
			this.database = this.container.database;
		}
		var req = indexedDB.open(this.database);
		req.onsuccess = enyo.bind(this, this.success);
		req.onerror = enyo.bind(this, this.handleerror, this.dbcallback);
		req.onupgradeneeded = enyo.bind(this, this.upgradeneeded);
		req.onblocked = function (e) {
			//console.log("got blocked:" + e);
		};
	},
	//* @public
	removeDB: function (async) {
		this.idb.close();
		var req = enyo.global.indexedDB.deleteDatabase(this.database);

		req.onsuccess = enyo.bind(this, this.removeDBsuccess, async);
		req.onerror = enyo.bind(this, this.handleerror, async);
		return async;
	},
	removeDBsuccess: function (async, ev) {
		//console.log("removeDB success", ev);
		if (async.responders.length === 0) {
			async.response(function (inSender, inResponse) {
					return {
						ok: true
					};
				});
		} else {
			async.go({
					ok: true
				});
		}
	},
	runview: function (view, funstring, docu, viewid, last) {
		//console.log("arguments",arguments);
		if (this.idb) {
			if (docu !== undefined) {
				if(docu._id !== undefined) {
					var newdoc = {};	
					var emit = function (key, value) {
						//console.log("key", key); 
						//console.log("value", value);
						newdoc["_view_" + view] = key;
						newdoc["_view_" + view + "_value"] = value;
					};
					var log = console.log;
					eval("var fun = " + funstring);
					fun(docu);
					if (!("_view_" + view in newdoc)) {
						newdoc["_view_" + view] = null;
						newdoc["_view_" + view + "_value"] = null;
					}
					//console.log("varguments",arguments);
					if(view === last) {
						enyo.mixin(docu, newdoc);
						//console.log("return",this.returnarray[viewid]);
						//console.log("viewid",viewid);
						for(var viewdoc in this.returnarray[viewid]) {
							//console.log("viewdoc",this.returnarray[viewid][viewdoc]);
							enyo.mixin(docu, this.returnarray[viewid][viewdoc]);	
						}
						//console.log("docu",docu);
						async = new enyo.Async();
						var txn = this.idb.transaction(this.DOC_STORE, window.IDBTransaction.READ_WRITE);
						var datastore = txn.objectStore(this.DOC_STORE).get(docu._id);
						datastore.onsuccess = enyo.bind(this, this.putupdate, async, docu, {update_seq: true});
						datastore.onerror = enyo.bind(this, this.handleerror, async);
						//delete this.returnarray[viewid];
					} else {
						//console.log("viewid",viewid);
						//console.log("newdoc",newdoc);
						this.returnarray[viewid].push(newdoc);
						//console.log("returnarray",this.returnarray[viewid]);
					}
				}
			} else {
				//console.log("arguments",arguments);
				var async = new enyo.Async();
				var parent = this;
				async.response(function (inSender, inResponse) {
					//console.log("inSender", inSender);
					//console.log("inResponse", inResponse);
					//console.log("parent", parent);
					for (var doc in inResponse.rows) {
						var rmatch = inResponse.rows[doc].id.match(/^_design\/(.*)/);
						var id = inResponse.rows[doc].id;
						if (rmatch === null) {
							if(parent.returnarray[viewid + "_" +id] === undefined) {
								parent.returnarray[viewid + "_" +id] = [];
							}
							parent.runview(view, funstring, inResponse.rows[doc].doc, viewid + "_" + id, last);
						}
					}
				});
				this.allDocs({include_docs: true}, async);
			}
		} else {
			this.preque.push({
					type: "runview",
					view: view,
					funstring: funstring,
					docu: docu
				});
		}
	},
	upgradeneededview: function (newindexes, ev) {
		var objectStore = ev.currentTarget.transaction.objectStore(this.DOC_STORE);
		//console.log(newindexes);
		for (var i in newindexes) {
			//console.log("_view_"+newindexes[i]);
			var view = newindexes[i].replace("/", "_");
			if(objectStore.indexNames.contains(view) === false) {
			objectStore.createIndex(view, "_view_" + view, {unique: false});
			}
		}
	},
	putview: function (doc, async, ev) {
		this.idb = ev.target.result;
		var txn = this.idb.transaction(this.DOC_STORE, window.IDBTransaction.READ_WRITE);
		var datastore = txn.objectStore(this.DOC_STORE).get(doc._id);
		datastore.onsuccess = enyo.bind(this, this.putupdate, async, doc, {update_seq:true});
		datastore.onerror = enyo.bind(this, this.handleerror, async);
		this.unrollpreque();
	},
	put: function (doc, options, async, config) {
		//console.log("arguments",arguments);
		if (async === undefined) {
			async = new enyo.Async();
		}
		var update_seq = options?options.update_seq:false;
		if (this.idb) {
			var design = null;
			var views, last, viewid;
			if(!config) {
				if (doc._id === undefined) {
					doc._id = Math.uuid(32, 16).toLowerCase();
				}
				if (doc._localrev === undefined) {
					doc._localrev = "1-" + Math.uuid(32, 16).toLowerCase();
				}
				design = doc._id.match(/_design\/(.*)/);
			}
			if (design === null) {
				var store = this.DOC_STORE;
				var txn;
				if(config) {
					store = this.CONFIG_STORE;
					txn = this.idb.transaction(store, window.IDBTransaction.READ_WRITE);
					var putdoc = txn.objectStore(store).put(doc);
					putdoc.onsuccess = enyo.bind(this, this.putsuccess, async, "");
					putdoc.onerror = enyo.bind(this, this.handleerror, async);
				} else {
					txn = this.idb.transaction(store, window.IDBTransaction.READ_WRITE);
					var datastore = txn.objectStore(store).get(doc._id);
					datastore.onsuccess = enyo.bind(this, this.putupdate, async, doc, options);
					datastore.onerror = enyo.bind(this, this.handleerror, async);
					views = [];
					for (var view4 in this.viewfunctions) {
						views.push(view4);
					}
					if (views.length !== 0) {
						viewid = "views" + Math.uuid(32, 16).toLowerCase();
						this.returnarray[viewid] = [];
						last = views[views.length-1];
						//console.log("last",last);
						for (var view1 in this.viewfunctions) {
							this.runview(view1, this.viewfunctions[view1], doc, viewid, last);
						}
					}
				}
			} else {
				if (doc.views !== undefined) {
					var rmatch = doc._id.match(/^_design\/(.*)/);
					var newindexes = [];
					views = [];
					for (var view3 in doc.views) {
						views.push(view3);
					}
					//console.log("views",views);
					last = rmatch[1] + "_" + views[views.length-1];
					//console.log("last",last);
					viewid = "views" + Math.uuid(32, 16).toLowerCase();
					for (var view2 in doc.views) {
						var viewname = rmatch[1] + "_" + view2;
						this.viewfunctions[viewname] = doc.views[view2].map;
						newindexes.push(viewname);
						enyo.job(viewname, enyo.bind(this, "runview", viewname, doc.views[view2].map, undefined, viewid, last), 50);
					}
					var currentversion = this.idb.version;
					this.idb.close();
					this.idb = false;
					var req = indexedDB.open(this.database, currentversion + 1);
					req.onsuccess = enyo.bind(this, this.putview, doc, async);
					req.onerror = enyo.bind(this, this.handleerror, this.dbcallback);
					req.onupgradeneeded = enyo.bind(this, this.upgradeneededview, newindexes);
					req.onblocked = function (e) {
						//console.log("got blocked:" + e);
					};
				}
			}
		} else {
			this.preque.push({
					type: "put",
					doc: doc,
					options: options,
					config: config,
					async: async
				});
		}
		return async;
	},
	putAttachment: function (docid, doc, async) {
		//console.log("docid",docid);
		if (async === undefined) {
			async = new enyo.Async();
		}
		if (this.idb) {
				store = this.ATTACHMENT_STORE;
				txn = this.idb.transaction(store, window.IDBTransaction.READ_WRITE);
				var putdoc = txn.objectStore(store).put(doc, docid);
				putdoc.onsuccess = enyo.bind(this, this.putsuccess, async, "");
				putdoc.onerror = enyo.bind(this, this.handleerror, async);
		} else {
			this.preque.push({
					type: "putAttachment",
					docid: docd,
					rev: rev,
					name: name,
					doc: doc,
					async: async
				});
		}
		return async;
	},
	putupdate: function (async, doc, options, ev) {
		//console.log("doc",doc);
		//console.log("ev",ev);
		if (this.idb) {
			var olddoc = ev.target.result;
			var store = this.DOC_STORE;
			var txn = this.idb.transaction(store, window.IDBTransaction.READ_WRITE);
			var putdoc = {};
			var update_seq = options?options.update_seq:false;
			if(olddoc) {
				var olddoc_deleted = olddoc._deleted ? true : false;
				var oldrev = olddoc._rev !== undefined ? olddoc._rev[0] : 0;
				var newrev = doc._rev !== undefined ? doc._rev[0] : 0;
				var newer_rev = newrev > oldrev;
				var view = /^_view_.*/;
				for (var field in olddoc.doc) {
					if (field.match(view) !== null) {
						if(doc[field] === undefined) {
							doc[field] = olddoc[field];
						}
					}
				}
				//console.log("doc2",doc);
				if (newer_rev || olddoc._localrev !== undefined || olddoc_deleted) {
					if (newer_rev || olddoc_deleted || olddoc._localrev === doc._localrev || parseInt(doc._localrev[0], 10) > parseInt(olddoc._localrev[0], 10)) {
						if (!olddoc_deleted && !update_seq) {
							var revnumber;
							if(newer_rev) {
								revnumber = parseInt(olddoc._localrev[0], 10) + 1;
							} else {
								revnumber = parseInt(doc._localrev[0], 10) + 1;
							}
							doc._localrev = revnumber + "-" + Math.uuid(32, 16).toLowerCase();
						}
						doc._revhistory = olddoc;
						if(!update_seq) {
							doc._update_seq = this.max_number;
						}
						putdoc = txn.objectStore(store).put(doc);
						putdoc.onsuccess = enyo.bind(this, this.putsuccess, async, doc._localrev);
						putdoc.onerror = enyo.bind(this, this.handleerror, async);
					} else {
						if (async.responders.length === 0) {
							async.response(function (inSender, inResponse) {
								return {
									"error": "conflict",
									"reason": "Document update conflict."
								};
							});
						} else {
							async.go({
								"error": "conflict",
								"reason": "Document update conflict."
							});
						}
					}
				} else {
					//console.log("putupdate error localrev");
				}
			} else {
				if(!update_seq) {
					doc._update_seq = this.max_number;
				}
				putdoc = txn.objectStore(store).put(doc);
				putdoc.onsuccess = enyo.bind(this, this.putsuccess, async, doc._localrev);
				putdoc.onerror = enyo.bind(this, this.handleerror, async);
			}
		} else {
			this.preque.push({
					type: "putupdate",
					doc: doc,
					options: options,
					ev: ev,
					async: async
				});
		}
	},
	putsuccess: function (async, localrev, ev) {
		var id = ev.target.result;
		/*enyo.Signals.send("onCommit", {
			status: "changed",
			id: id,
			sender: "SundayData.put",
			database: this.databaseName
		});*/
		if (async.responders.length === 0) {
			async.response(function (inSender, inResponse) {
				return {
					ok: true,
					id: id,
					rev: localrev
				};
			});
		} else {
			async.go({
				ok: true,
				id: id,
				rev: localrev
			});
		}
	},
	bulkDocs: function (docs, options, bulkasync) {
		var parent = this;
		if (bulkasync === undefined) {
			bulkasync = new enyo.Async();
		}
		var putoptions = options.update_seq?{update_seq: true}:{};
		if (this.idb) {
			var bulkid = "bulk" + Math.uuid(32, 16).toLowerCase();
			this.returnarray[bulkid] = [];
			var length = docs.length;
			putrespfun = function (inSender, inResponse) {
				if (inResponse.ok === true) {
					this.bulkDocsresults(bulkasync, length, bulkid, {
						id: inResponse.id,
						rev: inResponse.rev
					});
				} else {
					this.bulkDocsresults(bulkasync, length, bulkid, inResponse);
				}
			};
			removerespfun = function (inSender, inResponse) {
				if (inResponse.ok === true) {
					this.bulkDocsresults(bulkasync, length, bulkid, {
						id: inResponse.id,
						rev: inResponse.rev,
						_deleted: true
					});
				} else {
					this.bulkDocsresults(bulkasync, length, bulkid, inResponse);
				}
			};
			for (var i = 0; i < length; i++) {
				var doc = docs[i];
				if (doc._deleted === undefined) {
					var putreq = this.put(doc, putoptions);
					putreq.response(this, putrespfun);
				} else {
					var removereq = this.remove(doc._id, doc._localrev);
					removereq.response(this, removerespfun);
				}
			}
		} else {
			this.preque.push({
					type: "builkDocs",
					docs: docs,
					async: bulkasync
				});
		}
		return bulkasync;
	},
	bulkDocsresults: function (async, length, bulkid, data) {
		this.returnarray[bulkid].push(data);
		if (this.returnarray[bulkid].length === length) {
			var retarray = this.returnarray[bulkid];
			delete this.returnarray[bulkid];
			if (async.responders.length === 0) {
				async.response(this, function (inSender, inResponse) {
					return retarray;
				});
			} else {
				async.go(retarray);
			}
		}

	},
	get: function (docid, async, config) {
		if (async === undefined) {
			async = new enyo.Async();
		}
		if (this.idb) {
			var store = this.DOC_STORE;
			if(config) {
				store = this.CONFIG_STORE;
			}
			var txn = this.idb.transaction(store, window.IDBTransaction.READ);
			var datastore = txn.objectStore(store).get(docid);
			datastore.onsuccess = enyo.bind(this, this.getsuccess, async);
			datastore.onerror = enyo.bind(this, this.handleerror, async);
		} else {
			this.preque.push({
				type: "get",
				docid: docid,
				config: config,
				async: async
			});
		}
		return async;
	},
	getAttachment: function (docid, options, async) {
		if (async === undefined) {
			async = new enyo.Async();
		}
		if (this.idb) {
			var store = this.ATTACHMENT_STORE;
			var txn = this.idb.transaction(store, window.IDBTransaction.READ);
			var datastore = txn.objectStore(store).get(docid);
			datastore.onsuccess = enyo.bind(this, this.getsuccess, async);
			datastore.onerror = enyo.bind(this, this.handleerror, async);
		} else {
			this.preque.push({
				type: "getAttachment",
				docid: docid,
				options: options,
				async: async
			});
		}
		return async;
	},
	getsuccess: function (async, ev) {
		var doc = ev.target.result;
		if (doc !== undefined) {
			if (doc._revhistory !== undefined) {
				delete doc._revhistory;
				var view = /^_view_.*/;
				for (var field in doc) {
					if (field.match(view) !== null) {
						delete doc[field];
					}
				}
			} else {
				//console.log("getsuccess error no revisionhistroy");
			}
			if (doc._deleted) {
				if (async.responders.length === 0) {
					async.response(function (inSender, inResponse) {
						return {"error": "Not Found", reason: "Deleted"};
					});
				} else {
					async.go({"error": "Not Found", reason: "Deleted"});
				}
			} else {
				if (async.responders.length === 0) {
					async.response(function (inSender, inResponse) {
						return doc;
					});
				} else {
					async.go(doc);
				}
			}
		} else {
			if (async.responders.length === 0) {
				async.response(function (inSender, inResponse) {
					return {"error": "Not Found"};
				});
			} else {
				async.go({"error": "Not Found"});
			}
		}
	},
	allDocs: function (options, async, config) {
		//console.log("caller", arguments.callee.caller);
		if (async === undefined) {
			async = new enyo.Async();
		}
		if (this.idb) {
			var allid = "all" + Math.uuid(32, 16).toLowerCase();
			this.returnarray[allid] = [];
			var store = this.DOC_STORE;
			if(config) {
				store = this.CONFIG_STORE;
			} 
			var txn = this.idb.transaction(store, window.IDBTransaction.READ);
			var datastore = txn.objectStore(store).openCursor();
			datastore.onsuccess = enyo.bind(this, this.allDocssuccess, async, allid, options);
			datastore.onerror = enyo.bind(this, this.handleerror, async);
		} else {
			this.preque.push({
				type: "allDocs",
				options: options,
				config: config,
				async: async
			});
		}
		return async;
	},
        attachmentResponse: function (parent, async, atid, docid, row, att, options, returnfunc) {
		var getasync = new this.async();
		getasync.error(function(inSender, inResponse) {
			var response = {"error": "Unknown", "reason": inResponse};
			parent.recover();
			return response;
		});
		getasync.response(function (inSender, inResponse) {
			//console.log("resp");
			parent.returnattachments[atid].pop();
			if(options !== undefined && options.base64) {
				var regex = /^data:.+\/(.+);base64,(.*)$/;
				var matches = inResponse.match(regex);
				if(matches.length > 2) {
					row.doc._attachments[att].data = matches[2];
				}
			} else {
				row.doc._attachments[att].data = inResponse;
			}
			if(options !== undefined && !options.include_docs) delete row.doc;
			parent.returnarray[atid].push(row);
			//console.log("returnarray", parent.returnarray);
			if(parent.returnattachments[atid].length === 0 && parent.returnend[atid] === true) {
				returnfunc(async, atid, {},{target: {result: false}}); 
			}
			
		});
		this.getAttachment(docid, {}, getasync);
        }, 
	allDocssuccess: function (async, allid, options, ev) {
		var cursor = ev.target.result;
		if (cursor) {
			var row = {
				key: cursor.key,
				id: cursor.primaryKey,
				value: {rev: cursor.value._localrev},
				doc: cursor.value
			};
			if (row.doc._deleted === undefined) {
				delete row.doc._revhistory;
				var view = /^_view_.*/;
				for (var field in row.doc) {
					if (field.match(view) !== null) {
						delete row.doc[field];
					}
				}
				if(options !== undefined && options.attachments) {
					//console.log("prufa", row.doc);
					if(this.returnattachments[allid] === undefined) {
						this.returnattachments[allid] = [];
					}
					for(var att in row.doc._attachments) {
						//console.log("att",att);
						this.returnattachments[allid].push(att);
						var docid = row.doc._attachments[att].data;
						//console.log("docid",docid);
						var parent = this;
						this.attachmentResponse(parent, async, allid, docid, row, att, options, enyo.bind(this, this.allDocssuccess));
					}
				} else {
					if(options !== undefined && !options.include_docs) delete row.doc;
					this.returnarray[allid].push(row);
				}
			}
			cursor["continue"]();
		} else {
			//console.log(3);
			if((options !== undefined && !(options.attachments)) || !(this.returnattachments[allid] !== undefined && this.returnattachments[allid].length !== 0)) {
				//console.log(1);
				var retarray = {
					total_rows: this.returnarray[allid].length,
					rows: this.returnarray[allid]
				};
				delete this.returnarray[allid];
				if (async.responders.length === 0) {
					async.response(this, function (inSender, inResponse) {
						return retarray;
					});
				} else {
					async.go(retarray);
				}
			} else {
				//console.log(2);
				this.returnend[allid] = true;
			}
		}
	},
	changes: function (options, async) {
		//console.log("options", options);
		//console.log("idb changes");
		if (async === undefined) {
			async = new enyo.Async();
		}
		if (this.idb) {
			var changesid = "changes" + Math.uuid(32, 16).toLowerCase();
			this.returnarray[changesid] = [];
			var txn = this.idb.transaction(this.DOC_STORE, window.IDBTransaction.READ);
			var objectstore = txn.objectStore(this.DOC_STORE);
			var index = objectstore.index("changes").openCursor();
			index.onsuccess = enyo.bind(this, this.changessuccess, async, changesid, options);
			index.onerror = enyo.bind(this, this.handleerror, async);
		} else {
			this.preque.push({
				type: "query",
				fun: fun,
				options: options,
				async: async
			});
		}
		return async;

	},
	changessuccess: function (async, changesid, options, ev) {
		var cursor = ev.target.result;
		//console.log("idb changes success");
		//console.log("options", options);
		if (cursor) {
			if (cursor.key !== null && cursor.value._update_seq === this.max_number) {
				//console.log(1);
				var row = {
					id: cursor.primaryKey,
					changes: [{rev: cursor.value._localrev}],
					doc: cursor.value
				};
				delete row.doc._revhistory;
				var view = /^_view_.*/;
				for (var field in row.doc) {
					if (field.match(view) !== null) {
						delete row.doc[field];
					}
				}
				if(options !== undefined && options.attachments) {
					//console.log("prufa", row.doc);
					if(this.returnattachments[changesid] === undefined) {
						this.returnattachments[changesid] = [];
					}
					for(var att in row.doc._attachments) {
						//console.log("att",att);
						this.returnattachments[changesid].push(att);
						var docid = row.doc._attachments[att].data;
						//console.log("docid",docid);
						var parent = this;
						this.attachmentResponse(parent, async, changesid, docid, row, att, options, enyo.bind(this, this.changessuccess));
						/*var getasync = new this.async();
						var parent = this;
						getasync.error(function(inSender, inResponse) {
							var response = {"error": "Unknown", "reason": inResponse};
							this.recover();
							return response;
						});
						getasync.response(function (inSender, inResponse) {
							//console.log("resp");
							parent.returnattachments[changesid].pop();
							row.doc._attachments[att].data = inResponse;
							if(options !== undefined && !options.include_docs) delete row.doc;
							//console.log("row",row);
							parent.returnarray[changesid].push(row);
							if(parent.returnattachments[changesid].length === 0 && parent.returnend[changesid] === true) {
								parent.changessuccess(async, changesid, {},{target: {result: false}}); 
							}
							
						});
						this.getAttachment(docid, {}, getasync);
						*/
					}
				} else {
					if(options !== undefined && !options.include_docs) delete row.doc;
					this.returnarray[changesid].push(row);
				}
			}
			cursor["continue"]();
		} else {
			if((options !== undefined && !(options.attachments)) || !(this.returnattachments[changesid] !== undefined && this.returnattachments[changesid].length !== 0)) {
				//console.log("final this", this);
				var retarray = {
					results: this.returnarray[changesid]
				};
				delete this.returnarray[changesid];
				//console.log("changes returned");
				if (async.responders.length === 0) {
					async.response(this, function (inSender, inResponse) {
						return retarray;
					});
				} else {
					async.go(retarray);
				}
			} else {
				//console.log(2);
				this.returnend[changesid] = true;
			}
		}
	},
	query: function (fun, options, async) {
		if (async === undefined) {
			async = new enyo.Async();
		}
		if (this.idb) {
			var queryid = "query" + Math.uuid(32, 16).toLowerCase();
			this.returnarray[queryid] = [];
			var txn = this.idb.transaction(this.DOC_STORE, window.IDBTransaction.READ);
			var objectstore = txn.objectStore(this.DOC_STORE);
			if(objectstore.indexNames.contains(fun.replace("/", "_"))) {
				var index = objectstore.index(fun.replace("/", "_")).openCursor();
				index.onsuccess = enyo.bind(this, this.querysuccess, async, queryid, fun);
				index.onerror = enyo.bind(this, this.handleerror, async);
			} else {
				async.response(function (inSender, inResponse) {
					return {
						ok: false,
						error: {
							status: 500,
							error: "query function does not excist",
							reason: fun
						}
					};
				});
			}
		} else {
			this.preque.push({
				type: "query",
				fun: fun,
				options: options,
				async: async
			});
		}
		return async;

	},
	querysuccess: function (async, queryid, fun, ev) {
		var cursor = ev.target.result;
		if (cursor) {
			if (cursor.key !== null) {
				var row = {
					key: cursor.key,
					id: cursor.primaryKey,
					value: cursor.value["_view_" + fun.replace("/", "_") + "_value"],
					doc: cursor.value
				};
				if (row.doc && row.doc._deleted === undefined) {
					delete row.doc._revhistory;
					var view = /^_view_.*/;
					for (var field in row.doc) {
						if (field.match(view) !== null) {
							delete row.doc[field];
						}
					}
					this.returnarray[queryid].push(row);
				}
			}
			cursor["continue"]();
		} else {
			var retarray = {
				rows: this.returnarray[queryid]
			};
			delete this.returnarray[queryid];
			if (async.responders.length === 0) {
				async.response(this, function (inSender, inResponse) {
					return retarray;
				});
			} else {
				async.go(retarray);
			}
		}
	},
	remove: function (docid, localrev, async, config) {
		if (async === undefined) {
			async = new enyo.Async();
		}
		if (this.idb) {
			var store = this.DOC_STORE;
			if(config) {
				store = this.CONFIG_STORE;
			} 
			var txn = this.idb.transaction(store, window.IDBTransaction.READ_WRITE);
			var datastore = txn.objectStore(store).get(docid);
			datastore.onsuccess = enyo.bind(this, this.removeget, async, localrev, config);
			datastore.onerror = enyo.bind(this, this.handleerror, async);
		} else {
			this.preque.push({
				type: "remove",
				docid: docid,
				localrev: localrev,
				config: config,
				async: async
			});
		}
		return async;
	},
	removeget: function (async, localrev, config, ev) {
		var olddoc = ev.target.result;
		var store = this.DOC_STORE;
		if(config) {
			store = this.CONFIG_STORE;
		} 
		if (olddoc && localrev === olddoc._localrev) {
			doc = {
				_deleted: true
			};
			doc._id = olddoc._id;
			doc._localrev = olddoc._localrev;
			doc._revhistory = olddoc;
			var txn = this.idb.transaction(store, window.IDBTransaction.READ_WRITE);
			var removedoc = txn.objectStore(store).put(doc);
			removedoc.onsuccess = enyo.bind(this, this.removesuccess, async, doc._id, doc._localrev);
			removedoc.onerror = enyo.bind(this, this.handleerror, async);
		} else {
			//console.log("removeget error not same");
		}

	},
	removesuccess: function (async, id, localrev, ev) {
		if (async.responders.length === 0) {
			async.response(function (inSender, inResponse) {
				return {
					ok: true,
					id: id,
					localrev: localrev
				};
			});
		} else {
			async.go({
				ok: true,
				id: id,
				localrev: localrev
			});
		}
	},
	replicate: function(from, options, async) {
		var fromasync = new from.async();
		var fromusasync = new from.async();
		var tousasync = new this.async();	
		//console.log("from",from);
		var parent = this;
		fromasync.response(function (inSender, inResponse) {
			//console.log("fromasync");
			//console.log("inSender", inSender);
			//console.log("inResponse", inResponse);
			//console.log("parent", parent);
			var docs = [];
			var update_seq = inResponse.update_seq;
			//console.log("update_seq", update_seq);
			if(update_seq !== undefined) {
				parent.put({config: "update_seq", value: update_seq}, undefined, undefined, true);
			}
			for (var doc in inResponse.rows) {
				delete inResponse.rows[doc].doc._localrev;
				if(update_seq !== undefined) {
					inResponse.rows[doc].doc._update_seq = update_seq;
				}
				docs.push(inResponse.rows[doc].doc);
			}
			if(inResponse.total_rows > 0) {
				parent.bulkDocs(docs, {update_seq: true}, async);
			} else {
				async.go({});
			}
		});
		fromusasync.response(function (inSender, inResponse) {
			//console.log("fromusasync");
			//console.log("inSender",inSender);
			//console.log("inResponse",inResponse);
			var docs = [];
			var update_seq = inResponse.last_seq;
			if(update_seq !== undefined) {
				parent.put({config: "update_seq", value: update_seq}, undefined, undefined, true);
			}
			for (var doc in inResponse.results) {
				delete inResponse.results[doc].doc._localrev;
				if(update_seq !== undefined) {
					inResponse.results[doc].doc._update_seq = update_seq;
				}
				docs.push(inResponse.results[doc].doc);
			}
			if(docs.length > 0) {
				parent.bulkDocs(docs, {update_seq: true}, async);
			} else {
				async.go({});
			}
		});
		tousasync.response(function (inSender, inResponse) {
			//console.log("tousasync");
			//console.log("inSender",inSender);
			//console.log("inResponse",inResponse);
			//console.log("options",options);
			if(inResponse.value !== undefined) {
				//console.log("changes");
				from.changes(inResponse.value, options, fromusasync);
			} else {
				if(options !== undefined) {
					//console.log("allDocs with options");
					options.include_docs = true;
					options.update_seq = true;
					from.allDocs(options, fromasync);
				} else {
					//console.log("allDocs");
					from.allDocs({include_docs:true, update_seq:true}, fromasync);
				}
			}
		});
		this.get("update_seq",tousasync, true);
	}
});
