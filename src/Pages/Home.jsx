import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-cyan-100 px-6 text-center">
      {/* Decorative background circles */}
      <motion.div
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-300/40 blur-3xl"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-cyan-300/40 blur-3xl"
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Logo */}
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl">
          <MessageCircle className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Chatly</h1>
      </div>

      {/* Hero Section */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
      >
        Conversations reimagined.<br />
        <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
          Fast, secure & fun.
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-5 max-w-xl text-lg text-slate-600"
      >
        Chatly helps you connect instantly with friends and groups. Real-time messages, smooth design, and seamless experience.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-8 flex flex-wrap justify-center gap-4"
      >
        <Link
          href="/signup"
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-7 py-3 text-base font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="rounded-xl border border-slate-300 bg-white px-7 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 hover:scale-105"
        >
          Log In
        </Link>
      </motion.div>

      {/* Feature highlights */}
      <div className="mt-14 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
        <Feature title="Realtime" desc="Instant messaging powered by websockets." />
        <Feature title="Secure" desc="Encryption-ready architecture for privacy." />
        <Feature title="Beautiful" desc="Modern UI with smooth animations." />
      </div>

      {/* Footer */}
      <footer className="absolute bottom-5 text-sm text-slate-500">
        © {new Date().getFullYear()} Chatly. All rights reserved.
      </footer>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl bg-white/70 p-5 shadow-md backdrop-blur hover:shadow-lg"
    >
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{desc}</p>
    </motion.div>
  );
}
