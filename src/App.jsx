import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Preloader from './components/Preloader';
import CursorGlow from './components/CursorGlow';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal';
import AdminPage from './components/AdminPage';
import Chatbot from './components/Chatbot';
// import GameOThonLanding from './components/GameOThonLanding';

// Then render it in your App component


// Lazy load heavy sections — NOT Hero (must render first)
const ParticlesBackground = lazy(() => import('./components/ParticlesBackground'));
const About    = lazy(() => import('./components/About'));
const Tracks   = lazy(() => import('./components/Tracks'));
const Timeline = lazy(() => import('./components/Timeline'));
const Prizes   = lazy(() => import('./components/Prizes'));
const Rules    = lazy(() => import('./components/Rules'));

const isAdmin = window.location.pathname === '/admin';

export default function App() {
  const [loaded, setLoaded]       = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (isAdmin) return <AdminPage />;

  return (
    <>
      <Preloader onComplete={() => setLoaded(true)} />
      <CursorGlow />

      <AnimatePresence>
        {loaded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <Suspense fallback={null}><ParticlesBackground /></Suspense>
            <div className="fixed inset-0 z-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.15) 0%, transparent 60%)' }} />
{/* <GameOThonLanding />   */}
            <Navbar onRegister={() => setShowModal(true)} />

            <main className="relative z-10">
              <Hero onRegister={() => setShowModal(true)} />
              <Suspense fallback={null}>
                <About />
                <Tracks />
                <Timeline />
                <Prizes />
                <Rules />
              </Suspense>
            </main>

            <Footer />
            <Chatbot />

            <AnimatePresence>
              {showModal && <RegisterModal onClose={() => setShowModal(false)} />}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
