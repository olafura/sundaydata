enyo.kind({
	name: "SundayDataHTTPTest",
	kind: enyo.TestSuite,
	test1: function() {
                var testid = "test"+Math.uuid(32, 16).toLowerCase();
                var testSD = new SundayData("http://localhost:5984/"+testid+"/");
		var assertEqual = enyo.bind(this, this.assertEqual);
		testSD.put({_id: "test1_1", somevar: "somedata"}).get().done(
			function(value){
				assertEqual("Test that put, get and chaining work", value.somevar, "somedata");	
				testSD.removeDB();
			}
		);
	},
	test2: function() {
                var testid = "test"+Math.uuid(32, 16).toLowerCase();
                var testSD = new SundayData("http://localhost:5984/"+testid+"/");
		var assertEqual = enyo.bind(this, this.assertEqual);
		var testput = testSD.put({_id: "test2_1", somevar: "somedata"});
		var testget = testput.get();
		testget.done(
			function(value){
				assertEqual("Test that put, get work unchained", value.somevar, "somedata");	
				testSD.removeDB();
			}
		);
	},
	test3: function() {
                var testid = "test"+Math.uuid(32, 16).toLowerCase();
                var testSD = new SundayData("http://localhost:5984/"+testid+"/");
		var assertTrue = enyo.bind(this, this.assertTrue);
		var testing = testSD.put({_id: "test3_1", somevar: "somedata"});
		testing.put({_id: "test3_2", somevar: "somedata2"});
		testing.allDocs({include_docs: true}).done().done(
			function(value) {
				var test1 = value.rows[0];
				var test2 = value.rows[1];
				var testcase = test1.doc.somevar === "somedata" && test2.doc.somevar === "somedata2";
				assertTrue("Test that allDocs works", testcase);	
				testSD.removeDB();
			}
		);
	}
});
