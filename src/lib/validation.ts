// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Password requirements
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/

// Username requirements
const USERNAME_MIN_LENGTH = 3
const USERNAME_MAX_LENGTH = 30
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/

// Price validation
const MAX_PRICE = 1000000 // 1 million
const MIN_PRICE = 0

// Types for validation
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = []

  if (!email) {
    errors.push('Email adresi gereklidir')
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push('Geçerli bir email adresi giriniz')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Password validation
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = []

  if (!password) {
    errors.push('Şifre gereklidir')
  } else {
    if (password.length < PASSWORD_MIN_LENGTH) {
      errors.push(`Şifre en az ${PASSWORD_MIN_LENGTH} karakter olmalıdır`)
    }
    if (!PASSWORD_REGEX.test(password)) {
      errors.push('Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Username validation
export function validateUsername(username: string): ValidationResult {
  const errors: string[] = []

  if (!username) {
    errors.push('Kullanıcı adı gereklidir')
  } else {
    if (username.length < USERNAME_MIN_LENGTH) {
      errors.push(`Kullanıcı adı en az ${USERNAME_MIN_LENGTH} karakter olmalıdır`)
    }
    if (username.length > USERNAME_MAX_LENGTH) {
      errors.push(`Kullanıcı adı en fazla ${USERNAME_MAX_LENGTH} karakter olmalıdır`)
    }
    if (!USERNAME_REGEX.test(username)) {
      errors.push('Kullanıcı adı sadece harf, rakam, alt çizgi ve tire içerebilir')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Price validation
export function validatePrice(price: number): ValidationResult {
  const errors: string[] = []

  if (typeof price !== 'number' || isNaN(price)) {
    errors.push('Geçerli bir fiyat giriniz')
  } else {
    if (price < MIN_PRICE) {
      errors.push('Fiyat 0\'dan küçük olamaz')
    }
    if (price > MAX_PRICE) {
      errors.push(`Fiyat ${MAX_PRICE.toLocaleString()} TL'den büyük olamaz`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Title validation
export function validateTitle(title: string, minLength = 3, maxLength = 100): ValidationResult {
  const errors: string[] = []

  if (!title) {
    errors.push('Başlık gereklidir')
  } else {
    if (title.length < minLength) {
      errors.push(`Başlık en az ${minLength} karakter olmalıdır`)
    }
    if (title.length > maxLength) {
      errors.push(`Başlık en fazla ${maxLength} karakter olmalıdır`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Description validation
export function validateDescription(description: string, maxLength = 1000): ValidationResult {
  const errors: string[] = []

  if (description && description.length > maxLength) {
    errors.push(`Açıklama en fazla ${maxLength} karakter olmalıdır`)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Stock validation
export function validateStock(stock: number): ValidationResult {
  const errors: string[] = []

  if (typeof stock !== 'number' || isNaN(stock) || !Number.isInteger(stock)) {
    errors.push('Geçerli bir stok miktarı giriniz')
  } else {
    if (stock < 0) {
      errors.push('Stok miktarı 0\'dan küçük olamaz')
    }
    if (stock > 999999) {
      errors.push('Stok miktarı çok yüksek')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Comment validation
export function validateComment(comment: string, maxLength = 500): ValidationResult {
  const errors: string[] = []

  if (!comment) {
    errors.push('Yorum gereklidir')
  } else {
    if (comment.length > maxLength) {
      errors.push(`Yorum en fazla ${maxLength} karakter olmalıdır`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Category validation
export function validateCategory(category: string): ValidationResult {
  const errors: string[] = []

  if (!category) {
    errors.push('Kategori gereklidir')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Helper function to combine multiple validation results
export function combineValidationResults(...results: ValidationResult[]): ValidationResult {
  const combinedErrors = results.reduce((acc, curr) => [...acc, ...curr.errors], [] as string[])
  
  return {
    isValid: combinedErrors.length === 0,
    errors: combinedErrors
  }
}

// Helper function to format validation errors
export function formatValidationErrors(errors: string[]): string {
  return errors.join('. ')
}
