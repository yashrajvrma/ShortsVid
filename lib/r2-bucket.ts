import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "./env";

// ─── R2 Client ────────────────────────────────────────────────────────────────

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────

type UploadOptions = {
  buffer: Buffer;
  key: string;
  contentType?: string;
};

// ─── Upload helpers ───────────────────────────────────────────────────────────

export async function uploadToR2({
  buffer,
  key,
  contentType = "application/octet-stream",
}: UploadOptions): Promise<void> {
  await r2.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );
}

export async function uploadAudioToR2({
  buffer,
  key,
  contentType = "audio/mpeg",
}: UploadOptions): Promise<void> {
  return uploadToR2({ buffer, key, contentType });
}

export async function uploadImageToR2({
  buffer,
  key,
  contentType = "image/png",
}: UploadOptions): Promise<void> {
  return uploadToR2({ buffer, key, contentType });
}

export async function uploadVideoToR2({
  buffer,
  key,
  contentType = "video/mp4",
}: UploadOptions): Promise<void> {
  return uploadToR2({ buffer, key, contentType });
}

// ─── Signed URL (short-lived, for rendering / playback) ──────────────────────

/**
 * Generates a presigned GET URL for any R2 object key.
 * Default expiry: 1 hour.
 *
 * Use this at render time — fetch the key(s) from DB then call this.
 * Never store the resulting URL in the DB; always generate on demand.
 */
export async function getSignedAudioUrl(
  key: string,
  expiresIn = 3600,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(r2, command, { expiresIn });
}

/**
 * Convenience: resolves an array of R2 keys to signed URLs in parallel.
 * Order is preserved.
 */

export async function getSignedObjectUrl(
  key: string,
  expiresIn = 3600,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(r2, command, { expiresIn });
}

export async function getSignedUrlInBulk(
  keys: string[],
  expiresIn = 3600,
): Promise<string[]> {
  return Promise.all(keys.map((key) => getSignedObjectUrl(key, expiresIn)));
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteFromR2(key: string): Promise<void> {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
    }),
  );
}
