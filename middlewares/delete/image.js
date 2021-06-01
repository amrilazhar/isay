const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

async function amazonDelete(req) {
	try {
		const REGION = "ap-southeast-1";

		const s3 = new S3Client({
			region: REGION,
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY,
				secretAccessKey: process.env.S3_SECRET_KEY,
			},
		});

		const deleteParams = {
			Bucket: process.env.S3_BUCKET_NAME,
			Key: req.query.media.toString().replace(process.env.S3_URL, ""),
		};

		if (!deleteParams) {
			const error = new Error("can't find images");
			error.statusCode = 400;
			throw error;
		}

		let removeImages = await s3.send(new DeleteObjectCommand(deleteParams));

	} catch (err) {
		console.log(err);
	}
}
module.exports = amazonDelete;
