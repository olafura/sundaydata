QUnit.module("IndexedDB");
asyncTest("Test that put, get and chaining work", function() {
	var testid = "test"+Math.uuid(32, 16).toLowerCase();
	var testSD = new SundayData("idb://"+testid+"/");
	testSD.put({_id: "test1_1", somevar: "somedata"}).get().done(
		function(value){
			ok(value.somevar == "somedata");	
                        start();
			testSD.removeDB();
		}
	);
});
asyncTest("Test that put, get work unchained", function() {	
	var testid = "test"+Math.uuid(32, 16).toLowerCase();
	var testSD = new SundayData("idb://"+testid+"/");
	var testput = testSD.put({_id: "test2_1", somevar: "somedata"});
	var testget = testput.get();
	testget.done(
		function(value){
			ok(value.somevar == "somedata");	
                        start();
			testSD.removeDB();
		}
	);
});
asyncTest("Test that allDocs works", function() {
	var testid = "test"+Math.uuid(32, 16).toLowerCase();
	var testSD = new SundayData("idb://"+testid+"/");
	var testing = testSD.put({_id: "test3_1", somevar: "somedata"});
	testing.put({_id: "test3_2", somevar: "somedata2"});
	testing.allDocs({include_docs: true}).done(
		function(value) {
			var test1 = value.rows[0];
			var test2 = value.rows[1];
			var testcase = test1.doc.somevar === "somedata" && test2.doc.somevar === "somedata2";
			ok(testcase);	
                        start();
			testSD.removeDB();
		}
	);
});
asyncTest("Test that removeDB works as promised", function() {
	var testid = "test"+Math.uuid(32, 16).toLowerCase();
	var testSD = new SundayData("idb://"+testid+"/");
	var testing = testSD.put({_id: "test4_1", somevar: "somedata"});
	testing.removeDB().done(
		function(value) {
			testSD.setUrl("idb://"+testid+"/");
			testSD.get("test4_1").done(
				function(value2) {
					ok(value2.somevar !== "somedata");	
                        		start();
					testSD.removeDB();
				}
			);
		}
	);
});
