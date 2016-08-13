var options = {
    clientId: 'id-here',
    clientSecret: 'secret-here'
};

var driveConfig = require('./../index')(options);

driveConfig.list(function(err, response) {

});