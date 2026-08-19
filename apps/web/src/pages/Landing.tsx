import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Users,
  CalendarCheck,
  Briefcase,
  FileText,
  Sparkles,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 lg:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-white">SmartCampus</span>
            <span className="block text-[10px] uppercase tracking-widest text-brand-400 font-semibold">DevFusion 4.O Platform</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-brand-400 transition-colors">Features</a>
          <a href="#roles" className="hover:text-brand-400 transition-colors">Role Portals</a>
          <a href="#stats" className="hover:text-brand-400 transition-colors">Impact</a>
          <a href="#faq" className="hover:text-brand-400 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 lg:px-12 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-8">
          <Sparkles className="w-4 h-4" />
          <span>Next-Generation Smart Campus Management Platform</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Unified Digital Operating System for <span className="bg-gradient-to-r from-brand-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">Modern Universities</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Empowering Students, Faculty, Coordinators, and Administrators with real-time attendance, digital QR passes, assignment rubrics, placement portal, and automated governance.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto text-base px-8 py-4 shadow-xl shadow-brand-600/20">
              Launch Campus Platform
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-4 border-slate-700 text-slate-200">
              Explore Demo Credentials
            </Button>
          </Link>
        </div>

        {/* Dashboard Preview Banner */}
        <div className="mt-16 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 shadow-2xl backdrop-blur-sm max-w-5xl mx-auto overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop&q=80"
            alt="SmartCampus Operating System Preview"
            className="rounded-xl w-full h-80 md:h-[450px] object-cover opacity-90"
          />
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="py-16 border-y border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-extrabold text-brand-400">99.8%</p>
            <p className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Attendance Accuracy</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-400">10,000+</p>
            <p className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Active Students</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-indigo-400">500+</p>
            <p className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Campus Events</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-emerald-400">85%</p>
            <p className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Placement Conversion</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Engineered for Academic Excellence</h2>
          <p className="text-slate-400 mt-3">Comprehensive modules designed to handle all aspects of institution governance.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 hover:border-brand-500/50 transition-colors">
            <div className="p-3 w-fit rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">QR Attendance Verification</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Faculty generate dynamic time-bounded QR tokens. Students scan via mobile camera with automatic low-attendance (&lt;75%) warnings.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 hover:border-brand-500/50 transition-colors">
            <div className="p-3 w-fit rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Assignments &amp; Rubric Grading</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Upload PDF/ZIP files or submit GitHub repositories. Automatic late submission calculation and criteria-based rubric grading.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 hover:border-brand-500/50 transition-colors">
            <div className="p-3 w-fit rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Placement Drive Portal</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Browse top tier recruitment drives, check eligibility CTC thresholds, upload verified resumes, and track live interview progress.
            </p>
          </div>
        </div>
      </section>

      {/* Role Overview */}
      <section id="roles" className="py-20 border-t border-slate-800 bg-slate-900/30 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white">Tailored Role-Based Access Control</h2>
            <p className="text-slate-400 mt-2">Server-verified permissions for every role in the university ecosystem.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { role: 'Student', desc: 'View schedules, submit assignments, track attendance, download event QR passes, apply for jobs.' },
              { role: 'Faculty', desc: 'Create attendance sessions, publish assignments, upload study rubrics, grade submissions with feedback.' },
              { role: 'Coordinator', desc: 'Manage campus hackathons and events, verify seat capacity, approve club join requests, issue tickets.' },
              { role: 'Admin', desc: 'Full institutional oversight, user role assignment, audit logs, system parameters, CSV/Excel exports.' },
            ].map((r, i) => (
              <div key={i} className="p-6 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
                <div className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-wider">
                  {r.role}
                </div>
                <h4 className="text-lg font-bold text-white">{r.role} Portal</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 lg:px-12 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
            <h4 className="text-base font-semibold text-white">Is SmartCampus fully functional end-to-end?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Yes! SmartCampus is connected directly to a PostgreSQL database with Prisma ORM, Node.js Express REST API, HTTP-only secure cookies, and Socket.IO realtime notifications.</p>
          </div>
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
            <h4 className="text-base font-semibold text-white">How do demo credentials work?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Pre-seeded accounts exist for Admin (admin@smartcampus.demo), Coordinator, Faculty, and Student. All share the password: Password123!</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 SmartCampus Team — DevFusion 4.O Hackathon. All rights reserved.</p>
      </footer>
    </div>
  );
};
