import { writeFile } from 'fs/promises'
import { join } from 'path'
import crypto from 'crypto'

// Types for file upload
export interface UploadedFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
}

export interface FileUploadResult {
  success: boolean
  url?: string
  error?: string
}

// Allowed file types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
]

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Function to generate a unique filename
function generateUniqueFilename(originalname: string): string {
  const timestamp = Date.now()
  const hash = crypto.randomBytes(8).toString('hex')
  const extension = originalname.split('.').pop()
  return `${timestamp}-${hash}.${extension}`
}

// Function to validate file
export function validateFile(file: UploadedFile): string | null {
  if (!file) {
    return 'Dosya bulunamadı'
  }

  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return 'Geçersiz dosya türü. Sadece JPEG, PNG, WEBP ve GIF dosyaları kabul edilir'
  }

  if (file.buffer.length > MAX_FILE_SIZE) {
    return 'Dosya boyutu çok büyük. Maksimum 5MB kabul edilir'
  }

  return null
}

// Function to save file to disk
export async function saveFile(file: UploadedFile): Promise<FileUploadResult> {
  try {
    const validationError = validateFile(file)
    if (validationError) {
      return { success: false, error: validationError }
    }

    // Generate unique filename
    const filename = generateUniqueFilename(file.originalname)
    
    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    
    // Save file
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, file.buffer)

    // Return public URL
    const url = `/uploads/${filename}`
    return { success: true, url }
  } catch (error) {
    console.error('File upload error:', error)
    return {
      success: false,
      error: 'Dosya yüklenirken bir hata oluştu'
    }
  }
}

// Function to delete file
export async function deleteFile(url: string): Promise<boolean> {
  try {
    const filepath = join(process.cwd(), 'public', url)
    await writeFile(filepath, '') // Overwrite with empty content
    return true
  } catch (error) {
    console.error('File deletion error:', error)
    return false
  }
}

// Function to validate image dimensions
export function validateImageDimensions(
  buffer: Buffer,
  minWidth: number = 100,
  minHeight: number = 100,
  maxWidth: number = 4096,
  maxHeight: number = 4096
): Promise<boolean> {
  return new Promise((resolve) => {
    // Create a blob URL from the buffer
    const blob = new Blob([buffer])
    const img = new Image()
    
    img.onload = () => {
      const valid = (
        img.width >= minWidth &&
        img.width <= maxWidth &&
        img.height >= minHeight &&
        img.height <= maxHeight
      )
      resolve(valid)
    }

    img.onerror = () => {
      resolve(false)
    }

    img.src = URL.createObjectURL(blob)
  })
}

// Function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// Function to get file extension
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

// Function to check if file is an image
export function isImageFile(mimetype: string): boolean {
  return ALLOWED_FILE_TYPES.includes(mimetype)
}
