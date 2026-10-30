import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';
import OddsConverter from './components/OddsConverter';

export default function App() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />

      <main className="relative mx-auto flex w-full max-w-[520px] flex-1 flex-col items-center px-4 pb-10 pt-12 sm:px-6 sm:pt-20">
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 text-center sm:mb-10"
        >
          <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-card text-accent shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)]">
            <ArrowLeftRight size={20} strokeWidth={2.25} />
          </div>
          <h1 className="text-[28px] font-extrabold tracking-[0.08em] text-white sm:text-4xl">
            ODDS <span className="text-accent">CONVERTER</span>
          </h1>
          <p className="mt-3 text-[15px] text-muted">
            Convierte momios decimales y americanos al instante.
          </p>
        </motion.header>

        <OddsConverter />
      </main>

      <footer className="relative pb-6 text-center text-xs text-subtle">
        Los resultados se redondean · Americano al entero, decimal a 2 cifras
      </footer>
    </div>
  );
}
