enyo.kind({
	name: "SundayDataIDBTest",
	kind: enyo.TestSuite,
	test1: function() {
                var testid = "test"+Math.uuid(32, 16).toLowerCase();
                var testSD = new SundayData("idb://"+testid+"/");
		var assertEqual = enyo.bind(this, this.assertEqual);
		testSD.put({_id: "test1", somevar: "somedata"}).get().done(
		function(value){
			assertEqual("Test that put, get and chaining work", value.somevar, "somedata");	
			testSD.removeDB();
		});
	},
	test2: function() {
                var testid = "test"+Math.uuid(32, 16).toLowerCase();
                var testSD = new SundayData("idb://"+testid+"/");
		var assertEqual = enyo.bind(this, this.assertEqual);
		var testput = testSD.put({_id: "test1", somevar: "somedata"});
		var testget = testput.get();
		testget.done(
		function(value){
			assertEqual("Test that put, get work unchained", value.somevar, "somedata");	
			testSD.removeDB();
		});
	}
});
