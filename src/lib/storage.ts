import { s3Storage } from '@payloadcms/storage-s3'
import type { S3ClientConfig } from '@aws-sdk/client-s3'
import type { Plugin } from 'payload'

export function isS3StorageEnabled(): boolean {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_REGION &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY,
  )
}

export function getStoragePlugins(): Plugin[] {
  if (!isS3StorageEnabled()) return []

  const config: S3ClientConfig = {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    region: process.env.S3_REGION!,
  }

  if (process.env.S3_ENDPOINT) {
    config.endpoint = process.env.S3_ENDPOINT
    config.forcePathStyle = process.env.S3_FORCE_PATH_STYLE !== 'false'
  }

  const publicUrl = process.env.S3_PUBLIC_URL?.replace(/\/+$/, '')

  return [
    s3Storage({
      enabled: true,
      collections: {
        media: publicUrl
          ? {
              disablePayloadAccessControl: true,
              generateFileURL: ({ filename, prefix }) => {
                const key = prefix ? `${prefix}/${filename}` : filename
                return `${publicUrl}/${key}`
              },
            }
          : true,
      },
      bucket: process.env.S3_BUCKET!,
      config,
    }),
  ]
}
