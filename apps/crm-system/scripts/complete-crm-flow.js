/**
 * مثال كامل - كيف يعمل CRM من البداية للنهاية
 */

console.log('🏢 مثال كامل: دورة حياة العميل في CRM\n');

// 1. العميل يرسل رسالة WhatsApp
console.log('📱 الخطوة 1: رسالة WhatsApp');
const whatsappMessage = {
  from: '+966501234567',
  name: 'سارة أحمد',
  message: 'أريد عرض سعر لموقع إلكتروني',
  timestamp: new Date()
};
console.log(`   📨 من: ${whatsappMessage.name}`);
console.log(`   💬 الرسالة: "${whatsappMessage.message}"`);

// 2. النظام يعالج الرسالة
console.log('\n🔄 الخطوة 2: معالجة في النظام');
console.log('   📂 الملف: packages/odoo-integration/src/whatsapp-crm-bridge.ts');
console.log('   🔗 الاتصال: http://localhost:8070 (Odoo CRM)');
console.log('   🗄️ قاعدة البيانات: azizsys_crm');

// 3. إنشاء عميل في قاعدة البيانات
console.log('\n👤 الخطوة 3: إنشاء عميل في CRM');
const newLead = {
  id: 157,
  name: whatsappMessage.name,
  phone: whatsappMessage.from,
  email: '966501234567@whatsapp.temp',
  description: whatsappMessage.message,
  source_id: 1, // WhatsApp
  stage_id: 1,  // New Lead
  create_date: whatsappMessage.timestamp,
  user_id: 2    // مندوب المبيعات: أحمد سالم
};

console.log('   🆔 ID العميل: ' + newLead.id);
console.log('   📊 المرحلة: عميل محتمل جديد');
console.log('   👨💼 المندوب: أحمد سالم');
console.log('   📍 المصدر: WhatsApp');

// 4. الرد التلقائي
console.log('\n📤 الخطوة 4: الرد التلقائي');
const autoReply = `مرحباً سارة أحمد! 👋

شكراً لاستفسارك عن الموقع الإلكتروني.

✅ رقم العميل: ${newLead.id}
📞 سيتواصل معك أحمد سالم خلال ساعة لمناقشة متطلباتك

للاستفسارات العاجلة: 920000000
موقعنا: www.azizsys.com

مع تحيات فريق AzizSys 🚀`;

console.log('   📱 تم إرسال الرد عبر WhatsApp API');

// 5. تتبع GTM
console.log('\n📊 الخطوة 5: تتبع Google Analytics');
const gtmEvent = {
  event: 'whatsapp_lead_created',
  lead_id: newLead.id,
  lead_source: 'WhatsApp',
  lead_value: 0, // سيتم تحديثه لاحقاً
  customer_name: newLead.name,
  container: 'GTM-58RWKC76'
};
console.log('   📈 الحدث: whatsapp_lead_created');
console.log('   🏷️ Container: GTM-58RWKC76');
console.log('   ✅ تم إرسال البيانات لـ Google Analytics');

// 6. إشعار فريق المبيعات
console.log('\n🔔 الخطوة 6: إشعار فريق المبيعات');
console.log('   📧 إيميل لـ: ahmed.salem@azizsys.com');
console.log('   📱 رسالة WhatsApp للمندوب');
console.log('   🎛️ إشعار في Dashboard: http://localhost:3000');

// 7. المندوب يتابع العميل
console.log('\n📞 الخطوة 7: متابعة المندوب');
console.log('   ⏰ بعد ساعة: أحمد سالم يتصل بسارة');
console.log('   💬 المحادثة: مناقشة متطلبات الموقع');
console.log('   📝 النتيجة: عرض سعر 15,000 ريال');

// 8. تحديث CRM
console.log('\n📊 الخطوة 8: تحديث حالة العميل');
const updatedLead = {
  ...newLead,
  stage_id: 3, // Proposition
  planned_revenue: 15000,
  probability: 75,
  date_deadline: new Date(Date.now() + 30*24*60*60*1000) // 30 يوم
};
console.log('   📈 المرحلة الجديدة: عرض سعر');
console.log('   💰 القيمة المتوقعة: 15,000 ريال');
console.log('   📊 احتمالية النجاح: 75%');

// 9. تتبع التحويل
console.log('\n📈 الخطوة 9: تتبع التحويل في GTM');
const conversionEvent = {
  event: 'lead_stage_updated',
  lead_id: updatedLead.id,
  new_stage: 'Proposition',
  lead_value: updatedLead.planned_revenue,
  conversion_probability: updatedLead.probability
};
console.log('   📊 الحدث: lead_stage_updated');
console.log('   💰 القيمة: 15,000 ريال');
console.log('   ✅ تم تحديث Google Analytics');

// 10. Dashboard يعرض البيانات
console.log('\n🎛️ الخطوة 10: عرض في Dashboard');
console.log('   🌐 الرابط: http://localhost:3000');
console.log('   📊 الإحصائيات المحدثة:');
console.log('     👥 إجمالي العملاء: 19 (+1)');
console.log('     📱 عملاء WhatsApp: 12 (+1)');
console.log('     💰 قيمة الصفقات المتوقعة: 245,000 ريال (+15,000)');
console.log('     📈 معدل التحويل: 18%');

// 11. التقارير التلقائية
console.log('\n📋 الخطوة 11: التقارير التلقائية');
console.log('   📊 تقرير يومي: سيتم إرساله في 6:00 ص');
console.log('   📈 تقرير أسبوعي: كل يوم أحد');
console.log('   📊 تقرير شهري: أول كل شهر');

console.log('\n🎯 الخلاصة الكاملة:');
console.log('═══════════════════════════════════════');
console.log('📱 رسالة WhatsApp → 👤 عميل في CRM → 💰 صفقة محتملة');
console.log('🔗 الملفات المستخدمة:');
console.log('   - docker/odoo-setup.yml (قاعدة البيانات)');
console.log('   - packages/odoo-integration/ (التكامل)');
console.log('   - packages/gtm-engine/ (التتبع)');
console.log('   - apps/admin-dashboard/ (العرض)');
console.log('   - scripts/quick-start-odoo.bat (التشغيل)');

console.log('\n✅ هذا هو CRM الحقيقي - من الرسالة إلى الصفقة!');