import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucket = process.env.S3_BUCKET ?? "lumencraft-assets";

export function getStorageBucket() {
  return bucket;
}

function makeS3Client(endpoint: string | undefined) {
  return new S3Client({
    endpoint,
    region: process.env.S3_REGION ?? "us-east-1",
    credentials:
      process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
          }
        : undefined,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== "false",
  });
}

export function getS3Client() {
  return makeS3Client(process.env.S3_ENDPOINT);
}

// Used only for presigned download URLs so browsers can reach MinIO directly.
// S3_PUBLIC_ENDPOINT defaults to S3_ENDPOINT when not set.
function getPublicS3Client() {
  return makeS3Client(process.env.S3_PUBLIC_ENDPOINT ?? process.env.S3_ENDPOINT);
}

export function getPublicAssetUrl(key: string) {
  const baseUrl = process.env.S3_PUBLIC_BASE_URL;
  if (!baseUrl) return null;
  return `${baseUrl.replace(/\/$/, "")}/${key}`;
}

export async function ensureStorageBucketReachable() {
  await getS3Client().send(new HeadBucketCommand({ Bucket: bucket }));
}

export async function uploadAsset(input: {
  key: string;
  body: Buffer;
  contentType: string;
}) {
  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
    }),
  );
}

export async function deleteAsset(key: string) {
  await getS3Client().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function createDownloadUrl(input: {
  key: string;
  filename: string;
  contentType: string;
}) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: input.key,
    ResponseContentType: input.contentType,
    ResponseContentDisposition: `attachment; filename="${input.filename.replace(/"/g, "")}"`,
  });

  return getSignedUrl(getPublicS3Client(), command, { expiresIn: 60 });
}
