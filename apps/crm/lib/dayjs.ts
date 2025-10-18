/**
 * Day.js Configuration - إعداد Day.js
 * مكتبة خفيفة للتعامل مع التواريخ (7KB فقط)
 */

import dayjs from 'dayjs';

// Import plugins
import 'dayjs/locale/ar'; // Arabic locale
import 'dayjs/locale/ar-sa'; // Arabic Saudi Arabia
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);
dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(dayOfYear);
dayjs.extend(timezone);
dayjs.extend(utc);

// Set default locale to Arabic Saudi
dayjs.locale('ar-sa');

// Utility functions

/**
 * Format date for display
 * تنسيق التاريخ للعرض
 */
export const formatDate = (date: string | Date | dayjs.Dayjs, format: string = 'DD/MM/YYYY'): string => {
  return dayjs(date).format(format);
};

/**
 * Format date for Arabic display
 * تنسيق التاريخ بالعربية
 */
export const formatDateArabic = (date: string | Date | dayjs.Dayjs): string => {
  return dayjs(date).locale('ar-sa').format('DD MMMM YYYY');
};

/**
 * Get relative time (منذ 5 دقائق)
 */
export const getRelativeTime = (date: string | Date | dayjs.Dayjs): string => {
  return dayjs(date).locale('ar-sa').fromNow();
};

/**
 * Get calendar time (اليوم الساعة 5:30 مساءً)
 */
export const getCalendarTime = (date: string | Date | dayjs.Dayjs): string => {
  return dayjs(date).locale('ar-sa').calendar();
};

/**
 * Check if date is today
 */
export const isToday = (date: string | Date | dayjs.Dayjs): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * Check if date is past
 */
export const isPast = (date: string | Date | dayjs.Dayjs): boolean => {
  return dayjs(date).isBefore(dayjs());
};

/**
 * Check if date is future
 */
export const isFuture = (date: string | Date | dayjs.Dayjs): boolean => {
  return dayjs(date).isAfter(dayjs());
};

/**
 * Get days until date
 */
export const getDaysUntil = (date: string | Date | dayjs.Dayjs): number => {
  return dayjs(date).diff(dayjs(), 'day');
};

/**
 * Get hours until date
 */
export const getHoursUntil = (date: string | Date | dayjs.Dayjs): number => {
  return dayjs(date).diff(dayjs(), 'hour');
};

/**
 * Add days to date
 */
export const addDays = (date: string | Date | dayjs.Dayjs, days: number): dayjs.Dayjs => {
  return dayjs(date).add(days, 'day');
};

/**
 * Subtract days from date
 */
export const subtractDays = (date: string | Date | dayjs.Dayjs, days: number): dayjs.Dayjs => {
  return dayjs(date).subtract(days, 'day');
};

/**
 * Get start of day
 */
export const startOfDay = (date?: string | Date | dayjs.Dayjs): dayjs.Dayjs => {
  return dayjs(date).startOf('day');
};

/**
 * Get end of day
 */
export const endOfDay = (date?: string | Date | dayjs.Dayjs): dayjs.Dayjs => {
  return dayjs(date).endOf('day');
};

/**
 * Get start of month
 */
export const startOfMonth = (date?: string | Date | dayjs.Dayjs): dayjs.Dayjs => {
  return dayjs(date).startOf('month');
};

/**
 * Get end of month
 */
export const endOfMonth = (date?: string | Date | dayjs.Dayjs): dayjs.Dayjs => {
  return dayjs(date).endOf('month');
};

/**
 * Format date for API (YYYY-MM-DD)
 */
export const formatForAPI = (date: string | Date | dayjs.Dayjs): string => {
  return dayjs(date).format('YYYY-MM-DD');
};

/**
 * Format datetime for API (YYYY-MM-DD HH:mm:ss)
 */
export const formatDateTimeForAPI = (date: string | Date | dayjs.Dayjs): string => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

/**
 * Parse date from API
 */
export const parseFromAPI = (dateString: string): dayjs.Dayjs => {
  return dayjs(dateString, 'YYYY-MM-DD');
};

/**
 * Get duration between two dates
 */
