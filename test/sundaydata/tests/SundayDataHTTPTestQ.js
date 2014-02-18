QUnit.module("CouchDB");
asyncTest("Test that put, get and chaining work", function() {
    var testid = "test"+Math.uuid(32, 16).toLowerCase();
    var testSD = new SundayData("http://testcouch:test123@localhost:5984/"+testid+"/");
    testSD.put({_id: "test1_1", somevar: "somedata"}).get().done(
        function(value){
            ok(value.somevar === "somedata");
            start();
            testSD.removeDB();
        }
    );
});
asyncTest("Test that put, get work unchained", function() {
    var testid = "test"+Math.uuid(32, 16).toLowerCase();
    var testSD = new SundayData("http://testcouch:test123@localhost:5984/"+testid+"/");
    var testput = testSD.put({_id: "test2_1", somevar: "somedata"});
    var testget = testput.get();
    testget.done(
        function(value){
            ok(value.somevar === "somedata");
            start();
            testSD.removeDB();
        }
    );
});
asyncTest("Test that allDocs works", function() {
    var testid = "test"+Math.uuid(32, 16).toLowerCase();
    var testSD = new SundayData("http://testcouch:test123@localhost:5984/"+testid+"/");
    var testing = testSD.put({_id: "test3_1", somevar: "somedata"});
    testing.put({_id: "test3_2", somevar: "somedata2"});
    testing.allDocs({include_docs: true}).done().done(
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
    var testSD = new SundayData("http://testcouch:test123@localhost:5984/"+testid+"/");
    var testing = testSD.put({_id: "test4_1", somevar: "somedata"});
    testing.removeDB().done(
        function(value) {
            testSD.setUrl("http://testcouch:test123@localhost:5984/"+testid+"/");
            testSD.get("test4_1").done(
                function(value2) {
                    ok(value2.somevar !== "somedata");
                    start();
                    testSD.removeDB();
            });
        }
    );
});
asyncTest("Test if replication works from IDB to HTTP", function() {
    var testid = "test"+Math.uuid(32, 16).toLowerCase();
    var testSDidb = new SundayData("idb://"+testid+"/");
    var testSD = new SundayData("http://testcouch:test123@localhost:5984/"+testid+"/");
    var testing = testSDidb.put({_id: "test5_1", somevar: "somedata"});
    testing.replicate("http://testcouch:test123@localhost:5984/"+testid+"/").done(function(value2){
        testSD.get("test5_1").done(
            function(value3) {
                ok(value3.somevar === "somedata");
                start();
                testSD.removeDB();
                testSDidb.removeDB();
        });
    });
});
asyncTest("Test if replication works, after making changes in HTTP", function() {
    var testid = "test"+Math.uuid(32, 16).toLowerCase();
    var testSDidb = new SundayData("idb://"+testid+"/");
    var testSD = new SundayData("http://testcouch:test123@localhost:5984/"+testid+"/");
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
                        ok(value5.somevar ===  "newdata");
                        start();
                        testSD.removeDB();
                        testSDidb.removeDB();
                    }
                );
            }
        );
    });
});
asyncTest("Test if replication works, after making changes in IDB", function() {
    var testid = "test"+Math.uuid(32, 16).toLowerCase();
    var testSDidb = new SundayData("idb://"+testid+"/");
    var testSD = new SundayData("http://testcouch:test123@localhost:5984/"+testid+"/");
    var testing = testSDidb.put({_id: "test7_1", somevar: "somedata"});
    testing.replicate(testSD).get("test7_1").done(
        function(value) {
            value.somevar = "newdata";
            return value;
        }
    ).put().replicate(testSD).get("test7_1").done(
        function(value2){
            ok(value2.somevar === "newdata");
            start();
            testSD.removeDB();
            testSDidb.removeDB();
        }
    );
});
asyncTest("Test if replication works from HTTP to IDB", function() {
    var testid = "test"+Math.uuid(32, 16).toLowerCase();
    var testSDidb = new SundayData("idb://"+testid+"/");
    var testSD = new SundayData("http://testcouch:test123@localhost:5984/"+testid+"/");
    var testing = testSD.put({_id: "test8_1", somevar: "somedata"});
    testing.replicate(testSDidb).done(function(value2){
        testSD.get("test8_1").done().done(
            function(value3) {
                ok(value3.somevar === "somedata");
                start();
                testSD.removeDB();
                testSDidb.removeDB();
        });
    });
});
