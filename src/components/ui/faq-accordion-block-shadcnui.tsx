import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How does the Early Alert System work?",
    answer:
      "The system continuously evaluates subject attendance against the 75% threshold, tracks internal assessment scores across IA-1 and IA-2, and monitors assignment deadlines. When an alert condition is met, it provides an explainable reason and recommended recovery targets.",
  },
  {
    question: "What is the Attendance What-If Calculator?",
    answer:
      "It is an interactive simulation feature that allows students to forecast future attendance percentages (e.g., 'What if I attend or miss the next 4 classes?') without modifying any official college records.",
  },
  {
    question: "What are the roles for Students, Teachers, and Administrators?",
    answer:
      "Students view personal records, attendance percentages, and improvement tips. Teachers record attendance, input IA marks, and manage assignments for their assigned classes. Administrators manage user accounts, assign faculty, and review audit logs.",
  },
  {
    question: "Does the system automatically penalize or fail students?",
    answer:
      "No. The platform does not make high-stakes academic decisions. Alerts are purely diagnostic and intended to support timely faculty intervention, student mentoring, and self-correction before semester finals.",
  },
  {
    question: "Can students track their internal assessment (IA) progression?",
    answer:
      "Yes. Students can view subject-wise marks for IA-1, IA-2, lab evaluations, and continuous internal assessments, comparing their scores with target benchmarks to stay prepared.",
  },
  {
    question: "How is student academic data protected?",
    answer:
      "Strict role-based access control (RBAC) ensures students only access their own academic records, and teachers only access their assigned classes and subjects, preventing unauthorized data exposure.",
  },
];

export function FAQAccordionBlock() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full bg-white px-4 sm:px-6 py-6 sm:py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-center sm:mb-12 md:mb-16"
        >
          <Badge className="mb-2 sm:mb-4" variant="secondary">
            <HelpCircle className="mr-1 h-3 w-3" />
            FAQ
          </Badge>
          <h2 className="mb-1.5 sm:mb-4 text-xl sm:text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-balance">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-2xl text-xs sm:text-base text-muted-foreground md:text-lg px-2">
            Have a question? We've got answers. If you don't find what you're
            looking for, feel free to contact us.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-2 sm:space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Card className="overflow-hidden border-border/50 bg-white transition-all hover:border-primary/50 hover:shadow-xs sm:hover:shadow-md rounded-xl sm:rounded-2xl">
                  <motion.button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-3 sm:p-5 md:p-6 text-left min-h-[44px] sm:min-h-[52px]"
                    whileHover={{
                      backgroundColor: "rgba(0, 0, 0, 0.01)",
                    }}
                  >
                    <span className="pr-3 text-xs sm:text-base md:text-lg font-bold min-w-0">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-muted-foreground" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border/50 p-3 sm:p-5 md:p-6 bg-gray-50/40">
                          <motion.p
                            initial={{ y: -10 }}
                            animate={{ y: 0 }}
                            className="text-[11px] sm:text-sm text-muted-foreground md:text-base leading-relaxed"
                          >
                            {faq.answer}
                          </motion.p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
