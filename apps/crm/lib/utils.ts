import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to Arabic locale
 */
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'long') {
    return d.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return d.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format duration in milliseconds to human readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }
  
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Safe JSON parse with fallback
 */
export function safeJSONParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'حدث خطأ غير معروف';
}

/**
 * Sleep function for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) {
    return str;
  }
  return `${str.slice(0, length)}...`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isBrowser()) return false;
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Download data as file
 */
export function downloadFile(data: string, filename: string, type: string = 'text/plain'): void {
  if (!isBrowser()) return;
  
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Merge objects deeply
 */
export function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key as keyof T])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key as keyof T] });
        } else {
          (output as any)[key] = deepMerge(
            target[key as keyof T] as any,
            source[key as keyof T] as any
          );
        }
      } else {
        Object.assign(output, { [key]: source[key as keyof T] });
      }
    });
  }
  
  return output;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// === Smart Virtual Spacing System ===
// Fixed: Coordinate System Consistency - العمل على المراكز

/**
 * Node interface for spacing calculations
 */
interface NodeForSpacing {
  id: string;
  position: { x: number; y: number };
}

/**
 * Virtual bounds for a node - 280×190 unified size
 */
interface VirtualBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

// Constants - موحدة للجميع
const VIRTUAL_WIDTH = 280;
const VIRTUAL_HEIGHT = 190;
const COMPACT_SIZE = 64;
const EXPANDED_WIDTH = 200;
const EXPANDED_HEIGHT = 110;

/**
 * Helper: حساب مركز العقدة من Top-Left position
 * 
 * ⚠️ CRITICAL FIX: المركز يُحسب بناءً على المساحة الوهمية (280×190) الموحدة
 * وليس بناءً على الحجم الحقيقي للعقدة!
 * 
 * السبب: جميع العقد (صغيرة 64×64 أو كبيرة 200×110) يجب أن يكون لها
 * نفس المساحة الوهمية 280×190 لضمان تباعد موحد ومنع التداخل.
 */
function getNodeCenter(position: { x: number; y: number }, isExpanded: boolean): { x: number; y: number } {
  // ✅ المركز دائماً في منتصف المساحة الوهمية 280×190
  return {
    x: position.x + VIRTUAL_WIDTH / 2,   // 280 / 2 = 140
    y: position.y + VIRTUAL_HEIGHT / 2   // 190 / 2 = 95
  };
}

/**
 * Helper: تحويل مركز العقدة إلى Top-Left position
 * 
 * ⚠️ CRITICAL FIX: نستخدم المساحة الوهمية (280×190) لحساب الموضع
 * وليس الحجم الحقيقي للعقدة!
 */
function centerToTopLeft(center: { x: number; y: number }, isExpanded: boolean): { x: number; y: number } {
  // ✅ نطرح نصف المساحة الوهمية من المركز
  return {
    x: center.x - VIRTUAL_WIDTH / 2,   // 280 / 2 = 140
    y: center.y - VIRTUAL_HEIGHT / 2   // 190 / 2 = 95
  };
}

/**
 * حساب المساحة الوهمية الدقيقة للعقدة
 * Virtual bounds calculation - 280×190 for ALL nodes
 * 
 * ⚠️ IMPORTANT: المركز يُحسب بناءً على المساحة الوهمية (280×190) وليس الحجم الحقيقي!
 * هذا يضمن أن جميع العقد لها مساحة وهمية موحدة بغض النظر عن حجمها الحقيقي.
 */
export function getVirtualBounds(
  node: NodeForSpacing,
  isExpanded: boolean
): VirtualBounds {
  // ❌ خطأ شائع: حساب المركز بناءً على الحجم الحقيقي
  // const actualWidth = isExpanded ? EXPANDED_WIDTH : COMPACT_SIZE;
  // const centerX = node.position.x + actualWidth / 2;
  
  // ✅ الصح: المركز دائماً في منتصف المساحة الوهمية 280×190
  // جميع العقد لها نفس المساحة الوهمية، لذا المركز موحد
  const centerX = node.position.x + VIRTUAL_WIDTH / 2;
  const centerY = node.position.y + VIRTUAL_HEIGHT / 2;
  
  // المساحة الوهمية الموحدة 280×190 حول المركز
  return {
    left: centerX - VIRTUAL_WIDTH / 2,
    right: centerX + VIRTUAL_WIDTH / 2,
    top: centerY - VIRTUAL_HEIGHT / 2,
    bottom: centerY + VIRTUAL_HEIGHT / 2,
    centerX,
    centerY,
    width: VIRTUAL_WIDTH,
    height: VIRTUAL_HEIGHT
  };
}

