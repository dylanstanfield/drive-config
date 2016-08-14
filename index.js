var drive = require('googleapis').drive('v3');

class DriveConfigService {

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
                fields: 'id, createdTime, modifiedTime, name, size',
                auth: self.auth
            };

            drive.files.create(params, function(err, response) {
                if(err) reject(err);
                else {
                    resolve({
                        id: response.id,
                        name: response.name,
                        data: data,
                        createdTime: response.createdTime,
                        modifiedTime: response.modifiedTime,
                        size: response.size
                    });
                }
            });
        });
    }

    get(fileId) {

        let auth = this.auth;
        let $metadata;

        return getFileMetadata(auth, fileId).then(metadata => {
            $metadata = metadata;
            return getFileData(auth, fileId);
        }).then(data => {
            return {
                id: fileId,
                name: $metadata.name,
                data: data,
                createdTime: $metadata.createdTime,
                modifiedTime: $metadata.modifiedTime,
                size: $metadata.size
            }
        });

    }

    getByName(fileName) {

        let self = this;

        return self.list().then(files => {
            let callsForFileWithNameMatch = [];

            for(let file of files) {
                if(file.name === fileName) callsForFileWithNameMatch.push(self.get(file.id));
            }

            return Promise.all(callsForFileWithNameMatch);
        }).then(files => {
            return files;
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
                fields: "id, createdTime, modifiedTime, name, size",
                auth: self.auth
            };

            drive.files.update(params, function(err, response) {
                if(err) reject(err);
                else {
                    resolve({
                        id: fileId,
                        name: response.name,
                        data: data,
                        createdTime: response.createdTime,
                        modifiedTime: response.modifiedTime,
                        size: response.size
                    });
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

            drive.files.delete(params, function(err) {
                if(err) reject(err);
                else resolve();
            });
        });
    }

}

function list(auth, files, nextPageToken) {
    if(nextPageToken || files == undefined) {

        return new Promise((resolve, reject) => {
            var params = {
                spaces: 'appDataFolder',
                fields: 'nextPageToken, files(id, name, createdTime, modifiedTime, size)',
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

function getFileData(auth, fileId) {
    return new Promise((resolve, reject) => {
        let params = {
            fileId: fileId,
            alt: 'media',
            auth: auth
        };

        drive.files.get(params, function(err, data) {
            if(err) reject(err);
            else {
                resolve(data);
            }
        });
    });
}

function getFileMetadata(auth, fileId) {
    return new Promise((resolve, reject) => {
        let params = {
            fileId: fileId,
            fields: "id, name, createdTime, modifiedTime, size",
            auth: auth
        };

        drive.files.get(params, function(err, metadata) {
            if(err) reject(err);
            else {
                resolve(metadata);
            }
        });
    });
}

module.exports = DriveConfigService;