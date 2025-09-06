import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { useTheme } from "./ThemeContext";

export function FAQSection() {
  const { t, language } = useTheme();
  
  const faqs = [
    {
      question: t('faq_question_1'),
      answer: t('faq_answer_1')
    },
    {
      question: t('faq_question_2'),
      answer: t('faq_answer_2')
    },
    {
      question: t('faq_question_3'),
      answer: t('faq_answer_3')
    },
    {
      question: t('faq_question_4'),
      answer: t('faq_answer_4')
    },
    {
      question: "Can I integrate with my existing tools and database?",
      answer: "Yes! We support integrations with 500+ popular tools including CRM systems, databases, cloud storage, communication platforms, and more through our robust API ecosystem."
    },
    {
      question: "Is there any guidance on getting started?",
      answer: "Absolutely! We provide comprehensive documentation, video tutorials, live onboarding sessions, and 24/7 support to ensure you get the most out of our platform from day one."
    },
    {
      question: "Are there any security concerns with AI?",
      answer: "Security is our top priority. We use enterprise-grade encryption, comply with SOC 2 and GDPR standards, and never train our models on your private data. Your information stays secure and confidential."
    },
    {
      question: "How soon can I see tangible results?",
      answer: "Most users see immediate improvements in their first week. Significant productivity gains typically manifest within 30 days as the AI learns your patterns and optimizes workflows."
    }
  ];

  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">FAQ</Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            {t('faq_title')}<br />
            <span className="text-primary">QUESTIONS</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our AI automation platform and how it can transform your workflow.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <div className="space-x-4">
            <a href="#" className="text-primary hover:underline">Contact Support</a>
            <span className="text-muted-foreground">|</span>
            <a href="#" className="text-primary hover:underline">View Documentation</a>
          </div>
        </div>
      </div>
    </section>
  );
}