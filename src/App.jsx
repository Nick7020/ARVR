import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Preloader from './components/Preloader';
import CursorGlow from './components/CursorGlow';
import ParticlesBackground from './components/ParticlesBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Tracks from './components/Tracks';
import Timeline from './components/Timeline';
import Prizes from './components/Prizes';
import Rules from './components/Rules';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal';
import AdminPage from './components/AdminPage';

const isAdmin = window.location.pathname === '/admin';

export default function App() {
  const [loaded, setLoaded]       = useState(false);
  const [showModal, setShowModal] = useState(false);

  /* ── Admin route ── */
  if (isAdmin) return <AdminPage />;

  return (
    <>
      <Preloader onComplete={() => setLoaded(true)} />
      <CursorGlow />

      <AnimatePresence>
        {loaded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <ParticlesBackground />
            <div className="fixed inset-0 z-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.15) 0%, transparent 60%)' }} />

            <Navbar onRegister={() => setShowModal(true)} />

            <main className="relative z-10">
              <Hero onRegister={() => setShowModal(true)} />
              <About />
              <Tracks />
              <Timeline />
              <Prizes />
              <Rules />
            </main>

            <Footer />

            <AnimatePresence>
              {showModal && <RegisterModal onClose={() => setShowModal(false)} />}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
