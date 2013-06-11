enyo.kind({
    name: "RandomizedTimer",
    kind: enyo.Component,
    minInterval: 50,
    published: {
        baseInterval: 100,
        percentTrigger: 50
    },
    events: {
        onTriggered: ""
    },
    create: function() {
        this.inherited(arguments);
        this.start();
    },
    destroy: function() {
        this.stopTimer();
        this.inherited(arguments);
    },
    start: function() {
        this.job = window.setInterval(enyo.bind(this, "timer"), this.baseInterval);
    },
    stop: function() {
        window.clearInterval(this.job);
    },
    timer: function() {
        if (Math.random() < this.percentTrigger * 0.01) {
            this.doTriggered({time: new Date().getTime()});
        }
    },
    baseIntervalChanged: function(inOldValue) {
        console.log("base");
        this.baseInterval = Math.max(this.minInterval, this.baseInterval);
        this.stop();
        this.start();
    }
});
