/**
 * Date Helper Utilities
 * مساعدات التعامل مع التواريخ
 * @module DateHelper
 * @version 1.0.0
 */

/**
 * تنسيق التاريخ إلى صيغة ISO
 * @param {Date|string} date - التاريخ المراد تنسيقه
 * @returns {string} التاريخ بصيغة ISO
 */
function formatToISO(date) {
  if (!date) return null;
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return null;
  return dateObj.toISOString();
}

/**
 * تنسيق التاريخ للعرض
 * @param {Date|string} date - التاريخ
 * @param {string} locale - اللغة (افتراضي: ar-SA)
 * @returns {string} التاريخ منسق للعرض
 */
function formatForDisplay(date, locale = 'ar-SA') {
  if (!date) return '';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toLocaleDateString(locale);
}

/**
 * حساب الفرق بين تاريخين بالأيام
 * @param {Date|string} startDate - تاريخ البداية
 * @param {Date|string} endDate - تاريخ النهاية
 * @returns {number} عدد الأيام
 */
function daysDifference(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * التحقق من صحة التاريخ
 * @param {any} date - التاريخ المراد فحصه
 * @returns {boolean} true إذا كان التاريخ صحيح
 */
function isValidDate(date) {
  if (date === null || date === undefined || date === '') return false;
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
}

/**
 * الحصول على بداية الشهر
 * @param {Date|string} date - التاريخ
 * @returns {Date} بداية الشهر
 */
function getMonthStart(date) {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return null;
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
}

/**
 * الحصول على نهاية الشهر
 * @param {Date|string} date - التاريخ
 * @returns {Date} نهاية الشهر
 */
function getMonthEnd(date) {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return null;
  return new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
}

module.exports = {
  formatToISO,
  formatForDisplay,
  daysDifference,
  isValidDate,
  getMonthStart,
  getMonthEnd
};
