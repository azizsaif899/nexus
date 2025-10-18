import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Copy to clipboard utility
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'absolute'
      textArea.style.left = '-999999px'
      document.body.prepend(textArea)
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
      return true
    }
  } catch (error) {
    console.error('Failed to copy text:', error)
    return false
  }
}

// Format date for different locales
export function formatDate(date: Date, locale: 'ar' | 'en' = 'en'): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }

  if (locale === 'ar') {
    return new Intl.DateTimeFormat('ar-SA', options).format(date)
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

// Debounce function for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Generate unique ID
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate color palette
export function generateColorPalette(baseColor: string): string[] {
  // This is a simplified version - in a real app you'd use a proper color library
  const variations = [
    baseColor,
    baseColor + '90',
    baseColor + '80',
    baseColor + '70',
    baseColor + '60'
  ]
  return variations
}

// Sleep utility for async operations
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Check if device is mobile
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= 768
}

// Check if running on client side
export function isClient(): boolean {
  return typeof window !== 'undefined'
}

// Get initial theme from localStorage or system preference
export function getInitialTheme(): 'dark' | 'light' {
  if (!isClient()) return 'dark'
  
  // Check localStorage first
  const stored = localStorage.getItem('theme')
  if (stored && (stored === 'dark' || stored === 'light')) {
    return stored as 'dark' | 'light'
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  
  return 'light'
}

// Get device type
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  
  const width = window.innerWidth
  if (width <= 768) return 'mobile'
  if (width <= 1024) return 'tablet'
  return 'desktop'
}

// Format number with locale
export function formatNumber(num: number, locale: 'ar' | 'en' = 'en'): string {
  if (locale === 'ar') {
    return new Intl.NumberFormat('ar-SA').format(num)
  }
  return new Intl.NumberFormat('en-US').format(num)
}

// Calculate reading time
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}

// Check if string is RTL
export function isRTL(text: string): boolean {
  const rtlChars = /[\u0590-\u083F]|[\u08A0-\u08FF]|[\uFB1D-\uFDFF]|[\uFE70-\uFEFF]/mg
  return rtlChars.test(text)
}

// AI-specific utilities
export namespace AIUtils {
  export function parseAIResponse(response: string): {
    content: string
    codeBlocks: string[]
    suggestions: string[]
  } {
    const codeBlocks: string[] = []
    const suggestions: string[] = []
    
    // Extract code blocks
    const codeRegex = /```[\s\S]*?```/g
    const codes = response.match(codeRegex) || []
    codes.forEach(code => {
      codeBlocks.push(code.replace(/```/g, '').trim())
    })
    
    // Extract suggestions (lines starting with -)
    const lines = response.split('\n')
    lines.forEach(line => {
      if (line.trim().startsWith('-')) {
        suggestions.push(line.trim().substring(1).trim())
      }
    })
    
    return {
      content: response,
      codeBlocks,
      suggestions
    }
  }

  export function calculateConfidenceScore(
    factors: {
      responseLength: number
      processingTime: number
      contextRelevance: number
    }
  ): number {
    const { responseLength, processingTime, contextRelevance } = factors
    
    // Normalize factors (0-1)
    const lengthScore = Math.min(responseLength / 1000, 1)
    const timeScore = Math.max(0, 1 - (processingTime / 5000))
    const relevanceScore = contextRelevance
    
    // Weighted average
    return (lengthScore * 0.3 + timeScore * 0.2 + relevanceScore * 0.5)
  }

  export function extractKeywords(text: string, language: 'ar' | 'en' = 'en'): string[] {
    // Simple keyword extraction - in production you'd use NLP libraries
    const stopWords = {
      en: ['the', 'is', 'at', 'which', 'on', 'and', 'a', 'to', 'as', 'are', 'was', 'will', 'be'],
      ar: ['في', 'من', 'إلى', 'على', 'عن', 'مع', 'هذا', 'هذه', 'التي', 'الذي', 'أن', 'كان', 'يكون']
    }
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !stopWords[language].includes(word))
    
    // Count word frequency
    const wordCount: { [key: string]: number } = {}
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })
    
    // Return top keywords
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word)
  }

  export function generatePromptTemplate(
    type: 'workflow' | 'code' | 'analysis',
    language: 'ar' | 'en' = 'en'
  ): string {
    const templates = {
      workflow: {
        ar: 'حلل سير العمل التالي واقترح تحسينات:\n\n{input}\n\nركز على:\n- الكفاءة\n- الأمان\n- القابلية للصيانة',
        en: 'Analyze the following workflow and suggest improvements:\n\n{input}\n\nFocus on:\n- Efficiency\n- Security\n- Maintainability'
      },
      code: {
        ar: 'اكتب كود {language} للمتطلبات التالية:\n\n{input}\n\nتأكد من:\n- أفضل الممارسات\n- التعليقات الواضحة\n- معالجة الأخطاء',
        en: 'Write {language} code for the following requirements:\n\n{input}\n\nEnsure:\n- Best practices\n- Clear comments\n- Error handling'
      },
      analysis: {
        ar: 'قم بتحليل البيانات التالية:\n\n{input}\n\nقدم:\n- رؤى رئيسية\n- اتجاهات\n- توصيات',
        en: 'Analyze the following data:\n\n{input}\n\nProvide:\n- Key insights\n- Trends\n- Recommendations'
      }
    }
    
    return templates[type][language]
  }
}

// Performance utilities
export namespace PerformanceUtils {
  export function measureTime<T>(fn: () => T): { result: T; time: number } {
    const start = performance.now()
    const result = fn()
    const time = performance.now() - start
    return { result, time }
  }

  export async function measureAsyncTime<T>(fn: () => Promise<T>): Promise<{ result: T; time: number }> {
    const start = performance.now()
    const result = await fn()
    const time = performance.now() - start
    return { result, time }
  }

  export function createBenchmark(name: string) {
    const marks: { [key: string]: number } = {}
    
    return {
      mark: (label: string) => {
        marks[label] = performance.now()
      },
      measure: (startLabel: string, endLabel: string) => {
        const start = marks[startLabel]
        const end = marks[endLabel]
        if (start && end) {
          console.log(`${name} - ${startLabel} to ${endLabel}: ${end - start}ms`)
          return end - start
        }
        return 0
      },
      getMarks: () => ({ ...marks })
    }
  }
}

// Storage utilities
export namespace StorageUtils {
  export function setItem(key: string, value: any): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Failed to set localStorage item:', error)
      return false
    }
  }

  export function getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Failed to get localStorage item:', error)
      return defaultValue
    }
  }

  export function removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Failed to remove localStorage item:', error)
      return false
    }
  }

  export function clear(): boolean {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
      return false
    }
  }
}