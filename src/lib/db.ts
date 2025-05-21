import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function connectToDatabase() {
  try {
    await prisma.$connect()
    console.log('Connected to database successfully')
  } catch (error) {
    console.error('Failed to connect to database:', error)
    throw error
  }
}

export async function disconnectFromDatabase() {
  try {
    await prisma.$disconnect()
    console.log('Disconnected from database successfully')
  } catch (error) {
    console.error('Failed to disconnect from database:', error)
    throw error
  }
}

// Helper function to check database connection
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection check failed:', error)
    return false
  }
}

// Helper function to handle database errors
export function handleDatabaseError(error: unknown): Error {
  console.error('Database error:', error)
  
  if (error instanceof Error) {
    return error
  }
  
  return new Error('Beklenmeyen bir veritabanı hatası oluştu')
}

// Helper function to safely execute database operations
export async function executeQuery<T>(
  queryFn: () => Promise<T>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const result = await queryFn()
    return { data: result, error: null }
  } catch (error) {
    const handledError = handleDatabaseError(error)
    return { data: null, error: handledError }
  }
}

// Helper function to perform database transaction
export async function executeTransaction<T>(
  transactionFn: (prisma: PrismaClient) => Promise<T>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const result = await prisma.$transaction(async (prismaTransaction: PrismaClient) => {
      return await transactionFn(prismaTransaction)
    })
    return { data: result, error: null }
  } catch (error) {
    const handledError = handleDatabaseError(error)
    return { data: null, error: handledError }
  }
}

// Types for database operations
export type DatabaseResult<T> = {
  data: T | null
  error: Error | null
}

// Helper function to format database error messages
export function formatDatabaseError(error: unknown): string {
  if (error instanceof Error) {
    // Check for common database error patterns
    if (error.message.includes('duplicate key')) {
      return 'Bu kayıt zaten mevcut.'
    }
    if (error.message.includes('not found')) {
      return 'Kayıt bulunamadı.'
    }
    if (error.message.includes('foreign key')) {
      return 'İlişkili kayıt bulunamadı.'
    }
    return error.message
  }
  return 'Beklenmeyen bir hata oluştu.'
}

// Helper function to handle database timeouts
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 5000
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Veritabanı işlemi zaman aşımına uğradı')), timeoutMs)
  })

  return Promise.race([promise, timeoutPromise])
}
