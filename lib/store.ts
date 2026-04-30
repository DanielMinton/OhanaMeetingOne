'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  Attendee, Motion, ActionItem, Decision,
  SectionTimer, RoleAssignment, BudgetItem,
  DocumentItem, AccessItem, WebPriority, AgendaItem,
} from './types';
import { SECTIONS } from './types';
import { getMeetingPassword } from './auth';

const DEFAULT_AGENDA_ITEMS: AgendaItem[] = [
  { id: uuidv4(), text: 'Call to Order', included: true },
  { id: uuidv4(), text: 'Attendance', included: true },
  { id: uuidv4(), text: 'Adoption of Agenda', included: true },
  { id: uuidv4(), text: 'Current Status Reports', included: true },
  { id: uuidv4(), text: 'Role and Title Discussion', included: true },
  { id: uuidv4(), text: 'Meeting Schedule', included: true },
  { id: uuidv4(), text: 'Mission Statement', included: true },
  { id: uuidv4(), text: 'Budget and Donations', included: true },
  { id: uuidv4(), text: 'Website and Digital Infrastructure', included: true },
  { id: uuidv4(), text: 'Media, Interviews, and Outreach', included: true },
  { id: uuidv4(), text: 'Documents and SOPs', included: true },
  { id: uuidv4(), text: 'Public Representation and Access', included: true },
  { id: uuidv4(), text: 'Action Items and Next Steps', included: true },
  { id: uuidv4(), text: 'Adjournment', included: true },
];

const DEFAULT_ATTENDEES: Attendee[] = [
  { id: uuidv4(), name: 'Daniel Minton', email: 'daniel@ohanarecovery.org', present: false, role: 'Founder / Executive Lead', isCore: true },
  { id: uuidv4(), name: 'Joseph Carr', email: 'joey@ohanarecovery.org', present: false, role: 'Chair', isCore: true },
  { id: uuidv4(), name: 'Jonni Coffer', email: 'jonni@ohanarecovery.org', present: false, role: 'Secretary', isCore: true },
  { id: uuidv4(), name: 'Anne Dekun', email: 'anne@ohanarecovery.org', present: false, role: 'Treasurer', isCore: true },
];

function emailFromName(name: string) {
  const firstName = name.trim().split(/\s+/)[0]?.toLowerCase();
  return firstName ? `${firstName}@ohanarecovery.org` : '';
}

const DEFAULT_ROLES: RoleAssignment[] = [
  { id: uuidv4(), role: 'Founder / Executive Lead', candidate: 'Daniel Minton', status: 'confirmed', notes: '' },
  { id: uuidv4(), role: 'Chair or President', candidate: 'Joseph Carr', status: 'provisional', notes: '' },
  { id: uuidv4(), role: 'Secretary / Documentation Lead', candidate: 'Jonni Coffer', status: 'provisional', notes: '' },
  { id: uuidv4(), role: 'Treasurer / Finance Lead', candidate: 'Anne Dekun', status: 'provisional', notes: '' },
  { id: uuidv4(), role: 'Meeting Operations Lead', candidate: '', status: 'vacant', notes: '' },
  { id: uuidv4(), role: 'Host Coordinator', candidate: '', status: 'vacant', notes: '' },
  { id: uuidv4(), role: 'Community Safety / Conduct Lead', candidate: '', status: 'vacant', notes: '' },
  { id: uuidv4(), role: 'Web / Technology Lead', candidate: 'Daniel Minton', status: 'provisional', notes: '' },
  { id: uuidv4(), role: 'Media / Content Lead', candidate: '', status: 'vacant', notes: '' },
  { id: uuidv4(), role: 'Outreach / Partnerships Lead', candidate: '', status: 'vacant', notes: '' },
];

