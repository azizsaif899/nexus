'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "ما هو NEXUS؟",
      answer: "NEXUS هي منصة متكاملة لبناء تدفقات العمل التلقائية باستخدام الذكاء الاصطناعي وواجهة مرئية سهلة الاستخدام، بالإضافة إلى إدارة علاقات العملاء (CRM) وأدوات تحليلية متقدمة."
    },
    {
      question: "هل يمكنني استخدامه مجاناً؟",
      answer: "نعم، نوفر خطة مجانية تتيح لك الوصول إلى الميزات الأساسية وبدء استكشاف إمكانيات الأتمتة والذكاء الاصطناعي."
    },
    {
      question: "كيف أبدأ؟",
      answer: "الأمر بسيط. يمكنك التسجيل للحصول على حساب جديد في أقل من دقيقة واتباع دليل البدء السريع التفاعلي المتوفر في لوحة التحكم الخاصة بك."
    },
    {
        question: "هل أحتاج إلى خبرة برمجية لاستخدام NEXUS؟",
        answer: "لا، منصة الأتمتة المرئية (Flow) مصممة لتكون سهلة الاستخدام بدون الحاجة لكتابة أي كود. ومع ذلك، يمكن للمطورين الاستفادة من واجهات برمجة التطبيقات (APIs) المتقدمة لعمليات تكامل مخصصة."
    }
  ]

  return (
    <section id="faq" className="py-20 md:py-32 bg-slate-950">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            الأسئلة الشائعة
          </h2>
          <p className="text-slate-400">
            لديك أسئلة؟ لدينا إجابات.
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-800 rounded-lg">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between text-white hover:bg-slate-800/50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-medium">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-slate-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
