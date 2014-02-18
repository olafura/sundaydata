enyo.kind({
    name: "DataLayout",
    kind: null,
    //* @protected
    constructor: function(inContainer) {
        this.container = inContainer;
        //if (inContainer) {
            //console.log("DL constructor",inContainer);
            //inContainer.addClass(this.layoutClass);
        //}
    },
    destroy: function() {
        //if (this.container) {
            //console.log("DL destroy",container);
            //this.container.removeClass(this.layoutClass);
        //}
    }
});
