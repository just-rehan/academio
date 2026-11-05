import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  ArrowRight, 
  Globe, 
  Zap, 
  Shield, 
  Code, 
  Check,
  CreditCard,
  Video,
  Link as LinkIcon,
  Languages,
  Layout,
  AppWindow,
  Settings,
  Star,
  Mail,
  Smartphone,
  Heart,
  Activity,
  Stethoscope,
  Search,
  FileText,
  QrCode,
  LayoutDashboard,
  BrainCircuit,
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  Clock,
  GraduationCap,
  BookOpen,
  AlertCircle,
  Calculator
} from 'lucide-react';

import { TestimonialsColumn } from './components/ui/testimonials-columns-1';
import { FAQAccordionBlock } from './components/ui/faq-accordion-block-shadcnui';
import { Dashboard } from './components/Dashboard';
import { Cta4 } from './components/ui/cta-4';
import { AnimatedLoginPage } from './components/ui/animated-characters-login-page';
import { AppProvider } from './context/AppContext';

// --- Reusable Components ---

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'ghost' | 'black'; 
  className?: string;
  [key: string]: any;
}) => {
  const { asChild, aschild, ...domProps } = props;
  const variants = {
    primary: 'cal-button-primary',
    secondary: 'cal-button-secondary',
    ghost: 'text-gray-600 hover:text-black hover:bg-gray-100 px-3 py-2 rounded-lg transition-all',
    black: 'bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-all text-sm'
  };

  return (
    <button className={`${variants[variant]} ${className}`} {...domProps}>
      {children}
    </button>
  );
};

const Section = ({ children, className = '', id = '', container = true, animate = true }: { children: React.ReactNode; className?: string; id?: string; container?: boolean; animate?: boolean }) => (
  <section id={id} className={`py-5 sm:py-14 md:py-24 ${className}`}>
    {container ? (
      <div className="max-w-[1200px] mx-auto px-3.5 sm:px-6">
        {animate ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        ) : (
          children
        )}
      </div>
    ) : (
      children
    )}
  </section>
);

const Card = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => {
  const { asChild, aschild, ...domProps } = props;
  return (
    <div className={`cal-card ${className}`} {...domProps}>
      {children}
    </div>
  );
};

const Badge = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => {
  const { asChild, aschild, ...domProps } = props;
  return (
    <span className={`cal-badge ${className}`} {...domProps}>
      {children}
    </span>
  );
};

// --- Landing Page Sections ---