const DEFAULT_BUDGET: BudgetItem[] = [
  { id: uuidv4(), category: 'Website', tool: 'Domain, hosting, etc.', monthlyCost: 0, owner: '' },
  { id: uuidv4(), category: 'Meetings', tool: 'Zoom or equivalent', monthlyCost: 0, owner: '' },
  { id: uuidv4(), category: 'Productivity', tool: 'M365 or equivalent', monthlyCost: 0, owner: '' },
  { id: uuidv4(), category: 'Design', tool: 'Canva, Adobe, etc.', monthlyCost: 0, owner: '' },
  { id: uuidv4(), category: 'Outreach', tool: 'Flyers, ads, events', monthlyCost: 0, owner: '' },
  { id: uuidv4(), category: 'Legal / Formation', tool: 'Filing fees, legal', monthlyCost: 0, owner: '' },
  { id: uuidv4(), category: 'Accounting', tool: 'Bookkeeping, tax', monthlyCost: 0, owner: '' },
  { id: uuidv4(), category: 'Other', tool: 'Miscellaneous', monthlyCost: 0, owner: '' },
];

const DEFAULT_DOCUMENTS: DocumentItem[] = [
  { id: uuidv4(), name: 'Mission Statement', priority: 'high', owner: '', status: 'not-started' },
  { id: uuidv4(), name: 'Role Descriptions', priority: 'high', owner: '', status: 'not-started' },
  { id: uuidv4(), name: 'Host Script', priority: 'high', owner: '', status: 'not-started' },
  { id: uuidv4(), name: 'Meeting SOP', priority: 'high', owner: '', status: 'not-started' },
  { id: uuidv4(), name: 'Budget Worksheet', priority: 'medium', owner: '', status: 'not-started' },
  { id: uuidv4(), name: 'Donation Handling Policy', priority: 'medium', owner: '', status: 'not-started' },
  { id: uuidv4(), name: 'Access Inventory', priority: 'medium', owner: '', status: 'not-started' },
  { id: uuidv4(), name: 'Public Representation Policy', priority: 'medium', owner: '', status: 'not-started' },
  { id: uuidv4(), name: 'Conflict of Interest Policy', priority: 'low', owner: '', status: 'not-started' },
  { id: uuidv4(), name: 'Articles / Bylaws Planning', priority: 'low', owner: '', status: 'not-started' },
];

const DEFAULT_ACCESS: AccessItem[] = [
  { id: uuidv4(), system: 'Domain', owner: '', backup: '', accessLevel: 'admin', notes: '' },
  { id: uuidv4(), system: 'Website / Hosting', owner: '', backup: '', accessLevel: 'admin', notes: '' },
  { id: uuidv4(), system: 'Email', owner: '', backup: '', accessLevel: 'admin', notes: '' },
  { id: uuidv4(), system: 'Zoom', owner: '', backup: '', accessLevel: 'admin', notes: '' },
  { id: uuidv4(), system: 'Microsoft 365', owner: '', backup: '', accessLevel: 'admin', notes: '' },
  { id: uuidv4(), system: 'Social Media', owner: '', backup: '', accessLevel: 'admin', notes: '' },
  { id: uuidv4(), system: 'Donation Platform', owner: '', backup: '', accessLevel: 'admin', notes: '' },
];

const DEFAULT_WEB_PRIORITIES: WebPriority[] = [
  { id: uuidv4(), name: 'Meeting Schedule' },
  { id: uuidv4(), name: 'Mission Statement' },
  { id: uuidv4(), name: 'Resources' },
  { id: uuidv4(), name: 'Media' },
  { id: uuidv4(), name: 'Contact' },
  { id: uuidv4(), name: 'Community Features' },
];

const DEFAULT_ACTION_ITEMS: ActionItem[] = [
  { id: uuidv4(), text: 'Finalize and adopt mission statement', owner: 'All', dueDate: '', status: 'open', priority: 'high' },
  { id: uuidv4(), text: 'Draft role descriptions for all positions', owner: '', dueDate: '', status: 'open', priority: 'high' },
  { id: uuidv4(), text: 'Update website with meeting schedule', owner: '', dueDate: '', status: 'open', priority: 'high' },
  { id: uuidv4(), text: 'Research nonprofit formation options', owner: '', dueDate: '', status: 'open', priority: 'medium' },
  { id: uuidv4(), text: 'Set up donation platform', owner: '', dueDate: '', status: 'open', priority: 'medium' },
  { id: uuidv4(), text: 'Create host onboarding script', owner: '', dueDate: '', status: 'open', priority: 'high' },
  { id: uuidv4(), text: 'Document access inventory', owner: '', dueDate: '', status: 'open', priority: 'high' },
  { id: uuidv4(), text: 'Draft public representation policy', owner: '', dueDate: '', status: 'open', priority: 'medium' },
  { id: uuidv4(), text: 'Create conflict of interest policy', owner: '', dueDate: '', status: 'open', priority: 'low' },
  { id: uuidv4(), text: 'Identify backup hosts for coverage plan', owner: '', dueDate: '', status: 'open', priority: 'medium' },
  { id: uuidv4(), text: 'Research media consent form templates', owner: '', dueDate: '', status: 'open', priority: 'medium' },
  { id: uuidv4(), text: 'Establish budget tracking process', owner: '', dueDate: '', status: 'open', priority: 'medium' },
];

