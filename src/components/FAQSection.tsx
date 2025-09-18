'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
      answer: "لا، NEXUS مصمم ليكون سهل الاستخدام بدون الحاجة لكتابة أي كود. ومع ذلك، يمكن للمطورين الاستفادة من واجهات برمجة التطبيقات (APIs) المتقدمة لعمليات تكامل مخصصة."
  }
]

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 md:py-32 bg-background">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            الأسئلة الشائعة
          </h2>
          <p className="text-muted-foreground">
            لديك أسئلة؟ لدينا إجابات.
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg font-medium hover:no-underline text-foreground">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
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
