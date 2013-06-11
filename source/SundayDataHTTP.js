enyo.kind({
	name: "SundayDataHTTP",
	kind: "DataLayout",
	published: {
		database: "",
		host: "",
		dbcallback: {}
	},
	async: enyo.Ajax,
	components: [{
			kind: "Signals",
			onCommit: "commit"
		}
	],
	returnarray: {},
	commit: function (inSender, inEvent) {
		var dtarget = inEvent.dispatchTarget;
		console.log("inSender", inSender);
		console.log("inEvent", inEvent);
		console.log("dtarget", dtarget);
	},
	handleerror: function (ajax, ev) {
		if (ajax.responders.length === 0) {
			ajax.response(function (inSender, inResponse) {
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
			ajax.go({
				ok: false,
				error: {
					status: 500,
					error: ev.type,
					reason: ev.target
				}
			});
		}
	},
	constructor: function (host, database) {
		this.inherited(arguments);
		this.start();
	},
	start: function (host, database) {
		console.log("this", this);
		console.log("container", this.container);
		if (host === undefined && database === undefined && this.container !== undefined) {
			this.host = this.container.host;
			this.database = this.container.database;
		}
		if (typeof database === "string") {
			if (database) {
				this.database = database;
			}
		}
		if (typeof host === "string") {
			if (host) {
				this.host = host;
			}
		}
		console.log("database", this.database);
		console.log("host", this.host);
		this.dbcallback = new enyo.Ajax({
			url: this.host + "/" + this.database + "/",
			method: "PUT",
			contentType: "application/json",
			cacheBust: false
		});
		this.dbcallback.go();
	},
	//* @public
	removeDB: function (ajax) {
		if (ajax === undefined) {
			ajax = new enyo.Ajax();
		}
		ajax.url = this.host + "/" + db + "/";
		ajax.go();
		return ajax;
	},
	put: function (doc, options, ajax) {
		if (ajax === undefined) {
			ajax = new enyo.Ajax();
		}
		ajax.url = this.host + "/" + this.database + "/";
		ajax.method = "POST";
		ajax.contentType = "application/json";
		ajax.cacheBust = false;
		ajax.postBody = JSON.stringify(doc);
		ajax.go();
		return ajax;
	},
	bulkDocs: function (docs, options, ajax) {
		if (ajax === undefined) {
			ajax = new enyo.Ajax();
                }
		ajax.url = this.host + "/" + this.database + "/_bulk_docs";
		ajax.method = "POST";
		ajax.contentType = "application/json";
		ajax.cacheBust = false;
		ajax.go(JSON.stringify({
			docs: docs
		}));
		return ajax;
	},
	get: function (docid, ajax) {
		if (ajax === undefined) {
			ajax = new enyo.Ajax();
                }
		ajax.url = this.host + "/" + this.database + "/" + docid;
		ajax.method = "GET";
		ajax.cacheBust = false;
		ajax.go();
		return ajax;
	},
	allDocs: function (options, ajax) {
		if (ajax === undefined) {
			ajax = new enyo.Ajax();
		}
		ajax.url = this.host + "/" + this.database + "/_all_docs";
		ajax.method = "GET";
		ajax.contentType = "application/json";
		ajax.cacheBust = false;
		ajax.go(options);
		return ajax;
	},
	query: function (fun, options, ajax) {
		//console.log("query fun", fun);
		//console.log("query options", options);
		var design, view;
		if (typeof fun === 'string') {
			var parts = fun.split('/');
			design = parts[0];
			view = parts[1];
		}
		if (ajax === undefined) {
			ajax = new enyo.Ajax();
		}
		ajax.url = this.host + "/" + this.database + "/_design/" + design + '/_view/' + view;
		ajax.method = "GET";
		ajax.contentType = "application/json";
		ajax.cacheBust = false;
		ajax.go(JSON.stringify(options));
		return ajax;
	},
	remove: function (docid, rev, ajax) {
		if (ajax === undefined) {
			ajax = new enyo.Ajax();
		}
		ajax.url = this.host + "/" + this.database + "/" + docid + "?rev=" + rev;
		ajax.method = "DELETE";
		ajax.cacheBust = false;
		ajax.go();
		return ajax;
	},
	changes: function (since, ajax) {
		if (since === undefined) {
			since = 0;
		}
		if (ajax === undefined) {
			ajax = new enyo.Ajax();
		}
		ajax.url = this.host + "/" + this.database + "/_changes?since=" + since;
		ajax.method = "GET";
		ajax.cacheBust = false;
		ajax.go();
		return ajax;

	}
});
