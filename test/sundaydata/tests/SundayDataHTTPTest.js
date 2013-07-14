enyo.kind({
	name: "SundayDataHTTPTest",
	kind: enyo.TestSuite,
	test1: function() {
                var testid = "test"+Math.uuid(32, 16).toLowerCase();
                var testSD = new SundayData("http://testcouch:test123@localhost:5984/"+testid+"/");
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
                var testSD = new SundayData("http://testcouch:test123@localhost:5984/"+testid+"/");
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
                var testSD = new SundayData("http://testcouch:test123@localhost:5984/"+testid+"/");
		var assertTrue = enyo.bind(this, this.assertTrue);
		var testing = testSD.put({_id: "test3_1", somevar: "somedata"});
		testing.put({_id: "test3_2", somevar: "somedata2"});
		testing.allDocs({include_docs: true}).done(
			function(value) {
				var test1 = value.rows[0];
				var test2 = value.rows[1];
				var testcase = test1.doc.somevar === "somedata" && test2.doc.somevar === "somedata2";
				assertTrue("Test that allDocs works", testcase);	
				testSD.removeDB();
			}
		);
	},
	test4: function() {
                var testid = "test"+Math.uuid(32, 16).toLowerCase();
                var testSD = new SundayData("http://testcouch:test123@localhost:5984/"+testid+"/");
		var assertNotEqual = enyo.bind(this, this.assertNotEqual);
		var testing = testSD.put({_id: "test4_1", somevar: "somedata"});
		testing.removeDB().done(
			function(value) {
				testSD.setUrl("http://testcouch:test123@localhost:5984/"+testid+"/");
				testSD.get("test4_1").done(
					function(value2) {
						assertNotEqual("Test that removeDB works as promised", value2.somevar, "somedata");	
						testSD.removeDB();
				});
			}
		);
	},
	test5: function() {
                var testid = "test"+Math.uuid(32, 16).toLowerCase();
                var testSDidb = new SundayData("idb://"+testid+"/");
                var testSD = new SundayData("http://testcouch:test123@localhost:5984/"+testid+"/");
		var assertEqual = enyo.bind(this, this.assertEqual);
		var testing = testSDidb.put({_id: "test5_1", somevar: "somedata"});
		testing.replicate("http://testcouch:test123@localhost:5984/"+testid+"/").done(function(value2){
			testSD.get("test5_1").done(
				function(value3) {
					assertEqual("Test if replication works from IDB to HTTP", value3.somevar, "somedata");	
					testSD.removeDB();
					testSDidb.removeDB();
			});
		});
	},
	test6: function() {
                var testid = "test"+Math.uuid(32, 16).toLowerCase();
                var testSDidb = new SundayData("idb://"+testid+"/");
                var testSD = new SundayData("http://testcouch:test123@localhost:5984/"+testid+"/");
		var assertEqual = enyo.bind(this, this.assertEqual);
		var testing = testSDidb.put({_id: "test6_1", somevar: "somedata"});
		testing.replicate(testSD).done(function(value2){
			testSD.get("test6_1").done(
				function(value3) {
					value3.somevar = "newdata";
					return value3;
				}
			).put().done(
				function(value4) {
					testSDidb.replicate(testSD).get("test6_1").done(
						function(value5){
							assertEqual("Test if replication works, after making changes in HTTP", value5.somevar, "newdata");
							testSD.removeDB();
							testSDidb.removeDB();
						}
					);
				}
			);
		});
	},
	test7: function() {
                var testid = "test"+Math.uuid(32, 16).toLowerCase();
                var testSDidb = new SundayData("idb://"+testid+"/");
                var testSD = new SundayData("http://testcouch:test123@localhost:5984/"+testid+"/");
		var assertEqual = enyo.bind(this, this.assertEqual);
		var testing = testSDidb.put({_id: "test7_1", somevar: "somedata"});
		testing.replicate(testSD).get("test7_1").done(
			function(value) {
				value.somevar = "newdata";
				return value;
			}
		).put().replicate(testSD).get("test7_1").done(
			function(value2){
				assertEqual("Test if replication works, after making changes in IDB", value2.somevar, "newdata");
				testSD.removeDB();
				testSDidb.removeDB();
			}
		);
	},
	test8: function() {
                var testid = "test"+Math.uuid(32, 16).toLowerCase();
                var testSDidb = new SundayData("idb://"+testid+"/");
                var testSD = new SundayData("http://testcouch:test123@localhost:5984/"+testid+"/");
		var assertEqual = enyo.bind(this, this.assertEqual);
		var testing = testSD.put({_id: "test8_1", somevar: "somedata"});
		testing.replicate(testSDidb).done(function(value2){
			testSD.get("test8_1").done(
				function(value3) {
					assertEqual("Test if replication works from HTTP to IDB", value3.somevar, "somedata");	
					testSD.removeDB();
					testSDidb.removeDB();
			});
		});
	}
});
