const { S3Client } = require("@aws-sdk/client-s3");

async function amazonDelete(req, res, next) {
	try {
		const REGION = "ap-southeast-1";

		const deleteParams = {
			ACL: "public-read",
			Bucket: process.env.S3_BUCKET_NAME,
			Delete: {
				Objects: [
					{
						Key: req.query.media.toString(),
					},
				],
				Quiet: false,
			},
		};

		const s3 = new S3Client({
			region: REGION,
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY,
				secretAccessKey: process.env.S3_SECRET_KEY,
			},
		});

		if (!deleteParams) {
			const error = new Error("can't find images");
			error.statusCode = 400;
			throw error;
		}

		let removeImages = await s3.deleteObject(deleteParams);

		if (removeImages) {
			res.status(200).json({
				success: true,
				message: "Delete images Success",
			});
		}
		next();
	} catch (err) {
		console.log(err);
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

module.exports = amazonDelete;
