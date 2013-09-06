/**
	_SundayData_ is database library that makes it easy store and
	sync data. It's meant to deal with a lot of data without
	breaking down.

	It has a simple api:

		db = new SundayData("idb://testdb/");
		db.put({_id: "test1", somevar: "somedata"}).get().done(
			function(value) {
				console.log(value.somevar);
			}
		);

	You don't have to use chaining or can use the returned object to
	add to the chaining stack:
		
		db = new SundayData("idb://testdb");
		var testing = db.put({_id: "test2", somevar: "somedata"});
		testing.get();
		testing.done();
	
	The stack is executed according to when it is put on the stack
	and it doesn't have to worry about when the data gets to it.
	If an error arrives then it goes through the stack, so it's good
	to have a .done at the end so you can log it to the javascript
	console.

	To remove an entry you need to have the _rev number and also to
	update it again with the put. So it's usefull to use something
	like this:
		
		db = new SundayData("idb://testdb");
		db.get("test2").remove();

	The api works under the assumption that you intend to use what
	came as the return of the previous command on the stack. So
	this works as to change and entry:

		db = new SundayData("idb://testdb");
		db.get("test1").done(function(value){
			value.newvariable = "this is awesome";
			return value;
		}).done();

	Actually works and if it can't find the object because it does
	not exist or because you removed it then you get an error.
		
		{ error: "Not Found"} 

	So have fun messing with it
*/
enyo.kind({
	name: "SundayData",
	kind: "enyo.Component",
	published: {
		/**
			This is usually filled out by setting the url, but
			can of course be set manually. The current possible
			values are SundayDataIDB and SundayDataHTTP.
		*/
		dataStore: "",
		/**
			This is the url you supply new SundayData(url) or
			by doing db.setUrl(), either is perfectly valid.
		*/
		url: "",
		/**     
			This holds the database name either idb://database/
			or http://host/database/, support for more complex
			url mapping is possible with setting this variable
			with db.setDatabase(database) and setting the host
			by db.setHost("http://host/complex/url/dbs").
			The url varible is mostly for convenience.
		*/
		database: "",
		/**
			This is used for the HTTP mode where you can use
			it to log in to CouchDB. 
		*/
		username: "",
		/**	
			This is for the password but it's not adviced to
			use it over http use https when going over the
			internet as people can use the hash that is sent
			to log in. 
			http://security.stackexchange.com/questions/988/is-basic-auth-secure-if-done-over-https
		*/
		password: "",
		/**
			This is the base url in HTTP mode with the database
			name added after.
		*/
		host: ""
	},
	//* @protected
	data: null,
	idbcheck: /idb\:\/\/([\w\-]+)\/?/,
	httpcheck: /((https?\:\/\/)?(\w*\:\w*@)?[\w\.]*\:?\d*)\/([\w\-]+)/,
	//* @protected
	constructor: function (url) {
		this.inherited(arguments);
		if (url !== undefined && typeof url === "string") {
			this.setUrl(url);
		}
	},
	//* @public
	setUrl: function (url) {
		if (typeof url === "string") {
			var idbresults = url.match(this.idbcheck);
			if (idbresults !== null) {
				if (idbresults[1] !== "") {
					this.setDatabase(idbresults[1]);
					this.setDataStore("SundayDataIDB");
				}
			} else {
				var httpresults = url.match(this.httpcheck);
				if (httpresults !== null && httpresults[1] !== "" && httpresults[4] !== "") {
					if(httpresults[3] !== undefined) {
						usernamepassword = httpresults[3];
						usernamepassword = usernamepassword.replace(/@$/,"").split(":");
						this.setUsername(usernamepassword[0]);
						this.setPassword(usernamepassword[1]);
					}
					this.setHost(httpresults[1].replace(httpresults[3],""));
					this.setDatabase(httpresults[4]);
					this.setDataStore("SundayDataHTTP");
				}
			}
		}
	},
	//* @protected
	dataStoreChanged: function () {
		if (this.data) {
			this.data.destroy();
		}
		this.data = enyo.createFromKind(this.dataStore, this);
		if (this.generated) {
			this.render();
		}
	},
	//* @public
	/**
		_removeDB_ works on the current database, it's very perminent
		so use with care.

			db.removeDB();
	*/
	removeDB: function (async) {
		if(this.data) {
			if(async === undefined) {
				async = new this.data.async();
			}
			var ret = new SundayDataReturn();
			ret.parent = this;
			async.error(function(inSender, inResponse) {
				var response = {"error": "Unknown", "reason": inResponse};
				this.recover();
				return response;
			});
			async.response(function (inSender, inResponse) {
				ret.parent.data.destroy();
				ret.parent.dataStore = "";
				ret.parent.url = "";
				ret.parent.database = "";
				ret.parent.username = "";
				ret.parent.password = "";
				ret.parent.host = "";
				ret.setValue(inResponse);
			});
			this.data.removeDB(async);
			return ret;
		} else {
		}
	},
	/**
		_put_ is used to create or update an entry. It takes
		and javascript Object, you use _id for the identifier
		and _rev for revision number. You don't have to suppy
		the _id, it get set with an unique string and gets
		return to you. So have a done function at the end to
		catch it.

			db.put({_id: "test1"}).done();
	*/
	put: function (doc, options, async) {
		if(this.data) {
			if(async === undefined) {
				async = new this.data.async();
			}
			var ret = new SundayDataReturn();
			ret.parent = this;
			async.error(function(inSender, inResponse) {
				var response = {"error": "Unknown", "reason": inResponse};
				this.recover();
				return response;
			});
			async.response(function (inSender, inResponse) {
				//console.log("inSender",inSender);
				ret.setValue(inResponse);
			});
			this.data.put(doc, options, async);
			return ret;
		} else {
		}
	},
	/**
		_get_ is used get your entry with the _id

			db.put({_id: "test1"}).done();
	*/
	get: function (docid, domid, async) {
		if(this.data) {
			if(async === undefined) {
				async = new this.data.async();
			}
			var ret = new SundayDataReturn();
			ret.parent = this;
			async.error(function(inSender, inResponse) {
				var response = {"error": "Unknown", "reason": inResponse};
				if(inResponse === 404) {
					response = {"error": "Not Found", "reason": inResponse};
				}
				this.recover();
				return response;
			});
			async.response(function (inSender, inResponse) {
				ret.setValue(inResponse);
			});
			this.data.get(docid, async);
			return ret;
		} else {
		}
	},
	/**
		_allDocs_ returns the name of all the entries and their
		revision number. It has some options like
		include_docs: true to get the document with it.

			db.allDocs({include_docs: true}).done(
				function(value){
					for(var i in value.rows) {
						console.log("Doc id: "+value.rows[i].id);
						console.log("Doc content: "+JSON.stringify(value.rows[i].doc));
					}
				}
			);
	*/
	allDocs: function (options, async) {
		if(this.data) {
			if(async === undefined) {
				async = new this.data.async();
			}
			var ret = new SundayDataReturn();
			ret.parent = this;
			async.error(function(inSender, inResponse) {
				var response = {"error": "Unknown", "reason": inResponse};
				this.recover();
				return response;
			});
			async.response(function (inSender, inResponse) {
				ret.setValue(inResponse);
			});
			this.data.allDocs(options, async);
			return ret;
		} else {
		}
	},
	/**
		_bulkDocs_ is used to send many docs at the same time.
		It returns the revision numbers and ids. Also if some
		error. It supports all_or_nothing in the HTTP mode for
		now, hopefully in the idb mode soon.

			var docs = [{"_id": "0", "string":"test"},
				{"_id":"1", "string":"test"},
				{"_id":"2", "string":"test"}];
			db.bulkDocs(docs).done();
	*/
	bulkDocs: function (docs, options, async) {
		if(this.data) {
			if(async === undefined) {
				async = new this.data.async();
			}
			var ret = new SundayDataReturn();
			ret.parent = this;
			async.error(function(inSender, inResponse) {
				var response = {"error": "Unknown", "reason": inResponse};
				this.recover();
				return response;
			});
			async.response(function (inSender, inResponse) {
				ret.setValue(inResponse);
			});
			this.data.bulkDocs(docs, options, async);
			return ret;
		} else {
		}
	},
	/**
		_remove_ deletes the entry with the docid.

			db.remove("docid");
	*/
	remove: function (docid, rev, async) {
		if(this.data) {
			if(async === undefined) {
				async = new this.data.async();
			}
			var ret = new SundayDataReturn();
			ret.parent = this;
			async.error(function(inSender, inResponse) {
				var response = {"error": "Unknown", "reason": inResponse};
				if(inResponse === 404) {
					response = {"error": "Not Found", "reason": inResponse};
				} else if(inResponse === 409) {
					response = {"error": "Conflict", "reason": inResponse};
				}
				this.recover();
				return response;
			});
			async.response(function (inSender, inResponse) {
				ret.setValue(inResponse);
			});
			this.data.remove(docid, rev, async);
			return ret;
		} else {
		}
	},
	/**
		_query_ is used to call a stored view function

			db.query("thedesign/theview").done();
	*/
	query: function (fun, options, async) {
		if(this.data) {
			if(async === undefined) {
				async = new this.data.async();
			}
			var ret = new SundayDataReturn();
			ret.parent = this;
			async.error(function(inSender, inResponse) {
				//console.log("error");
				var response = {"error": "Unknown", "reason": inResponse};
				this.recover();
				return response;
			});
			async.response(function (inSender, inResponse) {
				//console.log("response");
				ret.setValue(inResponse);
			});
			this.data.query(fun, options, async);
			return ret;
		} else {
		}
	},
	/**
		_replicate_ currently only replicate from the newsource
		but will work both ways soon.

			db.replicate("http://localhost:5984/test123");
	*/
	replicate: function (url, options, async) {
		if(this.data) {
			if(async === undefined) {
				async = new this.data.async();	
			}
			var ret = new SundayDataReturn();
			ret.parent = this;
			async.error(function(inSender, inResponse) {
				var response = {"error": "Unknown", "reason": inResponse};
				this.recover();
				return response;
			});
			async.response(function (inSender, inResponse) {
				ret.setValue(inResponse);
			});
			var newstore = {}, from;
			var asyncbridge = new enyo.Async();	
			if(typeof url !== "object") {
				var idbresults = url.match(this.idbcheck);
				if (idbresults !== null) {
					if (idbresults[1] !== "") {
						newstore.database = idbresults[1];
						newstore.dataStore = "SundayDataIDB";
					}
				} else {
					var httpresults = url.match(this.httpcheck);
					if (httpresults !== null && httpresults[1] !== "" && httpresults[4] !== "") {
						newstore.dataStore = "SundayDataHTTP";
						newstore.host = httpresults[1].replace(httpresults[3],"");
						newstore.database = httpresults[4];
						if(httpresults[3] !== undefined) {
							usernamepassword = httpresults[3];
							usernamepassword = usernamepassword.replace(/@$/,"").split(":");
							newstore.username = usernamepassword[0];
							newstore.password = usernamepassword[1];
						}
						//console.log("newstore",newstore);
					}
				}
				from = enyo.createFromKind(newstore.dataStore, newstore);
			} else {
				from = url.data;	
			}
			var parent = this.data;
			if(this.dataStore === "SundayDataIDB") {
				asyncbridge.response(function(inSender, inResponse) {
					from.replicate(parent, options, async);
				});
				parent.replicate(from, options, asyncbridge);
			} else {
				asyncbridge.response(function(inSender, inResponse) {
					parent.replicate(from, options, async);
				});
				from.replicate(parent, options, asyncbridge);
			}
			return ret;
		} else {
		}
	}

});