const Navbar = ({ onEnterApp }: { onEnterApp: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', id: 'features' },
    { name: 'How It Works', id: 'how-it-works' },
    { name: 'Stakeholders', id: 'testimonials' },
    { name: 'FAQ', id: 'faq' },
    { name: 'Get Started', id: 'cta' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offsetAtTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetAtTop, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-200 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-xs' : 'bg-white/70 backdrop-blur-xs'}`}>
      <div className="max-w-[1200px] mx-auto px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 lg:gap-8">
          <a href="/" className="text-base sm:text-xl font-bold tracking-tighter flex items-center gap-2 uppercase shrink-0">
            <GraduationCap size={18} className="sm:w-5 sm:h-5 shrink-0 text-blue-600" /> Academio
          </a>
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black px-3 py-2 transition-colors whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Button variant="black" onClick={onEnterApp} className="min-h-[40px] px-5 text-xs uppercase tracking-wider font-bold">
            Access Portal <ArrowRight size={14} className="ml-1 inline" />
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <Button variant="black" onClick={onEnterApp} className="text-[11px] px-2.5 py-1.5 min-h-[32px] flex items-center font-bold">
            Portal <ArrowRight size={11} className="ml-1 inline" />
          </Button>
          <button 
            type="button"
            className="w-9 h-9 rounded-lg text-black hover:bg-gray-100 flex items-center justify-center transition-colors focus:outline-hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-14 sm:top-16 bg-black/20 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-50 lg:hidden bg-white border-b border-gray-200 px-5 py-4 flex flex-col gap-1 shadow-xl overflow-hidden"
            >
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className="text-sm font-semibold text-gray-800 py-2.5 border-b border-gray-50 hover:text-blue-600 transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </a>
              ))}
              <div className="pt-2">
                <Button variant="black" className="w-full py-3 text-xs uppercase tracking-wider font-bold" onClick={() => { setIsOpen(false); onEnterApp(); }}>
                  Access Academic Portal <ArrowRight size={13} className="ml-1.5 inline" />
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onEnterApp }: { onEnterApp: () => void }) => (
  <Section className="pt-2 sm:pt-12 pb-4 sm:pb-20">
    <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-4 sm:mb-6">
          <Zap size={13} className="text-blue-600" />
          <span>VTU Academic ERP Hub</span>
          <ChevronRight size={12} className="text-blue-400" />
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-6 leading-[1.12] tracking-tight text-slate-900 text-balance">
          Stay ahead with <span className="text-blue-600">Academio.</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-[500px] leading-relaxed font-normal">
          Track attendance, monitor internal marks, manage assignments, and identify academic concerns early — built for modern autonomous college workflows.
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 max-w-[480px] w-full">
          <button 
            onClick={onEnterApp}
            className="w-full sm:flex-1 min-h-[44px] bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-xs tracking-wide shadow-xs"
          >
            Access Portal <ArrowRight size={14} />
          </button>
          <button 
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:flex-1 min-h-[44px] bg-white hover:bg-slate-50 text-slate-800 px-5 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-xs border border-slate-300 shadow-2xs"
          >
            Explore Modules
          </button>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-6 text-xs text-slate-500 font-medium">
          <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
          <span>VTU 2022 Scheme · 4-Tier Role Workspaces</span>
        </div>
      </div>

      <div className="relative w-full min-w-0">
        <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-xs shrink-0">
                  <BrainCircuit size={18} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Academic Monitor</h3>
                  <p className="text-[11px] text-slate-500">Live Continuous Evaluation Feed</p>
                </div>
              </div>
              <div className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md flex items-center gap-1.5 border border-emerald-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Active</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { label: 'Attendance', value: '82%', icon: Clock, note: 'Safe zone (>75%)', color: 'text-emerald-600' },
                  { label: 'Avg IA Marks', value: '76/100', icon: Activity, note: 'Across 6 courses', color: 'text-blue-600' },
                  { label: 'Pending Tasks', value: '3 Due', icon: FileText, note: 'Coursework tasks', color: 'text-slate-900' },
                ].map(item => (
                  <div key={item.label} className="bg-slate-50 p-2.5 sm:p-3 rounded-lg border border-slate-200/80 text-left min-w-0">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-[10.5px] font-semibold text-slate-600 truncate">{item.label}</span>
                      <item.icon size={13} className="shrink-0" />
                    </div>
                    <div className={`text-base sm:text-xl font-bold font-mono tabular-nums ${item.color}`}>{item.value}</div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.note}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-slate-200/80 p-3 sm:p-4 space-y-2.5 bg-white">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Recent Evaluations</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <span className="font-semibold text-slate-900">IA-2: Computer Networks (21CS52)</span>
                      <p className="text-[11px] text-slate-500">Scored 24/30 · Verified by Prof. Ananya Sharma</p>
                    </div>
                    <span className="font-mono tabular-nums font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">80%</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-semibold text-slate-900">Attendance: DBMS Lab (21CSL57)</span>
                      <p className="text-[11px] text-slate-500">18 of 20 lab sessions recorded · Buffer: 3 classes</p>
                    </div>
                    <span className="font-mono tabular-nums font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">90%</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900 text-white rounded-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-md bg-slate-800 text-blue-400 shrink-0">
                    <Calculator size={15} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10.5px] text-slate-400 font-medium block">What-If Simulation</span>
                    <span className="text-xs font-semibold text-slate-100 truncate block">Attend next 4 classes to reach 85% attendance</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 shrink-0" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>VTU Guidelines</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Rule-Based Alerts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            <span>Role-Based Access</span>
          </div>
        </div>
      </div>
    </div>
  </Section>
);

