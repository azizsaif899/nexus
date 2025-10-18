/**
 * Form Validation Schemas - React Hook Form + Zod
 * نظام التحقق من النماذج مع Zod
 */

import { z } from 'zod';

// === Customer/Lead Validation Schemas ===

/**
 * Customer Form Schema - للعملاء والعملاء المحتملين
 */
export const customerSchema = z.object({
  name: z
    .string()
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(100, 'الاسم طويل جداً'),
  
  email: z
    .string()
    .email('بريد إلكتروني غير صحيح')
    .optional()
    .or(z.literal('')),
  
  phone: z
    .string()
    .regex(/^(\+966|00966|0)?5[0-9]{8}$/, 'رقم الهاتف غير صحيح (مثال: 0501234567)')
    .optional()
    .or(z.literal('')),
  
  company: z
    .string()
    .max(200, 'اسم الشركة طويل جداً')
    .optional()
    .or(z.literal('')),
  
  value: z
    .number()
    .min(0, 'القيمة لا يمكن أن تكون سالبة')
    .optional(),
  
  status: z.enum(['active', 'inactive', 'pending'], {
    errorMap: () => ({ message: 'الحالة غير صحيحة' }),
  }).optional(),
  
  priority: z.enum(['high', 'medium', 'low'], {
    errorMap: () => ({ message: 'الأولوية غير صحيحة' }),
  }).optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

/**
 * Task Form Schema - للمهام
 */
export const taskSchema = z.object({
  title: z
    .string()
    .min(3, 'العنوان يجب أن يكون 3 أحرف على الأقل')
    .max(200, 'العنوان طويل جداً'),
  
  description: z
    .string()
    .max(1000, 'الوصف طويل جداً')
    .optional()
    .or(z.literal('')),
  
  dueDate: z
    .string()
    .refine((date) => {
      const d = new Date(date);
      return !isNaN(d.getTime());
    }, 'تاريخ غير صحيح'),
  
  priority: z.enum(['high', 'medium', 'low']),
  
  status: z.enum(['pending', 'in-progress', 'completed']),
  
  assignee: z
    .string()
    .min(2, 'اسم المسؤول قصير جداً')
    .optional(),
  
  relatedTo: z
    .string()
    .optional()
    .or(z.literal('')),
});

export type TaskFormData = z.infer<typeof taskSchema>;

/**
 * Deal Form Schema - للصفقات
 */
export const dealSchema = z.object({
  title: z
    .string()
    .min(3, 'العنوان يجب أن يكون 3 أحرف على الأقل')
    .max(200, 'العنوان طويل جداً'),
  
  company: z
    .string()
    .min(2, 'اسم الشركة قصير جداً')
    .max(200, 'اسم الشركة طويل جداً'),
  
  value: z
    .number()
    .min(0, 'قيمة الصفقة لا يمكن أن تكون سالبة')
    .max(999999999, 'قيمة الصفقة كبيرة جداً'),
  
  probability: z
    .number()
    .min(0, 'الاحتمالية لا يمكن أن تكون سالبة')
    .max(100, 'الاحتمالية لا يمكن أن تزيد عن 100%'),
  
  contact: z
    .string()
    .min(2, 'اسم جهة الاتصال قصير جداً'),
  
  email: z
    .string()
    .email('بريد إلكتروني غير صحيح')
    .optional()
    .or(z.literal('')),
  
  phone: z
    .string()
    .optional()
    .or(z.literal('')),
  
  closeDate: z
    .string()
    .refine((date) => {
      const d = new Date(date);
      return !isNaN(d.getTime()) && d > new Date();
    }, 'تاريخ الإغلاق يجب أن يكون في المستقبل'),
  
  stage: z.enum(['prospect', 'qualified', 'proposal', 'negotiation', 'won', 'lost']),
  
  priority: z.enum(['high', 'medium', 'low']),
});

export type DealFormData = z.infer<typeof dealSchema>;

/**
 * Odoo Connection Schema - للاتصال بـ Odoo
 */
export const odooConfigSchema = z.object({
  url: z
    .string()
    .url('عنوان URL غير صحيح')
    .refine(
      (url) => url.startsWith('http://') || url.startsWith('https://'),
      'العنوان يجب أن يبدأ بـ http:// أو https://'
    ),
  
  database: z
    .string()
    .min(2, 'اسم قاعدة البيانات قصير جداً')
    .max(100, 'اسم قاعدة البيانات طويل جداً')
    .regex(/^[a-zA-Z0-9_-]+$/, 'اسم قاعدة البيانات يحتوي على أحرف غير صحيحة'),
  
  username: z
    .string()
    .min(2, 'اسم المستخدم قصير جداً')
    .max(100, 'اسم المستخدم طويل جداً'),
  
  password: z
    .string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .max(100, 'كلمة المرور طويلة جداً'),
});

export type OdooConfigFormData = z.infer<typeof odooConfigSchema>;

/**
 * Search/Filter Schema - للبحث والتصفية
 */
export const searchSchema = z.object({
  query: z
    .string()
    .max(200, 'نص البحث طويل جداً')
    .optional()
    .or(z.literal('')),
  
  status: z
    .enum(['all', 'active', 'inactive', 'pending'])
    .optional(),
  
  priority: z
    .enum(['all', 'high', 'medium', 'low'])
    .optional(),
  
  dateFrom: z
    .string()
    .optional()
    .or(z.literal('')),
  
  dateTo: z
    .string()
    .optional()
    .or(z.literal('')),
});

export type SearchFormData = z.infer<typeof searchSchema>;

/**
 * Report Configuration Schema - لإعدادات التقارير
 */
export const reportConfigSchema = z.object({
  reportType: z.enum(['monthly', 'quarterly', 'yearly', 'custom']),
  
  period: z.enum([
    'current-month',
    'last-month',
    'last-3-months',
    'last-6-months',
    'current-year',
    'last-year',
    'custom'
  ]),
  
  customStartDate: z
    .string()
    .optional()
    .or(z.literal('')),
  
  customEndDate: z
    .string()
    .optional()
    .or(z.literal('')),
  
  includeCharts: z.boolean().optional(),
  
  includeDetails: z.boolean().optional(),
});

export type ReportConfigFormData = z.infer<typeof reportConfigSchema>;

/**
 * Utility: Get Error Message from Zod
 * استخراج رسائل الخطأ من Zod
 */
export function getZodErrorMessage(error: z.ZodError): string {
  const firstError = error.errors[0];
  return firstError?.message || 'خطأ في التحقق من البيانات';
}

/**
 * Utility: Get All Error Messages
 * استخراج جميع رسائل الخطأ
 */
export function getAllZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return errors;
}

/**
 * Custom Validators - مدققات مخصصة
 */

// Saudi Phone Number Validator
export const saudiPhoneValidator = z
  .string()
  .regex(/^(\+966|00966|0)?5[0-9]{8}$/, {
    message: 'رقم الهاتف يجب أن يكون سعودي (مثال: 0501234567)',
  });

// Future Date Validator
export const futureDateValidator = z
  .string()
  .refine((date) => {
    const d = new Date(date);
    return !isNaN(d.getTime()) && d > new Date();
  }, 'التاريخ يجب أن يكون في المستقبل');

// Arabic Name Validator
export const arabicNameValidator = z
  .string()
  .regex(/^[\u0600-\u06FF\s]+$/, {
    message: 'الاسم يجب أن يكون بالعربية',
  });

// URL Validator with Protocol
export const urlWithProtocolValidator = z
  .string()
  .url('عنوان URL غير صحيح')
  .refine(
    (url) => url.startsWith('http://') || url.startsWith('https://'),
    'العنوان يجب أن يبدأ بـ http:// أو https://'
  );

// Positive Number Validator
export const positiveNumberValidator = z
  .number()
  .positive('الرقم يجب أن يكون موجب');

// Percentage Validator
export const percentageValidator = z
  .number()
  .min(0, 'النسبة لا يمكن أن تكون سالبة')
  .max(100, 'النسبة لا يمكن أن تزيد عن 100%');

/**
 * Usage Example:
 * 
 * import { useForm } from 'react-hook-form@7.55.0';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { customerSchema, type CustomerFormData } from './lib/form-validation';
 * 
 * const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormData>({
 *   resolver: zodResolver(customerSchema),
 *   defaultValues: {
 *     name: '',
 *     email: '',
 *     status: 'pending',
 *     priority: 'medium',
 *   },
 * });
 * 
 * const onSubmit = (data: CustomerFormData) => {
 *   console.log(data); // Type-safe!
 * };
 * 
 * <form onSubmit={handleSubmit(onSubmit)}>
 *   <input {...register('name')} />
 *   {errors.name && <span>{errors.name.message}</span>}
 * </form>
 */
