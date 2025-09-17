import React from 'react'

const FAQSection = () => {
  const faqs = [
    {
      question: "ما هو FlowCanvasAI؟",
      answer: "منصة متكاملة لبناء تدفقات العمل التلقائية باستخدام الذكاء الاصطناعي والواجهة المرئية."
    },
    {
      question: "هل يمكنني استخدامه مجاناً؟",
      answer: "نعم، نوفر خطة مجانية تتضمن الميزات الأساسية للبدء."
    },
    {
      question: "كيف أبدأ؟",
      answer: "سجل حساب جديد واتبع دليل البدء السريع المتوفر في لوحة التحكم."
    }
  ]

  return (
    <section className="py-20 bg-slate-900">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            الأسئلة الشائعة
          </h2>
          <p className="text-slate-400">
            إجابات على أكثر الأسئلة شيوعاً
          </p>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                {faq.question}
              </h3>
              <p className="text-slate-300">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