function buildDefaultTimers(): Record<string, SectionTimer> {
  return Object.fromEntries(
    SECTIONS.map((s) => [
      s.id,
      {
        totalSeconds: s.defaultMinutes * 60,
        remainingSeconds: s.defaultMinutes * 60,
        isRunning: false,
        isPaused: false,
        isExpired: false,
      },
    ])
  );
}

export interface Toast {
  id: string;
  message: string;
  type: 'teal' | 'orange' | 'muted' | 'danger';
}

interface MeetingState {
  // Auth
  isAuthenticated: boolean;
  secretaryName: string;
  sessionPassword: string;

  // Meeting metadata
  meetingId: string;
  meetingDate: string;
  meetingStartTime: string | null;
  meetingEndTime: string | null;
  meetingType: 'core-checkin' | 'organizational-planning' | 'formal-board';
  platform: string;
  nextMeetingDateTime: string;

  // Navigation
  currentSectionIndex: number;
  sectionTimers: Record<string, SectionTimer>;
  completedSections: string[];

  // Data
  attendees: Attendee[];
  agendaItems: AgendaItem[];
  agendaNotes: string;
  sectionNotes: Record<string, string>;
  motions: Motion[];
  actionItems: ActionItem[];
  decisions: Decision[];
  roles: RoleAssignment[];
  budgetItems: BudgetItem[];
  donationNotes: string;
  donationChecklist: Record<string, boolean>;
  documents: DocumentItem[];
  accessItems: AccessItem[];
  webPriorities: WebPriority[];
  webOwner: string;
  webReviewer: string;
  webNotes: string;
  scheduleNotes: string;
  scheduleChecklist: Record<string, boolean>;
  missionDraft: string;
  missionPreviousDrafts: string[];
  mediaChecklist: Record<string, boolean>;
  representationChecklist: Record<string, boolean>;
  statusReports: Record<string, { reporter: string; notes: string }>;

  // Completion
  isAdjourned: boolean;
  secretarySignature: string | null;
  chairSignature: string | null;
  minutesPassword: string;

  // UI
  toasts: Toast[];

  // Actions
  authenticate: (password: string, name: string) => boolean;
  unlockSession: (name: string) => void;
  logout: () => void;
  resetMeeting: () => void;

  setMeetingType: (type: MeetingState['meetingType']) => void;
  setPlatform: (platform: string) => void;
  callToOrder: () => void;
  setNextMeetingDateTime: (dt: string) => void;

  advanceSection: () => void;
  goToSection: (index: number) => void;
  completeSection: (id: string) => void;

  setTimerRunning: (id: string, running: boolean) => void;
  setPaused: (id: string, paused: boolean) => void;
  tickTimer: (id: string) => void;
  addTime: (id: string, seconds: number) => void;
  setTimerAllocation: (id: string, minutes: number) => void;

  setAttendeePresent: (id: string, present: boolean) => void;
  setAttendeeRole: (id: string, role: string) => void;
  setAttendeeEmail: (id: string, email: string) => void;
  addAttendee: () => void;
  removeAttendee: (id: string) => void;
  setAttendeeName: (id: string, name: string) => void;

  toggleAgendaItem: (id: string) => void;
  addAgendaItem: (text: string) => void;
  removeAgendaItem: (id: string) => void;
  setAgendaNotes: (notes: string) => void;

  setSectionNotes: (sectionId: string, notes: string) => void;

  setStatusReport: (area: string, field: 'reporter' | 'notes', value: string) => void;

