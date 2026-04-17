const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const path = require("path");

console.log("CommonJS script starting for hamsadev bucket...");

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const accountId = process.env.R2_ACCOUNT_ID?.trim();
const bucketName = "hamsadev"; 
const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();

if (!accountId || !bucketName || !accessKeyId || !secretAccessKey) {
    console.error("Missing R2 configuration");
    process.exit(1);
}

const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
});

async function testUpload() {
    const key = "test-final-check.txt";
    try {
        console.log("Testing PutObject to R2 bucket: hamsadev...");
        await r2.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: "Final check " + new Date().toISOString(),
            ContentType: "text/plain",
        }));
        console.log("Success: PutObject verified for hamsadev!");

        console.log("Testing DeleteObject from R2...");
        await r2.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        }));
        console.log("Success: DeleteObject verified for hamsadev!");

        console.log("\nBucket 'hamsadev' is accessible!");
    } catch (error) {
        console.error("Error during R2 test for hamsadev:");
        console.error("- Code:", error.Code || error.name);
        console.error("- Message:", error.message);
        if (error.$metadata) {
            console.error("- HTTP Status:", error.$metadata.httpStatusCode);
        }
        process.exit(1);
    }
}

testUpload();