//* @protected
enyo.createFromKind = function (inKind, inParam) {
	var ctor = inKind && enyo.constructorForKind(inKind);
	if (ctor) {
		return new ctor(inParam);
	}
};

//* @protected
var SundayDataReturn = function() {
	this.resultStack = [];
	this.value = null;
	this.parent = null;
	this.setValue = function(value) {
		this.value = value;
		this._results(value); 
	};
	this.done = function (fun) {
		if(fun === undefined) { 
			fun = function(value) { console.log("value:",JSON.stringify(value)); return value; };
		}
		if (this.value === null) {
			this.resultStack.push(fun);
		} else {
			var ret = fun(this.value);
			if(ret !== undefined) {
				this.setValue(ret);
			} else {
				this.setValue(this.value);
			}
		}
		return this;
	};
	this._results = function (value) {
		if(this.resultStack.length > 0) {
			var fun = this.resultStack.shift();
			var ret = fun(value);
			if(ret === null) {
				//console.log("wait");	
			} else if(ret !== undefined) {
				this.setValue(ret);
			} else {
				this.setValue(this.value);
			}
		}
	};
	this.get = function (id, options) {
		var retparent = this;
		if(this.value !== null && this.resultStack.length === 0) {
			if(id === undefined) {
				id = this.value.id === undefined?this.value._id:this.value.id;
			}
			if(id !== undefined) {
				this.parent.get(this.value, options).done(function(value){
					retparent.setValue(value);
				});
				return null;
			} else { 
				return this;
			}
		} else {
			var fun = function(ret) {
				if(ret !== undefined || id !== undefined) {
					var rid;
					if(id === undefined) {
						rid = ret.id === undefined?ret._id:ret.id;
					} else {
						rid = id;
					}
					if(rid !== undefined) {
						retparent.parent.get(rid).done(function(value){
							retparent.setValue(value);
						});
					} else { 
						retparent.setValue(ret);
					}
				}
				return null;
			};
			this.resultStack.push(fun);
			return this;
		}
	};
	this.put = function (doc, options) {
		var retparent = this;
		if(this.value !== null && this.resultStack.length === 0) {
			if(doc === undefined) {
				this.value = doc;
			}
			id = this.value.id === undefined?this.value._id:this.value.id;
			if(id !== undefined) {
				this.parent.put(this.value, options).done(function(value){
					retparent.setValue(value);
				});
				return null;
			} else { 
				return this;
			}
		} else {
			var fun = function(ret) {
				if(doc !== undefined) {
					ret = doc;
				}
				if(ret !== undefined) {
					var rid = ret.id === undefined?ret._id:ret.id;
					if(rid !== undefined) {
						retparent.parent.put(ret, options).done(function(value){
							retparent.setValue(value);
						});
					} else { 
						retparent.setValue(ret);
					}
				}
				return null;
			};
			this.resultStack.push(fun);
			return this;
		}
	};
	this.removeDB = function () {
		var retparent = this;
		var fun = function(ret) {
			if(ret !== undefined) {
				retparent.parent.removeDB().done(function(value){
					retparent.setValue(value);
				});
				return null;
			}
		};
		this.resultStack.push(fun);
		return this;
	};
	this.bulkDocs = function (docs, options) {
		if(docs === undefined) {
			var retparent = this;
			var fun = function(ret) {
				if(ret !== undefined && ret instanceof Array) {
						retparent.parent.bulkDocs(ret, options).done(function(value){
							retparent.setValue(value);
						});
				} else {
					retparent.setValue(ret);
				}
				return null;
			};
			this.resultStack.push(fun);
			return this;
		} else {
			return this.parent.bulkDocs(docs, options);
		}
	};
	this.allDocs = function (options) {
		var retparent = this;
		var fun = function(ret) {
			retparent.parent.allDocs(options).done(function(value){
				retparent.setValue(value);
			});
			return null;
		};
		this.resultStack.push(fun);
		return this;
	};
	this.remove = function (docid, rev) {
		if(docid === undefined) {
			if(this.value !== null) {
				docid = this.value.id === undefined?this.value._id:this.value.id;
				rev = this.value.rev === undefined?this.value._rev:this.value.rev;
				if(docid !== undefined) {
					return this.parent.remove(docid, rev);
				} else { 
					return this;
				}
			} else {
					var retparent = this;
					var fun = function(ret) {
						if(ret !== undefined) {
							var rdocid = ret.id === undefined?ret._id:ret.id;
							var rrev = ret.rev === undefined?ret._rev:ret.rev;
							if(rdocid !== undefined) {
								retparent.parent.remove(rdocid, rrev).done(function(value){
									retparent.setValue(value);
								});
							} else { 
								retparent.setValue(ret);
							}
						}
						return null;
					};
					this.resultStack.push(fun);
					return this;
			}
		} else {
			return this.parent.remove(docid, rev);
		}
	};
	this.query = function (fun, options) {
		var retparent = this;
		var rfun = function(ret) {
			retparent.parent.query(fun, options).done(function(value){
				retparent.setValue(value);
			});
			return null;
		};
		this.resultStack.push(rfun);
		return this;
	};
	this.replicate = function (url) {
		var retparent = this;
		var fun = function(ret) {
			retparent.parent.replicate(url).done(function(value){
				retparent.setValue(value);
			});
			return null;
		};
		this.resultStack.push(fun);
		return this;
	};
};
