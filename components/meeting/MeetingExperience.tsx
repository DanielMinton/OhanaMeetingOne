'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import ParticleField from '../effects/ParticleField';
import FloatingMotionFAB from './FloatingMotionFAB';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ToastContainer from '../ui/Toast';
import { useMeetingStore } from '@/lib/store';
import { SECTIONS } from '@/lib/types';

function SectionFallback() {
  return (
    <div style={{ padding: '48px', color: 'var(--text-muted)' }}>
      Loading section...
    </div>
  );
}

const SECTION_COMPONENTS = [
  dynamic(() => import('../sections/S01_CallToOrder'), { loading: SectionFallback }),
  dynamic(() => import('../sections/S02_Attendance'), { loading: SectionFallback }),
  dynamic(() => import('../sections/S03_AdoptAgenda'), { loading: SectionFallback }),
  dynamic(() => import('../sections/S04_StatusReports'), { loading: SectionFallback }),
  dynamic(() => import('../sections/S05_RolesAndTitles'), { loading: SectionFallback }),
  dynamic(() => import('../sections/S06_MeetingSchedule'), { loading: SectionFallback }),
  dynamic(() => import('../sections/S07_MissionStatement'), { loading: SectionFallback }),
  dynamic(() => import('../sections/S08_BudgetDonations'), { loading: SectionFallback }),
  dynamic(() => import('../sections/S09_WebsiteDigital'), { loading: SectionFallback }),
  dynamic(() => import('../sections/S10_MediaOutreach'), { loading: SectionFallback }),
  dynamic(() => import('../sections/S11_DocumentsSOPs'), { loading: SectionFallback }),
  dynamic(() => import('../sections/S12_RepresentationAccess'), { loading: SectionFallback }),
  dynamic(() => import('../sections/S13_ActionItems'), { loading: SectionFallback }),
  dynamic(() => import('../sections/S14_Adjournment'), { loading: SectionFallback }),
];

interface MeetingExperienceProps {
  initialSectionId?: string;
}

export default function MeetingExperience({ initialSectionId }: MeetingExperienceProps) {
  const router = useRouter();
  const isAuthenticated = useMeetingStore((s) => s.isAuthenticated);
  const currentSectionIndex = useMeetingStore((s) => s.currentSectionIndex);
  const goToSection = useMeetingStore((s) => s.goToSection);
  const currentSection = SECTIONS[currentSectionIndex] ?? SECTIONS[0];
  const ActiveSection = SECTION_COMPONENTS[currentSectionIndex] ?? SECTION_COMPONENTS[0];

  useEffect(() => {
    if (!isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!initialSectionId) return;
    const idx = SECTIONS.findIndex((section) => section.id === initialSectionId);
    if (idx >= 0) goToSection(idx);
  }, [initialSectionId, goToSection]);

  useEffect(() => {
    if (initialSectionId === currentSection.id) return;
    router.replace(`/meeting/${currentSection.id}`, { scroll: false });
  }, [currentSection.id, initialSectionId, router]);

  if (!isAuthenticated) {
    return (
      <main style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
        Opening secure session...
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}>
      <ParticleField count={58} />
      <div style={{ position: 'relative', zIndex: 1, height: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
          <div className="meeting-sidebar">
            <Sidebar />
          </div>
          <section style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <AnimatePresence mode="wait">
              <ActiveSection key={currentSection.id} />
            </AnimatePresence>
          </section>
        </div>
      </div>
      <FloatingMotionFAB />
      <ToastContainer />
    </main>
  );
}
