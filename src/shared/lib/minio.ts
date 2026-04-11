import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  endpoint: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
});

export function getPublicUrl(key: string): string {
  return `${process.env.MINIO_PUBLIC_URL}/${process.env.MINIO_BUCKET}/${key}`;
}

export function getKeyFromUrl(url: string): string {
  const prefix = `${process.env.MINIO_PUBLIC_URL}/${process.env.MINIO_BUCKET}/`;
  return url.replace(prefix, "");
}

export async function uploadFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const key = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.MINIO_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }),
  );

  return getPublicUrl(key);
}

export async function deleteFile(url: string): Promise<void> {
  const key = getKeyFromUrl(url);
  if (!key) return;

  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.MINIO_BUCKET!,
      Key: key,
    }),
  );
}
