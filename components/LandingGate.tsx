'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ParticleField from './effects/ParticleField';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';
import { useMeetingStore } from '@/lib/store';
import { hashPassword } from '@/lib/auth';

export default function LandingGate() {
  const router = useRouter();
  const authenticate = useMeetingStore((s) => s.authenticate);
  const unlockSession = useMeetingStore((s) => s.unlockSession);
  const resetMeeting = useMeetingStore((s) => s.resetMeeting);
  const addToast = useMeetingStore((s) => s.addToast);
  const [secretaryName, setSecretaryName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetClicks, setResetClicks] = useState<number[]>([]);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetText, setResetText] = useState('');

  const verifyHash = async (input: string) => {
    const expectedHash = process.env.NEXT_PUBLIC_MEETING_PASSWORD_HASH;
    if (!expectedHash) return null;
    return (await hashPassword(input)) === expectedHash;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!secretaryName.trim()) {
      setError('Secretary name is required.');
      return;
    }

    const trimmedName = secretaryName.trim();
    const hashResult = await verifyHash(password);
    const ok = hashResult ?? authenticate(password, trimmedName);

    if (!ok) {
      setError('That password did not open the meeting cockpit.');
      return;
    }

    if (hashResult) {
      unlockSession(trimmedName);
    }

    addToast('Session opened', 'teal');
    router.push('/meeting');
  };

  const handleWordmarkClick = () => {
    const now = Date.now();
    const recent = [...resetClicks.filter((t) => now - t < 1500), now];
    setResetClicks(recent);
    if (recent.length >= 3) {
      setResetClicks([]);
      setResetOpen(true);
    }
  };

  const confirmReset = () => {
    if (resetText !== 'RESET') return;
    resetMeeting();
    setResetText('');
    setResetOpen(false);
    addToast('Meeting data reset', 'orange');
  };

  return (
    <main style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}>
      <ParticleField count={96} />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100dvh',
          display: 'grid',
          placeItems: 'center',
          padding: '32px 18px',
        }}
      >
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          style={{
            width: 'min(480px, 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px',
            textAlign: 'center',
          }}
        >
          <motion.button
            type="button"
            onClick={handleWordmarkClick}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            style={{
              border: 0,
              background: 'transparent',
              color: 'var(--teal)',
              fontFamily: '"Outfit", sans-serif',
              fontSize: 'clamp(2.5rem, 10vw, 5.2rem)',
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: 0,
              cursor: 'pointer',
              textShadow: '0 0 36px rgba(49,214,196,0.16)',
            }}
            aria-label="Ohana Recovery"
          >
            Ohana Recovery
          </motion.button>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem' }}
          >
            Core Organizational Planning Meeting
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            style={{
              width: '100%',
              marginTop: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              padding: '22px',
              border: '1px solid var(--line)',
              borderRadius: '18px',
              background: 'linear-gradient(180deg, rgba(16,22,26,0.86), rgba(7,9,11,0.72))',
              boxShadow: 'var(--shadow-ambient)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <Input
              label="Secretary Name"
              value={secretaryName}
              onChange={(e) => setSecretaryName(e.target.value)}
              fullWidth
              autoComplete="name"
              placeholder="Name attached to minutes"
            />
            <Input
              label="Meeting Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              autoComplete="current-password"
              placeholder="Enter session password"
            />
            {error && (
              <div style={{ color: 'var(--danger)', fontSize: '0.86rem', textAlign: 'left' }}>
                {error}
              </div>
            )}
            <Button type="submit" size="lg" fullWidth disabled={!secretaryName.trim() || !password}>
              Begin Session
            </Button>
          </motion.div>
        </motion.form>
      </div>

      <Modal isOpen={resetOpen} onClose={() => setResetOpen(false)} title="Emergency Reset">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            This will clear all meeting data and reset the session. This cannot be undone. Type RESET to confirm.
          </p>
          <Input
            value={resetText}
            onChange={(e) => setResetText(e.target.value)}
            fullWidth
            placeholder="RESET"
          />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setResetOpen(false)}>Cancel</Button>
            <Button variant="danger" disabled={resetText !== 'RESET'} onClick={confirmReset}>Clear Data</Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
