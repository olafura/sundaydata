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
	components: [{
			kind: "Signals",
			onCommit: "commit"
		}
	],
	returnarray: {},
	authHeader: function() {
		var retval = "Basic " + binb2b64(str2binb(this.username+":"+this.password));
		return retval;
	},	
	commit: function (inSender, inEvent) {
		var dtarget = inEvent.dispatchTarget;
		//console.log("inSender", inSender);
		//console.log("inEvent", inEvent);
		//console.log("dtarget", dtarget);
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
	constructor: function (host, database, username, password) {
		this.inherited(arguments);
		this.start();
	},
	start: function (host, database, username, password) {
		//console.log("this", this);
		//console.log("container", this.container);
		if (host === undefined && database === undefined && this.container !== undefined) {
			this.host = this.container.host;
			this.database = this.container.database;
			this.username = this.container.username;
			this.password = this.container.password;
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
		if (typeof username === "string") {
			if (username) {
				this.username = username;
			}
		}
		if (typeof password === "string") {
			if (password) {
				this.password = password;
			}
		}
		//console.log("username",this.username);
		//console.log("password",this.password);
		//console.log("database", this.database);
		//console.log("host", this.host);
		this.dbcallback = new enyo.Ajax({
			url: this.host + "/" + this.database + "/",
			method: "PUT",
			contentType: "application/json",
			cacheBust: false
		});
		if(this.username !== "" && this.password !== "") {
			this.dbcallback.headers = {"Authorization": this.authHeader()};
		}
		this.dbcallback.go();
	},
	//* @public
	removeDB: function (ajax) {
		if (ajax === undefined) {
			ajax = new enyo.Ajax();
		}
		ajax.url = this.host + "/" + this.database + "/";
		ajax.cacheBust = false;
		if(this.username !== "" && this.password !== "") {
			ajax.headers = {"Authorization": this.authHeader()};
		}
		ajax.go();
		return ajax;
	},
	put: function (doc, options, ajax) {
		//console.log("put");
		if (ajax === undefined) {
			ajax = new enyo.Ajax();
		}
		//console.log("ajax",ajax);
		ajax.contentType = "application/json";
		ajax.cacheBust = false;
		ajax.url = this.host + "/" + this.database + "/";
		ajax.method = "POST";
		ajax.postBody = JSON.stringify(doc);
		if(this.username !== "" && this.password !== "") {
			ajax.headers = {"Authorization": this.authHeader()};
		}
		ajax.go();
		return ajax;
	},
	bulkDocs: function (docs, options, ajax) {
		//console.log("bulk");
		if (ajax === undefined) {
			ajax = new enyo.Ajax();
		}
		ajax.url = this.host + "/" + this.database + "/_bulk_docs";
		ajax.method = "POST";
		ajax.contentType = "application/json";
		ajax.cacheBust = false;
		ajax.postBody = JSON.stringify({docs:docs});
		if(this.username !== "" && this.password !== "") {
			ajax.headers = {"Authorization": this.authHeader()};
		}
		ajax.go();
		return ajax;
	},
	get: function (docid, ajax) {
		if (ajax === undefined) {
			ajax = new enyo.Ajax();
		}
		ajax.url = this.host + "/" + this.database + "/" + docid;
		ajax.method = "GET";
		ajax.cacheBust = false;
		if(this.username !== "" && this.password !== "") {
			ajax.headers = {"Authorization": this.authHeader()};
		}
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
		if(this.username !== "" && this.password !== "") {
			ajax.headers = {"Authorization": this.authHeader()};
		}
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
		if(this.username !== "" && this.password !== "") {
			ajax.headers = {"Authorization": this.authHeader()};
		}
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
		if(this.username !== "" && this.password !== "") {
			ajax.headers = {"Authorization": this.authHeader()};
		}
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
		if(this.username !== "" && this.password !== "") {
			ajax.headers = {"Authorization": this.authHeader()};
		}
		ajax.go();
		return ajax;

	}
});
