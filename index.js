'use strict';
const alfy = require('alfy');
const {upload} = require('./upload');

(async () => {
	try {
		const result = await upload();
		if (result) {
			alfy.output([
				{
					title: 'Upload successfully',
					subtitle: 'Click me to copy the result',
					arg: result.data,
				}
			]);
		}
	} catch(err) {
		alfy.output([
			{
				title: 'Upload error',
				subtitle: err.message,
			}
		]);
	}
})()
