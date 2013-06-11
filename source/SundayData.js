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
	constructor: function (url) {
		this.inherited(arguments);
		if (url !== undefined && typeof url === "string") {
			this.setUrl(url);
		}
	},
	setUrl: function (url) {
		var idbcheck = /idb\:\/\/(\w*)\/?/;
		var httpcheck = /(https?\:\/\/\w*\:?\d*)\/(\w*)/;
		if (typeof url === "string") {
			var idbresults = url.match(idbcheck);
			if (idbresults !== null) {
				if (idbresults[1] !== "") {
					this.setDatabase(idbresults[1]);
					this.setDataStore("SundayDataIDB");
				}
			} else {
				var httpresults = url.match(httpcheck);
				console.log(httpresults);
				if (httpresults !== null && httpresults[1] !== "" && httpresults[2] !== "") {
					console.log("http");
					this.setHost(httpresults[1]);
					this.setDatabase(httpresults[2]);
					this.setDataStore("SundayDataHTTP");
				}
			}
		}
	},
	dataStoreChanged: function () {
		if (this.data) {
			this.data.destroy();
		}
		if (this.host !== "") {
			this.data = enyo.createFromKind(this.dataStore, this);
		} else {
			this.data = enyo.createFromKind(this.dataStore, this);
		}
		if (this.generated) {
			this.render();
		}
	},
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
				ret.setValue(inResponse);
				ret.parent.data.destroy();
			});
			this.data.removeDB(async);
			return ret;
		} else {
		}
	},
	put: function (doc, options, async) {
		console.log("doc",doc);
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
			this.data.put(doc, options, async);
			return ret;
		} else {
		}
	},
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
	query: function (fun, options, async) {
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
			this.data.query(fun, options, async);
			return ret;
		} else {
		}
	},
	replicate: function (url, async) {
		if(this.data) {
			var newstore = {};
			var idbcheck = /idb\:\/\/(\w*)\/?/;
			var httpcheck = /(https?\:\/\/\w*\:?\d*)\/(\w*)/;
			var idbresults = url.match(idbcheck);
			if (idbresults !== null) {
				if (idbresults[1] !== "") {
					newstore.database = idbresults[1];
					newstore.dataStore = "SundayDataIDB";
					async = new enyo.Async();
				}
			} else {
				var httpresults = url.match(httpcheck);
				if (httpresults !== null && httpresults[1] !== "" && httpresults[2] !== "") {
					newstore.host = httpresults[1];
					newstore.database = httpresults[2];
					newstore.dataStore = "SundayDataHTTP";
					async = new enyo.Ajax();
				}
			}
			var from = enyo.createFromKind(newstore.DataStore, newstore);
			//console.log(from);
			var parent = this.data;
			async.response(function (inSender, inResponse) {
				console.log("inSender", inSender);
				console.log("inResponse", inResponse);
				console.log("parent", parent);
				var docs = [];
				for (var doc in inResponse.rows) {
					docs.push(inResponse.rows[doc].doc);
				}
				console.log("docs", docs);
				parent.bulkDocs(docs);
			});
			from.allDocs("include_docs=true&update_seq=true", async);
		} else {
		}
	}

});

enyo.createFromKind = function (inKind, inParam) {
	var ctor = inKind && enyo.constructorForKind(inKind);
	if (ctor) {
		return new ctor(inParam);
	}
};

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
			fun = function(value) { console.log("value:",value); return value; };
		}
		if (this.value === null) {
			this.resultStack.push(fun);
		} else {
			var ret = fun(value);
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
		if(id === undefined) {
			if(this.value !== null) {
				id = this.value.id === undefined?this.value._id:this.value.id;
				if(id !== undefined) {
					return this.parent.get(id);
				} else { 
					return this;
				}
			} else {
					var retparent = this;
					var fun = function(ret) {
						if(ret !== undefined) {
							var rid = ret.id === undefined?ret._id:ret.id;
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
		} else {
			return this.parent.get(id, options);
		}
        };
        this.put = function (doc, options) {
		if(doc === undefined) {
			if(this.value !== null) {
				id = this.value.id === undefined?this.value._id:this.value.id;
				if(id !== undefined) {
					return this.parent.put(this.value);
				} else { 
					return this;
				}
			} else {
					var retparent = this;
					var fun = function(ret) {
						if(ret !== undefined) {
							var rid = ret.id === undefined?ret._id:ret.id;
							if(rid !== undefined) {
								retparent.parent.put(ret).done(function(value){
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
			return this.parent.put(doc, options);
		}
        };
	this.removeDB = function () {
		return this.parent.removeDB();
	};
	this.bulkDocs = function (docs, options) {
		return this.parent.bulkDocs(docs, options);
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
		return this.parent.query(fun, options);
	};
	this.replicate = function (url) {
		return this.parent.replicate(url);
	};
};
