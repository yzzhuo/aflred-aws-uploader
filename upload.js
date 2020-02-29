const fs = require('fs');
const AWS = require('aws-sdk');
const config = require('./config.js');
const path = require('path');
const clipboardy = require('clipboardy');

const s3 = new AWS.S3({
    accessKeyId: config.ACCESS_ID,
    secretAccessKey: config.SECRET_KEY
});

const getFileNameFromClipboard = function() {
    const data = clipboardy.readSync();
    return data;
}

function upload() {
    return new Promise(function(resolve, reject) {

        // read content frome the file;
        const fileName = getFileNameFromClipboard();
        if (!fileName) {
            reject({
                message: 'Plase copy your upload file path first.'
            })
        }
        let file;
        try {
            file = fs.readFileSync(fileName);
        } catch {
            reject({message: 'Cannot read the file of ' + fileName})
        }
        // setting up s3 upload parameter
        const params = {
            Bucket: config.BUCKET_NAME,
            Key: `${Date.now()}_${path.basename(fileName)}`, // file name you want to save as in s3
            Body: file,
            ACL: 'public-read',
        };
            s3.upload(params, function(err, data) {
                if (err) {
                    reject({
                        data: undefined,
                        message: 'Upload fail when uploading to aws'
                    });
                } else {
                    clipboardy.writeSync(data.Location);
                    resolve({
                        data: data.Location,
                        message: 'Upload Successfully',
                    });
                }
            })
        });
}

exports.upload = upload;