  setRoleCandidate: (id: string, candidate: string) => void;
  setRoleStatus: (id: string, status: RoleAssignment['status']) => void;
  setRoleNotes: (id: string, notes: string) => void;
  addRole: () => void;

  setBudgetCost: (id: string, cost: number) => void;
  setBudgetOwner: (id: string, owner: string) => void;
  setDonationNotes: (notes: string) => void;
  toggleDonationCheck: (key: string) => void;

  setWebPriorities: (priorities: WebPriority[]) => void;
  setWebOwner: (owner: string) => void;
  setWebReviewer: (reviewer: string) => void;
  setWebNotes: (notes: string) => void;

  setScheduleNotes: (notes: string) => void;
  toggleScheduleCheck: (key: string) => void;

  setMissionDraft: (draft: string) => void;
  saveMissionDraft: () => void;

  toggleMediaCheck: (key: string) => void;

  setDocumentField: (id: string, field: keyof DocumentItem, value: string) => void;
  addDocument: (name: string) => void;

  setAccessField: (id: string, field: keyof AccessItem, value: string) => void;
  toggleRepresentationCheck: (key: string) => void;

  setActionField: (id: string, field: keyof ActionItem, value: string) => void;
  addActionItem: () => void;
  removeActionItem: (id: string) => void;

  addMotion: (motion: Omit<Motion, 'id' | 'timestamp' | 'sectionIndex'>) => void;

  adjourn: () => void;
  setSecretarySignature: (sig: string) => void;
  setChairSignature: (sig: string) => void;
  setMinutesPassword: (pw: string) => void;

  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const INITIAL_STATE = {
  isAuthenticated: false,
  secretaryName: '',
  sessionPassword: '',
  meetingId: uuidv4(),
  meetingDate: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  meetingStartTime: null,
  meetingEndTime: null,
  meetingType: 'organizational-planning' as const,
  platform: 'Zoom',
  nextMeetingDateTime: '',
  currentSectionIndex: 0,
  sectionTimers: buildDefaultTimers(),
  completedSections: [] as string[],
  attendees: DEFAULT_ATTENDEES,
  agendaItems: DEFAULT_AGENDA_ITEMS,
  agendaNotes: '',
  sectionNotes: {} as Record<string, string>,
  motions: [] as Motion[],
  actionItems: DEFAULT_ACTION_ITEMS,
  decisions: [] as Decision[],
  roles: DEFAULT_ROLES,
  budgetItems: DEFAULT_BUDGET,
  donationNotes: '',
  donationChecklist: {} as Record<string, boolean>,
  documents: DEFAULT_DOCUMENTS,
  accessItems: DEFAULT_ACCESS,
  webPriorities: DEFAULT_WEB_PRIORITIES,
  webOwner: '',
  webReviewer: '',
  webNotes: '',
  scheduleNotes: '',
  scheduleChecklist: {} as Record<string, boolean>,
  missionDraft: '',
  missionPreviousDrafts: [] as string[],
  mediaChecklist: {} as Record<string, boolean>,
  representationChecklist: {} as Record<string, boolean>,
  statusReports: {} as Record<string, { reporter: string; notes: string }>,
  isAdjourned: false,
  secretarySignature: null as string | null,
  chairSignature: null as string | null,
  minutesPassword: '',
  toasts: [] as Toast[],
};

export const useMeetingStore = create<MeetingState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      authenticate: (password, name) => {
        const envPassword = getMeetingPassword();
        if (password === envPassword) {
          set({ isAuthenticated: true, secretaryName: name });
          return true;
        }
        return false;
      },

      unlockSession: (name) => set({ isAuthenticated: true, secretaryName: name }),

      logout: () => set({ isAuthenticated: false }),

      resetMeeting: () => {
        if (typeof window !== 'undefined') {
          sessionStorage.clear();
        }
        set({ ...INITIAL_STATE, meetingId: uuidv4(), sectionTimers: buildDefaultTimers() });
      },

      setMeetingType: (type) => set({ meetingType: type }),
      setPlatform: (platform) => set({ platform }),