export const getDuration = (start: string | Date | dayjs.Dayjs, end: string | Date | dayjs.Dayjs) => {
  const duration = dayjs.duration(dayjs(end).diff(dayjs(start)));
  
  return {
    days: duration.days(),
    hours: duration.hours(),
    minutes: duration.minutes(),
    seconds: duration.seconds(),
    asHours: duration.asHours(),
    asMinutes: duration.asMinutes(),
    humanize: () => duration.humanize(),
  };
};

/**
 * Check if date is between two dates
 */
export const isBetweenDates = (
  date: string | Date | dayjs.Dayjs,
  start: string | Date | dayjs.Dayjs,
  end: string | Date | dayjs.Dayjs,
  inclusive: boolean = true
): boolean => {
  return dayjs(date).isBetween(start, end, null, inclusive ? '[]' : '()');
};

/**
 * Get week of year
 */
export const getWeekOfYear = (date?: string | Date | dayjs.Dayjs): number => {
  return dayjs(date).week();
};

/**
 * Get day of year
 */
export const getDayOfYear = (date?: string | Date | dayjs.Dayjs): number => {
  return dayjs(date).dayOfYear();
};

/**
 * Format time (HH:mm)
 */
export const formatTime = (date: string | Date | dayjs.Dayjs): string => {
  return dayjs(date).format('HH:mm');
};

/**
 * Format time with seconds (HH:mm:ss)
 */
export const formatTimeWithSeconds = (date: string | Date | dayjs.Dayjs): string => {
  return dayjs(date).format('HH:mm:ss');
};

/**
 * Get current timestamp
 */
export const getCurrentTimestamp = (): string => {
  return dayjs().toISOString();
};

/**
 * Get current date
 */
export const getCurrentDate = (): string => {
  return dayjs().format('YYYY-MM-DD');
};

/**
 * Format date for display with time
 */
export const formatDateTime = (date: string | Date | dayjs.Dayjs): string => {
  return dayjs(date).locale('ar-sa').format('DD MMMM YYYY، HH:mm');
};

/**
 * Get smart date format
 * - اليوم: "اليوم الساعة 3:30 م"
 * - هذا الأسبوع: "الأحد الساعة 3:30 م"
 * - هذا الشهر: "15 أكتوبر"
 * - السنة الحالية: "15 أكتوبر"
 * - سنة أخرى: "15 أكتوبر 2024"
 */
export const getSmartDateFormat = (date: string | Date | dayjs.Dayjs): string => {
  const d = dayjs(date);
  const now = dayjs();
  
  if (d.isSame(now, 'day')) {
    return `اليوم الساعة ${d.format('h:mm A')}`;
  }
  
  if (d.isSame(now, 'week')) {
    return d.locale('ar-sa').format('dddd الساعة h:mm A');
  }
  
  if (d.isSame(now, 'year')) {
    return d.locale('ar-sa').format('DD MMMM');
  }
  
  return d.locale('ar-sa').format('DD MMMM YYYY');
};

/**
 * Validate date string
 */
export const isValidDate = (dateString: string): boolean => {
  return dayjs(dateString).isValid();
};

/**
 * Get age from birthdate
 */
export const getAge = (birthdate: string | Date | dayjs.Dayjs): number => {
  return dayjs().diff(dayjs(birthdate), 'year');
};

/**
 * Get timezone
 */
export const getTimezone = (): string => {
  return dayjs.tz.guess();
};

/**
 * Convert to timezone
 */
export const toTimezone = (date: string | Date | dayjs.Dayjs, timezone: string): dayjs.Dayjs => {
  return dayjs(date).tz(timezone);
};

// Export dayjs instance
export default dayjs;

/**
 * Usage Examples:
 * 
 * import dayjs, { formatDate, getRelativeTime } from './lib/dayjs';
 * 
 * // Format date
 * formatDate(new Date()); // "14/10/2025"
 * formatDateArabic(new Date()); // "14 أكتوبر 2025"
 * 
 * // Relative time
 * getRelativeTime(new Date()); // "منذ لحظات"
 * 
 * // Smart format
 * getSmartDateFormat(new Date()); // "اليوم الساعة 3:30 م"
 * 
 * // Manipulation
 * const tomorrow = addDays(new Date(), 1);
 * const yesterday = subtractDays(new Date(), 1);
 * 
 * // Validation
 * isValidDate('2025-10-14'); // true
 * isValidDate('invalid'); // false
 */
