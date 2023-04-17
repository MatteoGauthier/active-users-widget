import { env } from "@/env.mjs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

const client = new S3Client({
  endpoint: env.S3_ENDPOINT,
  region: "auto",
});

export async function getPresignedPostUrl(key: string) {
  const objectKey = `avatars/${nanoid()}-${key}`;

  const url = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: objectKey,
      ACL: "public-read",
      ContentType: "image/jpg",
    }),
    { expiresIn: 3600 }
  );

  return url;
}
