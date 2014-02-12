var enyo = {};
enyo.pathResolverFactory = function() {
    this.paths = {};
};

enyo.pathResolverFactory.prototype = {
    addPath: function(inName, inPath) {
        return this.paths[inName] = inPath;
    },
    addPaths: function(inPaths) {
        if (inPaths) {
            for (var n in inPaths) {
                this.addPath(n, inPaths[n]);
            }
        }
    },
    includeTrailingSlash: function(inPath) {
        return (inPath && inPath.slice(-1) !== "/") ? inPath + "/" : inPath;
    },
    // match $name
    rewritePattern: /\$([^\/\\]*)(\/)?/g,
    // replace macros of the form $pathname with the mapped value of paths.pathname
    rewrite: function (inPath) {
        var working, its = this.includeTrailingSlash, paths = this.paths;
        var fn = function(macro, name) {
            working = true;
            return its(paths[name]) || '';
        };
        var result = inPath;
        do {
            working = false;
            result = result.replace(this.rewritePattern, fn);
        } while (working);
        return result;
    }
};

enyo.log = function(msg) {
    console.log(msg);
};

enyo.path = new enyo.pathResolverFactory();
enyo.platform = {}
enyo.json = JSON
enyo.warn = enyo.log
