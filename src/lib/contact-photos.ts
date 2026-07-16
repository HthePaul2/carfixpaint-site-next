import { randomUUID } from 'node:crypto'

import sharp from 'sharp'

export const CONTACT_PHOTO_MAX_FILES = 5
export const CONTACT_PHOTO_MAX_BYTES = 5 * 1024 * 1024
export const CONTACT_PHOTO_MAX_TOTAL_BYTES = 20 * 1024 * 1024
export const CONTACT_PHOTO_MAX_EDGE = 1920
export const CONTACT_PHOTO_ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])

export type ProcessedContactPhoto = {
  buffer: Buffer
  mimeType: 'image/webp'
  filename: string
  originalFilename: string
  sizeBytes: number
  width: number
  height: number
}

function sniffMime(buffer: Buffer): string | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg'
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'image/png'
  }
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp'
  }
  return null
}

export async function processContactPhoto(file: File): Promise<ProcessedContactPhoto> {
  if (file.size > CONTACT_PHOTO_MAX_BYTES) {
    throw new Error('file_too_large')
  }

  const originalFilename = file.name?.slice(0, 180) || 'photo.jpg'
  const input = Buffer.from(await file.arrayBuffer())
  const sniffed = sniffMime(input)

  if (!sniffed || !CONTACT_PHOTO_ALLOWED_MIME.has(sniffed)) {
    throw new Error('invalid_image_type')
  }

  if (file.type && !CONTACT_PHOTO_ALLOWED_MIME.has(file.type)) {
    throw new Error('invalid_image_type')
  }

  // rotate() applies EXIF orientation and drops GPS/EXIF from the output.
  const pipeline = sharp(input, { failOn: 'error' }).rotate().resize({
    width: CONTACT_PHOTO_MAX_EDGE,
    height: CONTACT_PHOTO_MAX_EDGE,
    fit: 'inside',
    withoutEnlargement: true,
  })

  const { data, info } = await pipeline.webp({ quality: 82 }).toBuffer({ resolveWithObject: true })

  return {
    buffer: data,
    mimeType: 'image/webp',
    filename: `${randomUUID()}.webp`,
    originalFilename,
    sizeBytes: data.byteLength,
    width: info.width ?? 0,
    height: info.height ?? 0,
  }
}

export function retentionUntilFromNow(days = 180): string {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString()
}
