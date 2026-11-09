'use client';

import {
  Student,
  FeeHead,
  FeeStructure,
  Invoice,
  Payment,
  Adjustment,
  Refund,
  NotificationRecord,
  MessageTemplate,
  AcademicSession,
  ClassSection,
  UserAccount,
  AuditLog,
  SystemSettings,
  FeeAssignment,
} from '@/types';
import {
  INITIAL_SETTINGS,
  INITIAL_SESSIONS,
  INITIAL_FEE_HEADS,
  INITIAL_CLASSES,
  INITIAL_FEE_STRUCTURES,
  INITIAL_USERS,
  INITIAL_TEMPLATES,
  INITIAL_ADJUSTMENTS,
  INITIAL_REFUNDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  generate100Students,
  generateInitialInvoices,
  generateInitialPayments,
} from '@/lib/mock-data/initialData';

export interface AppState {
  settings: SystemSettings;
  sessions: AcademicSession[];
  activeSessionId: string;
  classes: ClassSection[];
  feeHeads: FeeHead[];
  feeStructures: FeeStructure[];
  feeAssignments: FeeAssignment[];
  students: Student[];
  invoices: Invoice[];
  payments: Payment[];
  adjustments: Adjustment[];
  refunds: Refund[];
  notifications: NotificationRecord[];
  templates: MessageTemplate[];
  users: UserAccount[];
  auditLogs: AuditLog[];
}

const STORAGE_KEY = 'jkc_fee_mgmt_state_v1';

export function getInitialState(): AppState {
  const students = generate100Students();
  const invoices = generateInitialInvoices(students);
  const payments = generateInitialPayments(students, invoices);

  return {
    settings: INITIAL_SETTINGS,
    sessions: INITIAL_SESSIONS,
    activeSessionId: 'ses-2026-27',
    classes: INITIAL_CLASSES,
    feeHeads: INITIAL_FEE_HEADS,
    feeStructures: INITIAL_FEE_STRUCTURES,
    feeAssignments: [
      {
        id: 'fa-1',
        title: 'Academic Session 2026-27 Annual Charges',
        type: 'Class',
        targetClass: '11th',
        academicSession: '2026–2027',
        assignedDate: '2026-04-05',
        affectedStudentsCount: 330,
        totalAssignedAmount: 1749000,
      },
    ],
    students,
    invoices,
    payments,
    adjustments: INITIAL_ADJUSTMENTS,
    refunds: INITIAL_REFUNDS,
    notifications: INITIAL_NOTIFICATIONS,
    templates: INITIAL_TEMPLATES,
    users: INITIAL_USERS,
    auditLogs: INITIAL_AUDIT_LOGS,
  };
}

export function loadStoredState(): AppState {
  if (typeof window === 'undefined') {
    return getInitialState();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialState();
      saveStoredState(initial);
      return initial;
    }
    return JSON.parse(raw) as AppState;
  } catch (e) {
    console.error('Failed to parse localStorage state:', e);
    return getInitialState();
  }
}

export function saveStoredState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
}

export function clearStoredState(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
