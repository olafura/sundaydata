enyo.kind({
	name: "SundayDataIDBTest",
	kind: enyo.TestSuite,
	test1: function() {
		var SundayData = enyo.global.SundayData;
                var testid = "test"+Math.uuid(32, 16).toLowerCase();
                var testSD = new SundayData("idb://"+testid+"/");
		var assertEqual = enyo.bind(this, this.assertEqual);
		testSD.put({_id: "test1_1", somevar: "somedata"}).get().done(
		function(value){
			assertEqual("Test that put, get and chaining work", value.somevar, "somedata");
			testSD.removeDB();
		});
	},
	test2: function() {
		var SundayData = enyo.global.SundayData;
                var testid = "test"+Math.uuid(32, 16).toLowerCase();
                var testSD = new SundayData("idb://"+testid+"/");
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
		var SundayData = enyo.global.SundayData;
                var testid = "test"+Math.uuid(32, 16).toLowerCase();
                var testSD = new SundayData("idb://"+testid+"/");
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
		var SundayData = enyo.global.SundayData;
                var testid = "test"+Math.uuid(32, 16).toLowerCase();
                var testSD = new SundayData("idb://"+testid+"/");
		var assertNotEqual = enyo.bind(this, this.assertNotEqual);
		var testing = testSD.put({_id: "test4_1", somevar: "somedata"});
		testing.removeDB().done(
			function(value) {
				testSD.setUrl("idb://"+testid+"/");
				testSD.get("test4_1").done(
					function(value2) {
						assertNotEqual("Test that removeDB works as promised", value2.somevar, "somedata");
						testSD.removeDB();
				});
			}
		);
	}
});