const Stats = () => (
  <div className="py-2.5 sm:py-12 bg-white border-y border-gray-100 overflow-hidden">
    <div className="max-w-[1200px] mx-auto px-3.5 sm:px-6">
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-1.5 sm:gap-8 items-center">
        {[
          { label: "Centralized Records", icon: <FileText size={14} className="sm:w-5 sm:h-5" /> },
          { label: "What-If Calculator", icon: <Clock size={14} className="sm:w-5 sm:h-5" /> },
          { label: "Explainable Alerts", icon: <ShieldCheck size={14} className="sm:w-5 sm:h-5" /> }
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-4 p-0.5 sm:p-2 text-center sm:text-left"
          >
            <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-md sm:rounded-2xl bg-gray-50 flex items-center justify-center text-black shadow-xs shrink-0">
              {stat.icon}
            </div>
            <span className="text-[8px] sm:text-xs font-black uppercase tracking-wider leading-tight sm:tracking-widest">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const HowItWorks = () => (
  <Section id="features" className="bg-slate-50/70 border-t border-slate-200/80">
    <div className="text-center mb-8 sm:mb-16 px-2">
      <span className="inline-block mb-2.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-md">
        Core ERP Architecture
      </span>
      <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 tracking-tight text-slate-900 text-balance">
        Centralized. Explainable. Proactive.
      </h2>
      <p className="text-slate-600 text-sm sm:text-base max-w-[620px] mx-auto font-normal leading-relaxed">
        Bringing attendance records, internal assessments, and coursework assignments into a single authoritative dashboard for academic compliance.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {[
        { 
          title: 'Centralized Records', 
          desc: "Consolidated attendance registers, CIE scores, and assignment submissions in one place.",
          icon: <FileText className="h-5 w-5 text-blue-600" />
        },
        { 
          title: 'Attendance Forecast', 
          desc: "Simulate future lecture attendance to ensure VTU 75% examination eligibility.",
          icon: <Clock className="h-5 w-5 text-indigo-600" />
        },
        { 
          title: 'Explainable Alerts', 
          desc: "Rule-based flags trigger with transparent causes and concrete recovery targets.",
          icon: <AlertCircle className="h-5 w-5 text-rose-600" />
        },
        { 
          title: 'Role-Based Portals', 
          desc: "Customized workspaces for Admin, Class Coordinator, Subject Faculty, and Students.",
          icon: <BrainCircuit className="h-5 w-5 text-emerald-600" />
        }
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <div className="p-5 sm:p-6 flex flex-col h-full bg-white border border-slate-200/90 rounded-xl shadow-xs hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-center mb-4 shrink-0">
              {item.icon}
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight">{item.title}</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </Section>
);

const Benefits = () => (
  <Section id="how-it-works" className="bg-white border-t border-slate-200/80">
    <div className="text-center mb-8 sm:mb-16 px-2">
      <span className="inline-block mb-2.5 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">
        Academic Assurance
      </span>
      <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 tracking-tight text-slate-900 text-balance">
        Built for Timely Academic Intervention
      </h2>
      <p className="text-slate-600 text-sm sm:text-base max-w-[620px] mx-auto font-normal leading-relaxed">
        Designed to empower students, faculty mentors, and academic administrators with clear, actionable insights before semester exams.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <div className="p-6 sm:p-7 bg-white border border-slate-200/90 rounded-xl shadow-xs h-full flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-1.5">Explainable Early Alerts</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">Deterministic thresholds explain why alerts trigger and prescribe exact recovery targets.</p>
          </div>
          <div className="bg-slate-50 rounded-lg border border-slate-200/80 p-4 space-y-2.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Configured Audit Rules</div>
            <div className="space-y-2">
              <div className="bg-white border border-slate-200 p-2.5 rounded-md text-xs font-medium text-slate-800 flex justify-between items-center shadow-2xs">
                <span>Attendance &lt; 75.0% Mandatory Cutoff</span>
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">Critical</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white border border-slate-200 p-2.5 rounded-md text-xs font-medium text-slate-800 flex justify-between items-center shadow-2xs">
                  <span>IA Decline &gt; 15%</span>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">Warning</span>
                </div>
                <div className="bg-white border border-slate-200 p-2.5 rounded-md text-xs font-medium text-slate-800 flex justify-between items-center shadow-2xs">
                  <span>Overdue Tasks</span>
                  <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">Action</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="p-6 sm:p-7 bg-white border border-slate-200/90 rounded-xl shadow-xs h-full flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-1.5">Attendance What-If Forecasting</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">Students simulate hypothetical future attendance scenarios to plan leaves without violating rules.</p>
          </div>
          <div className="bg-slate-50 rounded-lg border border-slate-200/80 p-4 space-y-3">
            <div className="flex bg-white p-3 rounded-md border border-slate-200 items-center gap-3 shadow-2xs">
              <div className="w-9 h-9 bg-blue-600 rounded-md flex items-center justify-center text-white shrink-0">
                <Clock size={16} />
              </div>
              <div className="min-w-0">
                <span className="text-[10.5px] font-semibold text-blue-700 uppercase tracking-wider block">Live Forecast Active</span>
                <span className="text-xs font-bold text-slate-900 truncate block">"Attend next 4 classes to reach 85.0% buffer."</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-md font-medium text-slate-700">75% Min VTU</span>
              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-md font-mono font-semibold text-slate-900">82.0% Current</span>
              <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-md font-mono font-semibold text-emerald-800">85.0% Projected</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </Section>
);

const Testimonials = () => {
  const testimonials = [
    {
      text: "Having attendance percentages and IA marks in one dashboard prevents sudden attendance shortage notices before semester exams.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
      name: "Arjun Rao",
      role: "5th Sem CSE Student",
    },
    {
      text: "Entering marks and identifying students who need timely mentoring is seamless with automated, explainable alert flags.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
      name: "Prof. Ananya Sharma",
      role: "Assistant Professor, CSE",
    },
    {
      text: "The What-If calculator lets students see the concrete impact of upcoming classes without altering any official college records.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
      name: "Dr. K. Srinivas",
      role: "Academic Mentor & Faculty",
    },
    {
      text: "Centralizing assignment deadlines and submission logs prevents coursework backlogs during busy internal exam weeks.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
      name: "Meera Nair",
      role: "CSE Student Representative",
    },
    {
      text: "Managing class allotments and reviewing audit logs across multiple semesters is straightforward and secure.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
      name: "Prof. Rajesh Kumar",
      role: "Department Administrator",
    },
    {
      text: "The rule-based recommendations give students actionable advice on which subjects need urgent revision.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150",
      name: "Dr. P. Venkatesh",
      role: "HOD, Computer Science",
    },
  ];

  const firstColumn = testimonials.slice(0, 2);
  const secondColumn = testimonials.slice(2, 4);
  const thirdColumn = testimonials.slice(4, 6);

  return (
    <Section id="testimonials" className="bg-gray-50/30 overflow-hidden">
      <div className="text-center mb-3.5 sm:mb-16 px-1">
        <Badge className="mb-1.5 sm:mb-4">Stakeholder Perspectives</Badge>
        <h2 className="text-xl sm:text-4xl md:text-5xl font-bold mb-1.5 sm:mb-6 text-balance">Value for College Academics</h2>
        <p className="text-gray-500 text-xs sm:text-base md:text-lg max-w-[600px] mx-auto">
          How centralized tracking and early alerts benefit students, faculty mentors, and academic administrators.
        </p>
      </div>

      <div className="flex justify-center gap-2 sm:gap-6 mt-3 sm:mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[250px] sm:max-h-[600px] md:max-h-[740px] overflow-hidden">
        <TestimonialsColumn testimonials={firstColumn} duration={15} />
        <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
        <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
      </div>
    </Section>
  );
};

const FinalCTA = ({ onEnterApp }: { onEnterApp: () => void }) => (
  <Cta4
    title="Stay ahead of your academics with Academio."
    description="Centralize your academic records, test attendance What-If scenarios, and receive explainable alerts before semester finals — your complete academic hub."
    buttonText="Access Dashboard"
    buttonOnClick={onEnterApp}
    items={[
      "Centralized Attendance Tracking",
      "Internal Assessment Analytics",
      "Attendance What-If Calculator",
      "Explainable Early Alerts",
      "Role-Based Academic Portals"
    ]}
  />
);

const Footer = () => (
  <footer className="py-4 sm:py-12 border-t border-gray-100 bg-white">
    <div className="max-w-[1200px] mx-auto px-3.5 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-2.5 sm:gap-6 text-center md:text-left">
      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-tighter">
        <GraduationCap size={15} /> Academio
      </div>
      <p className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-tight">© 2026 Academio — Your Academic Hub. VTU BE CSE Mini Project.</p>
      <div className="flex flex-wrap justify-center gap-2.5 sm:gap-6">
        {['Overview', 'Features', 'Roles', 'Guidelines'].map(l => (
          <a key={l} href="#" className="text-[8.5px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors min-h-[26px] sm:min-h-[32px] flex items-center px-1">{l}</a>
        ))}
      </div>
    </div>
  </footer>
);

const LandingPage = ({ onEnterApp }: { onEnterApp: () => void }) => (
  <div className="min-h-screen bg-white w-full overflow-x-hidden">
    <Navbar onEnterApp={onEnterApp} />
    <main className="w-full overflow-x-hidden">
      <Hero onEnterApp={onEnterApp} />
      <Stats />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <div id="faq">
        <FAQAccordionBlock />
      </div>
      <div id="pricing">
        <div id="cta">
          <FinalCTA onEnterApp={onEnterApp} />
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard'>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Reset scroll to top when view changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [view]);

  return (
    <AppProvider>
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            <LandingPage onEnterApp={() => setView(isLoggedIn ? 'dashboard' : 'login')} />
          </motion.div>
        )}
        {view === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <AnimatedLoginPage 
              onLoginSuccess={() => {
                setIsLoggedIn(true);
                setView('dashboard');
              }} 
              onBack={() => setView('landing')} 
            />
          </motion.div>
        )}
        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-screen w-full overflow-hidden"
          >
            <Dashboard 
              onLogout={() => {
                setIsLoggedIn(false);
                setView('login');
              }}
              onExitToLanding={() => setView('landing')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AppProvider>
  );
}
