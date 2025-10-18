'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { Badge } from './ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { motion } from 'motion/react';

export function FAQSection() {
  const { t } = useLanguage();

  const faqs = [
    {
      question: t.faq.questions.q1.question,
      answer: t.faq.questions.q1.answer,
    },
    {
      question: t.faq.questions.q2.question,
      answer: t.faq.questions.q2.answer,
    },
    {
      question: t.faq.questions.q3.question,
      answer: t.faq.questions.q3.answer,
    },
    {
      question: t.faq.questions.q4.question,
      answer: t.faq.questions.q4.answer,
    },
    {
      question: t.faq.questions.q5.question,
      answer: t.faq.questions.q5.answer,
    },
    {
      question: t.faq.questions.q6.question,
      answer: t.faq.questions.q6.answer,
    },
  ];

  return (
    <section id="faq" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="gap-2">
            {t.faq.badge}
          </Badge>

          <h2 className="text-4xl sm:text-5xl font-bold">
            {t.faq.title}
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              {t.faq.subtitle}
            </span>
          </h2>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border/50 rounded-xl px-6 bg-card/50 backdrop-blur-sm hover:border-border transition-colors"
              >
                <AccordionTrigger className="text-start hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
