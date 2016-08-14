# drive-config
A npm module for maintaining user config files (in json) on Google Drive.

## About
We can take advantage of Google Drive's appdata folder to store a users config data for our application. The user cannot see these files, but can delete config data and revoke our app's access on their Drive by clicking the gear icon in the top right -> Settings -> Manage Apps -> Options Dropdown.

## Usage
`This module is currently written with ES6 for Node 6+`

#### Setup
```javascript
var googleAuth = require('google-auth-library');
let driveConfig = require('drive-config');

// get your user's oauth2Client 
// more info about setting this up at https://github.com/google/google-api-nodejs-client
let auth = new googleAuth();
let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
oauth2Client.credentials = user.creds;

let service = new driveConfig(oauth2Client);
```

#### List
Gets all files in a user's google drive for your application
```javascript
let service = new driveConfig(oauth2Client);

service.list().then(files => {
    // do something with files
}).catch(err => {
    // handle errors
});

// Resolves as an array of files
[
    {
        id: String,
        name: String,
        data: Object,
        createdTime: Datetime,
        modifiedTime: Datetime,
    },
    ...
]
```

#### Create
Makes a new files in the user's google drive
```javascript
let service = new driveConfig(oauth2Client);

service.create(fileName, data).then(file => {
    // do something with the file
}).catch(err => {
    // handle errors
});

// Resolves as a file
{
    id: String,
    name: String,
    data: Object,
    createdTime: Datetime,
    modifiedTime: Datetime,
}
```