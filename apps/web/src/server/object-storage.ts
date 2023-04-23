import { env } from "@/env.mjs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

const client = new S3Client({
  endpoint: env.S3_ENDPOINT,
  region: "auto",
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

export async function getPresignedPostUrl(key: string) {
  const objectKey = `avatars/${nanoid()}-${key}`;

  // @todo Compress avatars images
  // @todo Restrict access to active users widget domains
  const signedUploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: objectKey,
      ACL: "public-read",
      // @todo restrict to image types
      // ContentType: "image/jpg",
    }),
    { expiresIn: 3600 }
  );

  const publicObjectUrl = `${env.NEXT_PUBLIC_S3_PUBLIC_URL}/${env.S3_BUCKET_NAME}/${objectKey}`;

  return { signedUploadUrl, publicObjectUrl };
}
