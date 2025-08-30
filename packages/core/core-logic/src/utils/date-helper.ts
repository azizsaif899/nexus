/**
 * Date Helper Utilities - TypeScript Migration
 * مساعدات التعامل مع التواريخ
 * @module DateHelper
 * @version 2.0.0 (TypeScript)
 */

export interface DateFormatOptions {
  locale?: string;
  timeZone?: string;
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
}

export function formatToISO(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return null;
  
  return dateObj.toISOString();
}

export function formatForDisplay(
  date: Date | string | null | undefined, 
  options: DateFormatOptions = {}
): string {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const { locale = 'ar-SA', ...formatOptions } = options;
  
  return dateObj.toLocaleDateString(locale, formatOptions);
}

export function daysDifference(
  startDate: Date | string, 
  endDate: Date | string
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isValidDate(date: any): date is Date | string {
  if (date === null || date === undefined || date === '') return false;
  
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
}

export function getMonthStart(date: Date | string): Date | null {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return null;
  
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
}

export function getMonthEnd(date: Date | string): Date | null {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return null;
  
  return new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
}