/**
 * التحقق من تداخل المساحات الوهمية
 * Check if two virtual bounds overlap
 */
export function hasVirtualOverlap(
  bounds1: VirtualBounds,
  bounds2: VirtualBounds
): boolean {
  // منطق عكسي - نتحقق من عدم التداخل
  const noOverlap = 
    bounds1.right <= bounds2.left ||   // bounds1 على اليسار تماماً
    bounds1.left >= bounds2.right ||   // bounds1 على اليمين تماماً
    bounds1.bottom <= bounds2.top ||   // bounds1 في الأعلى تماماً
    bounds1.top >= bounds2.bottom;     // bounds1 في الأسفل تماماً
  
  return !noOverlap;
}

/**
 * حساب أقرب مخرج من التداخل
 * Calculate nearest exit from overlap
 * (deprecated - الآن نستخدم المنطق مباشرة في findNearestValidPosition)
 */
export function calculateNearestExit(
  movingBounds: VirtualBounds,
  fixedBounds: VirtualBounds,
  currentPosition: { x: number; y: number },
  isExpanded: boolean
): { x: number; y: number } {
  // حساب المسافات في 4 اتجاهات
  const distances = {
    right: fixedBounds.right - movingBounds.left,     // دفع لليمين
    left: movingBounds.right - fixedBounds.left,      // دفع لليسار
    down: fixedBounds.bottom - movingBounds.top,      // دفع للأسفل
    up: movingBounds.bottom - fixedBounds.top         // دفع للأعلى
  };
  
  // اختيار أقرب اتجاه (أقل مسافة) + إضافة مسافة أمان
  const minDistance = Math.min(
    Math.abs(distances.right),
    Math.abs(distances.left),
    Math.abs(distances.down),
    Math.abs(distances.up)
  );
  
  const SAFETY_MARGIN = 5; // مسافة أمان إضافية
  
  // تطبيق الإزاحة في الاتجاه الأقرب
  if (Math.abs(distances.right) === minDistance) {
    return { x: currentPosition.x + distances.right + SAFETY_MARGIN, y: currentPosition.y };
  } else if (Math.abs(distances.left) === minDistance) {
    return { x: currentPosition.x - distances.left - SAFETY_MARGIN, y: currentPosition.y };
  } else if (Math.abs(distances.down) === minDistance) {
    return { x: currentPosition.x, y: currentPosition.y + distances.down + SAFETY_MARGIN };
  } else {
    return { x: currentPosition.x, y: currentPosition.y - distances.up - SAFETY_MARGIN };
  }
}

/**
 * إيجاد أقرب موضع صالح للعقدة
 * Find nearest valid position without overlapping virtual bounds
 * يستخدم حلقة تكرارية + حسابات على المراكز (Coordinate System Consistency)
 */
