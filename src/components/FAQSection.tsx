'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


const FAQSection = () => {
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
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg text-white hover:no-underline text-right">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-slate-300 text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export default FAQSection