      callToOrder: () => {
        const now = new Date();
        set({ meetingStartTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) });
      },

      setNextMeetingDateTime: (dt) => set({ nextMeetingDateTime: dt }),

      advanceSection: () => {
        const { currentSectionIndex, completedSections } = get();
        const current = SECTIONS[currentSectionIndex];
        if (current && !completedSections.includes(current.id)) {
          set({ completedSections: [...completedSections, current.id] });
        }
        if (currentSectionIndex < SECTIONS.length - 1) {
          set({ currentSectionIndex: currentSectionIndex + 1 });
        }
      },

      goToSection: (index) => set({ currentSectionIndex: index }),

      completeSection: (id) => {
        const { completedSections } = get();
        if (!completedSections.includes(id)) {
          set({ completedSections: [...completedSections, id] });
        }
        get().addToast('Section completed', 'teal');
      },

      setTimerRunning: (id, running) => {
        const { sectionTimers } = get();
        set({ sectionTimers: { ...sectionTimers, [id]: { ...sectionTimers[id], isRunning: running } } });
      },

      setPaused: (id, paused) => {
        const { sectionTimers } = get();
        set({ sectionTimers: { ...sectionTimers, [id]: { ...sectionTimers[id], isPaused: paused, isRunning: !paused } } });
      },

      tickTimer: (id) => {
        const { sectionTimers } = get();
        const timer = sectionTimers[id];
        if (!timer || !timer.isRunning || timer.isPaused) return;
        const remaining = Math.max(0, timer.remainingSeconds - 1);
        set({
          sectionTimers: {
            ...sectionTimers,
            [id]: { ...timer, remainingSeconds: remaining, isExpired: remaining === 0 },
          },
        });
      },

      addTime: (id, seconds) => {
        const { sectionTimers } = get();
        const timer = sectionTimers[id];
        set({
          sectionTimers: {
            ...sectionTimers,
            [id]: { ...timer, remainingSeconds: timer.remainingSeconds + seconds, isExpired: false },
          },
        });
      },

      setTimerAllocation: (id, minutes) => {
        const { sectionTimers } = get();
        const totalSeconds = minutes * 60;
        set({
          sectionTimers: {
            ...sectionTimers,
            [id]: { ...sectionTimers[id], totalSeconds, remainingSeconds: totalSeconds, isExpired: false },
          },
        });
      },

      setAttendeePresent: (id, present) => {
        set({ attendees: get().attendees.map((a) => (a.id === id ? { ...a, present } : a)) });
      },
      setAttendeeRole: (id, role) => {
        set({ attendees: get().attendees.map((a) => (a.id === id ? { ...a, role } : a)) });
      },
      setAttendeeEmail: (id, email) => {
        set({ attendees: get().attendees.map((a) => (a.id === id ? { ...a, email } : a)) });
      },
      setAttendeeName: (id, name) => {
        set({
          attendees: get().attendees.map((a) => (
            a.id === id ? { ...a, name, email: a.email || emailFromName(name) } : a
          )),
        });
      },
      addAttendee: () => {
        set({ attendees: [...get().attendees, { id: uuidv4(), name: '', email: '', present: true, role: '', isCore: false }] });
      },
      removeAttendee: (id) => {
        set({ attendees: get().attendees.filter((a) => a.id !== id) });
      },

      toggleAgendaItem: (id) => {
        set({ agendaItems: get().agendaItems.map((a) => (a.id === id ? { ...a, included: !a.included } : a)) });
      },
      addAgendaItem: (text) => {
        set({ agendaItems: [...get().agendaItems, { id: uuidv4(), text, included: true }] });
      },
      removeAgendaItem: (id) => {
        set({ agendaItems: get().agendaItems.filter((a) => a.id !== id) });
      },
      setAgendaNotes: (notes) => set({ agendaNotes: notes }),

      setSectionNotes: (sectionId, notes) => {
        set({ sectionNotes: { ...get().sectionNotes, [sectionId]: notes } });
      },

      setStatusReport: (area, field, value) => {
        const prev = get().statusReports[area] ?? { reporter: '', notes: '' };
        set({ statusReports: { ...get().statusReports, [area]: { ...prev, [field]: value } } });
      },

      setRoleCandidate: (id, candidate) => {
        set({ roles: get().roles.map((r) => (r.id === id ? { ...r, candidate } : r)) });
      },
      setRoleStatus: (id, status) => {
        set({ roles: get().roles.map((r) => (r.id === id ? { ...r, status } : r)) });
      },
      setRoleNotes: (id, notes) => {
        set({ roles: get().roles.map((r) => (r.id === id ? { ...r, notes } : r)) });
      },
      addRole: () => {
        set({ roles: [...get().roles, { id: uuidv4(), role: '', candidate: '', status: 'vacant', notes: '' }] });
      },

      setBudgetCost: (id, cost) => {
        set({ budgetItems: get().budgetItems.map((b) => (b.id === id ? { ...b, monthlyCost: cost } : b)) });
      },
      setBudgetOwner: (id, owner) => {
        set({ budgetItems: get().budgetItems.map((b) => (b.id === id ? { ...b, owner } : b)) });
      },
      setDonationNotes: (notes) => set({ donationNotes: notes }),
      toggleDonationCheck: (key) => {
        set({ donationChecklist: { ...get().donationChecklist, [key]: !get().donationChecklist[key] } });
      },

      setWebPriorities: (priorities) => set({ webPriorities: priorities }),
      setWebOwner: (owner) => set({ webOwner: owner }),
      setWebReviewer: (reviewer) => set({ webReviewer: reviewer }),
      setWebNotes: (notes) => set({ webNotes: notes }),

      setScheduleNotes: (notes) => set({ scheduleNotes: notes }),
      toggleScheduleCheck: (key) => {
        set({ scheduleChecklist: { ...get().scheduleChecklist, [key]: !get().scheduleChecklist[key] } });
      },

      setMissionDraft: (draft) => set({ missionDraft: draft }),
      saveMissionDraft: () => {
        const { missionDraft, missionPreviousDrafts } = get();
        if (missionDraft.trim()) {
          set({ missionPreviousDrafts: [...missionPreviousDrafts, missionDraft] });
        }
      },

      toggleMediaCheck: (key) => {
        set({ mediaChecklist: { ...get().mediaChecklist, [key]: !get().mediaChecklist[key] } });
      },

      setDocumentField: (id, field, value) => {
        set({ documents: get().documents.map((d) => (d.id === id ? { ...d, [field]: value } : d)) });
      },
      addDocument: (name) => {
        set({ documents: [...get().documents, { id: uuidv4(), name, priority: 'medium', owner: '', status: 'not-started' }] });
      },

      setAccessField: (id, field, value) => {
        set({ accessItems: get().accessItems.map((a) => (a.id === id ? { ...a, [field]: value } : a)) });
      },
      toggleRepresentationCheck: (key) => {
        set({ representationChecklist: { ...get().representationChecklist, [key]: !get().representationChecklist[key] } });
      },

      setActionField: (id, field, value) => {
        set({ actionItems: get().actionItems.map((a) => (a.id === id ? { ...a, [field]: value } : a)) });
      },
      addActionItem: () => {
        set({ actionItems: [...get().actionItems, { id: uuidv4(), text: '', owner: '', dueDate: '', status: 'open', priority: 'medium' }] });
      },
      removeActionItem: (id) => {
        set({ actionItems: get().actionItems.filter((a) => a.id !== id) });
      },

      addMotion: (motion) => {
        const newMotion: Motion = {
          ...motion,
          id: uuidv4(),
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          sectionIndex: get().currentSectionIndex,
        };
        set({ motions: [...get().motions, newMotion] });
        get().addToast('Motion recorded', 'orange');
      },

      adjourn: () => {
        const now = new Date();
        set({
          isAdjourned: true,
          meetingEndTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        });
      },
      setSecretarySignature: (sig) => set({ secretarySignature: sig }),
      setChairSignature: (sig) => set({ chairSignature: sig }),
      setMinutesPassword: (pw) => set({ minutesPassword: pw }),

      addToast: (message, type) => {
        const id = uuidv4();
        set({ toasts: [...get().toasts, { id, message, type }] });
        setTimeout(() => get().removeToast(id), 3000);
      },
      removeToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
    }),
    {
      name: 'ohana-meeting-state',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? sessionStorage : localStorage)),
      partialize: (state) => {
        const persisted: Partial<MeetingState> = { ...state };
        delete persisted.toasts;
        delete persisted.sessionPassword;
        return persisted;
      },
    }
  )
);
