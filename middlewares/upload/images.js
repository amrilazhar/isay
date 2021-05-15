const crypto = require("crypto");
const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

async function upload(req, res, next) {
	try {
		if (req.files) {
			if (!req.files.images) next();
			// cek apakah array
			if (!req.files.images.length) {
				req.files.images = [req.files.images];
			}
			const file = req.files.images;
			req.images = [];
			for (let i = 0; i < file.length; i++) {
				if (!file[i].mimetype.startsWith("image")) {
					return res.status(400).json({
						success: false,
						message: "file must be an image",
					});
				}

				if (file[i].size > 3000000) {
					return res.status(400).json({
						success: false,
						message: "file size larger than 3MB",
					});
				}

				let fileName = crypto.randomBytes(16).toString("hex");
				file[i].name = `${fileName}${path.parse(file[i].name).ext}`;

				let imageUrl = await amazonUpload(file[i], req.directory);
				req.images.push(imageUrl);
			}
		}
		next();
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, message: "internal server error" });
	}
}

async function amazonUpload(file, dir = "images/") {
	// Set the AWS region
	const REGION = "ap-southeast-1"; //e.g. "us-east-1"

	const uploadParams = {
		ACL: "public-read",
		Bucket: process.env.S3_BUCKET_NAME,
		Key: `${dir}${file.name}`,
		Body: file.data,
		ContentType: file.mimetype,
	};

	// Create Amazon S3 service client object.
	const s3 = new S3Client({
		region: REGION,
		credentials: {
			accessKeyId: process.env.S3_ACCESS_KEY,
			secretAccessKey: process.env.S3_SECRET_KEY,
		},
	});

	// Create and upload the object to the specified Amazon S3 bucket.
	const run = async () => {
		try {
			const data = await s3.send(new PutObjectCommand(uploadParams));
			if (data) return uploadParams.Key;
		} catch (err) {
			console.log("Error", err);
		}
	};
	imageUrl = await run();
	return imageUrl;
}

module.exports = upload;
