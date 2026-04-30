export interface Attendee {
  id: string;
  name: string;
  email: string;
  present: boolean;
  role: string;
  isCore: boolean;
}

export interface Motion {
  id: string;
  text: string;
  movedBy: string;
  secondedBy: string;
  result: 'carried' | 'failed' | 'tabled' | 'withdrawn';
  timestamp: string;
  sectionIndex: number;
}

export interface ActionItem {
  id: string;
  text: string;
  owner: string;
  dueDate: string;
  status: 'open' | 'in-progress' | 'complete' | 'tabled';
  priority: 'high' | 'medium' | 'low';
}

export interface Decision {
  id: string;
  text: string;
  timestamp: string;
  sectionIndex: number;
}

export interface SectionTimer {
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isExpired: boolean;
}

export interface RoleAssignment {
  id: string;
  role: string;
  candidate: string;
  status: 'confirmed' | 'provisional' | 'tabled' | 'vacant';
  notes: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  tool: string;
  monthlyCost: number;
  owner: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  owner: string;
  status: 'not-started' | 'in-progress' | 'draft-complete' | 'adopted';
}

export interface AccessItem {
  id: string;
  system: string;
  owner: string;
  backup: string;
  accessLevel: 'admin' | 'editor' | 'viewer' | 'none';
  notes: string;
}

export interface WebPriority {
  id: string;
  name: string;
}

export interface AgendaItem {
  id: string;
  text: string;
  included: boolean;
}

export const SECTIONS = [
  { id: 's01', title: 'Call to Order', defaultMinutes: 2 },
  { id: 's02', title: 'Attendance', defaultMinutes: 3 },
  { id: 's03', title: 'Adoption of Agenda', defaultMinutes: 2 },
  { id: 's04', title: 'Current Status Reports', defaultMinutes: 10 },
  { id: 's05', title: 'Role and Title Discussion', defaultMinutes: 12 },
  { id: 's06', title: 'Meeting Schedule', defaultMinutes: 8 },
  { id: 's07', title: 'Mission Statement', defaultMinutes: 10 },
  { id: 's08', title: 'Budget and Donations', defaultMinutes: 10 },
  { id: 's09', title: 'Website and Digital Infrastructure', defaultMinutes: 8 },
  { id: 's10', title: 'Media, Interviews, and Outreach', defaultMinutes: 8 },
  { id: 's11', title: 'Documents and SOPs', defaultMinutes: 8 },
  { id: 's12', title: 'Public Representation and Access', defaultMinutes: 6 },
  { id: 's13', title: 'Action Items', defaultMinutes: 8 },
  { id: 's14', title: 'Adjournment', defaultMinutes: 3 },
] as const;

export type SectionId = typeof SECTIONS[number]['id'];
