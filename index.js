var drive = require('googleapis').drive('v3');

class DriveConfig {

    constructor(auth) {
        this.auth = auth;
    }

    list() {
        return list(this.auth);
    }

    create(fileName, data) {

        let self = this;

        return new Promise((resolve, reject) => {
            let params = {
                resource: {
                    'name': fileName,
                    'parents': [ 'appDataFolder']
                },
                media: {
                    mimeType: 'application/json',
                    body: JSON.stringify(data)
                },
                fields: 'id',
                auth: self.auth
            };

            drive.files.create(params, function(err, response) {
                if(err) reject(err);
                else {
                    resolve(response);
                }
            });
        });
    }

    get(fileId) {

        let self = this;

        return new Promise((resolve, reject) => {
            let params = {
                fileId: fileId,
                alt: 'media',
                auth: self.auth
            };

            drive.files.get(params, function(err, response) {
                if(err) reject(err);
                else {
                    resolve(response);
                }
            });
        });
    }

    update(fileId, data) {

        let self = this;

        return new Promise((resolve, reject) => {
            let params = {
                fileId: fileId,
                uploadType: 'media',
                media: {
                    mimeType: 'application/json',
                    body: JSON.stringify(data)
                },
                auth: self.auth
            };

            drive.files.update(params, function(err, response) {
                if(err) reject(err);
                else {
                    resolve(response);
                }
            });
        });
    }

    destroy(fileId) {

        let self = this;

        return new Promise((resolve, reject) => {
            let params = {
                fileId: fileId,
                auth: self.auth
            };

            drive.files.delete(params, function(err, response) {
                if(err) reject(err);
                else {
                    resolve(response);
                }
            });
        });
    }
}

function list(auth, files, nextPageToken) {
    if(nextPageToken || files == undefined) {

        return new Promise((resolve, reject) => {
            var params = {
                spaces: 'appDataFolder',
                fields: 'nextPageToken, files(id, name)',
                pageSize: 100,
                auth: auth
            };

            if(nextPageToken) params.pageToken = nextPageToken;

            drive.files.list(params, function(err, response) {
                if(err) reject(err);
                else {
                    if(files == undefined) files = [];
                    files = files.concat(response.files);
                    resolve(list(auth, files, response.nextPageToken));
                }
            });
        });
    } else {
        return files;
    }
}

module.exports = DriveConfig;