export function findNearestValidPosition(
  draggedNode: NodeForSpacing,
  newPosition: { x: number; y: number },
  allNodes: NodeForSpacing[],
  expandedNodes: Set<string>,
  maxAttempts: number = 20
): { x: number; y: number } {
  const isExpanded = expandedNodes.has(draggedNode.id);
  
  // تحويل الموضع إلى مركز
  let currentCenter = getNodeCenter(newPosition, isExpanded);
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    // تحويل المركز إلى Top-Left للاختبار
    const testPosition = centerToTopLeft(currentCenter, isExpanded);
    const testNode = { ...draggedNode, position: testPosition };
    const testBounds = getVirtualBounds(testNode, isExpanded);
    
    // البحث عن أي تداخل مع العقد الأخرى
    let hasOverlap = false;
    let nearestExitCenter: { x: number; y: number } | null = null;
    let minDistance = Infinity;
    
    for (const otherNode of allNodes) {
      if (otherNode.id === draggedNode.id) continue;
      
      const otherExpanded = expandedNodes.has(otherNode.id);
      const otherBounds = getVirtualBounds(otherNode, otherExpanded);
      
      if (hasVirtualOverlap(testBounds, otherBounds)) {
        hasOverlap = true;
        
        // المسافة المطلوبة بين المراكز = 280 أفقياً، 190 عمودياً
        const requiredDistanceX = VIRTUAL_WIDTH;   // 280 ��الضبط
        const requiredDistanceY = VIRTUAL_HEIGHT;  // 190 بالضبط
        
        // حساب المسافة الحالية بين المراكز
        const deltaX = testBounds.centerX - otherBounds.centerX;
        const deltaY = testBounds.centerY - otherBounds.centerY;
        
        // حساب 4 مواضع خروج محتملة من التداخل
        // كل موضع يضع المركز على مسافة requiredDistance من مركز العقدة الأخرى
        const exitOptions = [
          { // يمين
            centerX: otherBounds.centerX + requiredDistanceX,
            centerY: testBounds.centerY,
            dist: Math.abs((otherBounds.centerX + requiredDistanceX) - testBounds.centerX)
          },
          { // يسار
            centerX: otherBounds.centerX - requiredDistanceX,
            centerY: testBounds.centerY,
            dist: Math.abs((otherBounds.centerX - requiredDistanceX) - testBounds.centerX)
          },
          { // أسفل
            centerX: testBounds.centerX,
            centerY: otherBounds.centerY + requiredDistanceY,
            dist: Math.abs((otherBounds.centerY + requiredDistanceY) - testBounds.centerY)
          },
          { // أعلى
            centerX: testBounds.centerX,
            centerY: otherBounds.centerY - requiredDistanceY,
            dist: Math.abs((otherBounds.centerY - requiredDistanceY) - testBounds.centerY)
          }
        ];
        
        // اختيار أقرب اتجاه (أقل مسافة حركة مطلوبة)
        const nearest = exitOptions.reduce((min, curr) => 
          curr.dist < min.dist ? curr : min
        );
        
        if (nearest.dist < minDistance) {
          minDistance = nearest.dist;
          nearestExitCenter = {
            x: nearest.centerX,
            y: nearest.centerY
          };
        }
      }
    }
    
    // إذا لم يكن هناك تداخل، الموضع صالح
    if (!hasOverlap) {
      return centerToTopLeft(currentCenter, isExpanded);
    }
    
    // إذا وجدنا تداخل، نتحرك إلى أقرب مخرج ونحاول مرة أخرى
    if (nearestExitCenter) {
      currentCenter = nearestExitCenter;
    } else {
      // لا يمكن إيجاد مخرج، نرجع الموضع الأصلي
      return newPosition;
    }
  }
  
  // وصلنا للحد الأقصى من المحاولات، نرجع آخر موضع
  return centerToTopLeft(currentCenter, isExpanded);
}

/**
 * إيجاد موضع صالح لعقدة جديدة
 * Find valid position for a new node with iterative adjustment
 */
export function findValidPositionForNewNode(
  node: NodeForSpacing,
  allNodes: NodeForSpacing[],
  expandedNodes: Set<string>,
  maxAttempts: number = 30
): { x: number; y: number } {
  // إذا لم يكن هناك عقد، الموضع الأصلي صالح
  if (allNodes.length === 0) {
    return node.position;
  }
  
  let testPosition = { ...node.position };
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const validPosition = findNearestValidPosition(
      node,
      testPosition,
      allNodes,
      expandedNodes,
      15 // عدد أقل من المحاولات الداخلية
    );
    
    // إذا لم يتغير الموضع، معناه وجدنا موضع صالح
    if (validPosition.x === testPosition.x && validPosition.y === testPosition.y) {
      return validPosition;
    }
    
    // تحديث الموضع ومحاولة مرة أخرى
    testPosition = validPosition;
    attempts++;
  }
  
  // بعد محاولات كثيرة، نرجع آخر موضع
  return testPosition;
}

/**
 * التحقق من صلاحية التوسع
 * Check if node can expand without overlapping
 */
export function canExpandWithoutOverlap(
  nodeId: string,
  nodes: NodeForSpacing[],
  expandedNodes: Set<string>
): boolean {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return false;
  
  // تحديث expandedNodes مؤقتاً للاختبار
  const testExpandedNodes = new Set(expandedNodes);
  testExpandedNodes.add(nodeId);
  
  // التحقق من ��لتداخل
  const nodeBounds = getVirtualBounds(node, true); // true = expanded
  
  for (const otherNode of nodes) {
    if (otherNode.id === nodeId) continue;
    
    const otherExpanded = testExpandedNodes.has(otherNode.id);
    const otherBounds = getVirtualBounds(otherNode, otherExpanded);
    
    if (hasVirtualOverlap(nodeBounds, otherBounds)) {
      return false;
    }
  }
  
  return true;
}
