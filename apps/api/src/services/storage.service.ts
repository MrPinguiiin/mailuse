import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { env } from "@mailuse/env/server";

const s3 = new S3Client({
  endpoint: env.STORAGE_ENDPOINT,
  region: "auto",
  credentials: {
    accessKeyId: env.STORAGE_ACCESS_KEY,
    secretAccessKey: env.STORAGE_SECRET_KEY,
  },
  forcePathStyle: true,
});

export class StorageService {
  static async upload(key: string, body: Buffer, contentType: string) {
    await s3.send(
      new PutObjectCommand({
        Bucket: env.STORAGE_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    );
  }

  static async download(key: string): Promise<ReadableStream | null> {
    try {
      const response = await s3.send(
        new GetObjectCommand({
          Bucket: env.STORAGE_BUCKET,
          Key: key,
        })
      );
      return response.Body?.transformToWebStream() ?? null;
    } catch {
      return null;
    }
  }

  static async delete(key: string) {
    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: env.STORAGE_BUCKET,
          Key: key,
        })
      );
    } catch {
      // Ignore delete errors
    }
  }
}
