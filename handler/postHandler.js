var utils = require('./../utils/utils'),
    util = require('util');

exports.handle = function(resource){
    return function(req,res,next) {
        var action = resource.links.actions.resources;
        var property = resource.links.properties.resources;
        for (var key in action) {
            if (action.hasOwnProperty(key)) {
                var prop = action[key].prop;
                if (action[key].data[0]) {
                    var revData = reverseResults(action[key].data);
                    if (revData[0].status == "pending") {
                        var value = {};
                        var id = revData[0].ledId;
                        value[id] = revData[0].state;
                        value.timestamp = revData[0].timestamp;
                        utils.cappedPush(property[prop].data, value);
                        revData[0].status = "complete";
                    }
                }
            }
            next();
        }
    }
};

function reverseResults(array) {
    return array.slice(0).reverse();
}