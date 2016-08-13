var drive = require('googleapis').drive('v3');

module.exports = function(options) {

    this.list = function() {
        return list(options.auth);
    };

    this.create = function(fileName, data) {
        var metadata = {
            'name': fileName,
            'parents': [ 'appDataFolder']
        };

        var media = {
            mimeType: 'application/json',
            body: JSON.stringify(data)
        };

        drive.files.create({
            resource: metadata,
            media: media,
            fields: 'id',
            auth: options.auth
        }, function(err, response) {
            if(err) throw err;
            else {
                console.log(response);
            }
        });
    };

    this.get = function(fileId) {
        drive.files.get({
            fileId: fileId,
            alt: 'media',
            auth: options.auth
        }, function(err, data) {
            if(err) throw err;
            else {
                console.log(data);
            }
        });
    };

    this.update = function(fileId, data) {
        drive.files.update(
            {
                fileId: fileId,
                uploadType: 'media',
                media: {
                    mimeType: 'application/json',
                    body: JSON.stringify(data)
                },
                auth: options.auth
            },
            function(err, response) {
                if(err) throw err;
                else {
                    console.log(response);
                }
            }
        );
    };

    this.delete = function(fileId) {
        drive.files.delete({
            fileId: fileId,
            auth: options.auth
        }, function(err, response) {
            if(err) throw err;
            else {
                console.log(response);
            }
        });
    };

    return this;
};

function list(auth, files, nextPageToken) {
    if(nextPageToken || files == undefined) {

        var params = {
            spaces: 'appDataFolder',
            fields: 'nextPageToken, files(id, name)',
            pageSize: 100,
            auth: auth
        };

        if(nextPageToken) params.pageToken = nextPageToken;

        drive.files.list(params, function(err, response) {
            if(err) throw err;
            else {
                if(!files) files = [];
                files.concat(response.files);
                return list(auth, files, response.nextPageToken);
            }
        });

    } else {
        return files;
    }
}