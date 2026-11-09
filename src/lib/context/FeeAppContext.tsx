'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Student,
  FeeStatus,
  FeeHead,
  FeeStructure,
  FeeAssignment,
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
  PaymentMethod,
} from '@/types';
import { AppState, getInitialState, loadStoredState, saveStoredState, clearStoredState } from '@/lib/storage/dataStore';

interface FeeAppContextType {
  state: AppState;
  isLoaded: boolean;
  activeSession: AcademicSession | undefined;
  // Students
  students: Student[];
  addStudent: (data: Omit<Student, 'id' | 'outstandingBalance' | 'overdueBalance' | 'advanceCredit' | 'feeStatus'> & { customAnnualCharge?: { title: string; reason: string; amount: number; dueDate: string } }) => Student;
  updateStudent: (id: string, data: Partial<Student>) => void;
  getStudentById: (id: string) => Student | undefined;
  // Fee Structures
  feeStructures: FeeStructure[];
  feeHeads: FeeHead[];
  addFeeStructure: (data: Omit<FeeStructure, 'id'>) => FeeStructure;
  updateFeeStructure: (id: string, data: Partial<FeeStructure>) => void;
  // Fee Assignments
  feeAssignments: FeeAssignment[];
  assignFees: (data: {
    title: string;
    type: 'Class' | 'Section' | 'Individual' | 'AnnualCharge';
    targetClass?: string;
    targetSection?: string;
    studentIds?: string[];
    feeStructureId?: string;
    customCharge?: {
      title: string;
      reason: string;
      amount: number;
      dueDate: string;
      academicSession: string;
    };
    academicSession: string;
  }) => { affectedCount: number; totalAmount: number };
  // Invoices
  invoices: Invoice[];
  bulkGenerateInvoices: (params: {
    academicSession: string;
    billingPeriod: string;
    classes: string[];
    dueDate: string;
  }) => { generatedCount: number; duplicateCount: number };
  getInvoiceById: (id: string) => Invoice | undefined;
  // Payments
  payments: Payment[];
  recordPayment: (params: {
    studentId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    referenceNumber?: string;
    chequeDetails?: { chequeNumber: string; bankName: string; expectedClearingDate: string };
    allocatedInvoiceIds: string[];
    notes?: string;
    recordedBy?: string;
  }) => Payment;
  reversePayment: (paymentId: string, reason: string) => void;
  // Adjustments & Refunds
  adjustments: Adjustment[];
  addAdjustment: (data: Omit<Adjustment, 'id' | 'status' | 'date'>) => Adjustment;
  updateAdjustmentStatus: (id: string, status: 'Approved' | 'Rejected', approverName?: string) => void;
  refunds: Refund[];
  processRefund: (data: Omit<Refund, 'id' | 'date' | 'status' | 'processedBy'>) => Refund;
  // Notifications
  notifications: NotificationRecord[];
  templates: MessageTemplate[];
  simulateWhatsAppBatch: (params: {
    recipientStudentIds: string[];
    templateCategory: string;
    customMessageBody?: string;
  }) => { totalSent: number; delivered: number; failed: number };
  addTemplate: (data: Omit<MessageTemplate, 'id' | 'lastUpdated'>) => MessageTemplate;
  updateTemplate: (id: string, data: Partial<MessageTemplate>) => void;
  deleteTemplate: (id: string) => void;
  // System
  classes: ClassSection[];
  addClass: (className: string, sections: string[], feeStructureId: string) => void;
  sessions: AcademicSession[];
  addSession: (data: Omit<AcademicSession, 'id' | 'totalStudents'>) => AcademicSession;
  setActiveSession: (id: string) => void;
  users: UserAccount[];
  addUser: (data: Omit<UserAccount, 'id' | 'lastActive'>) => UserAccount;
  updateUser: (id: string, data: Partial<UserAccount>) => void;
  auditLogs: AuditLog[];
  settings: SystemSettings;
  updateSettings: (data: Partial<SystemSettings>) => void;
  resetDemoData: () => void;
}

const FeeAppContext = createContext<FeeAppContextType | undefined>(undefined);

export function FeeAppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(getInitialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const loaded = loadStoredState();
    setState(loaded);
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      saveStoredState(state);
    }
  }, [state, isLoaded]);

  const addAuditLog = (action: string, module: string, recordReference: string, description: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      user: 'Muhammad Rashid Minhas (Accountant)',
      action,
      module,
      recordReference,
      description,
    };
    return newLog;
  };

  const activeSession = state.sessions.find(s => s.id === state.activeSessionId) || state.sessions[0];

  // ==================== STUDENTS ====================
  const addStudent: FeeAppContextType['addStudent'] = (data) => {
    const newId = `std-${Date.now()}`;
    const initialTuition = data.monthlyTuition || 3500;
    const initialAnnual = data.initialAnnualCharges || (data.customAnnualCharge ? data.customAnnualCharge.amount : 0);
    const initialBalance = initialTuition + initialAnnual;

    const newStudent: Student = {
      ...data,
      id: newId,
      outstandingBalance: initialBalance,
      overdueBalance: 0,
      advanceCredit: 0,
      feeStatus: initialBalance > 0 ? 'Pending' : 'Paid',
      status: 'Active',
    };

    // Also automatically create an initial invoice for the student
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      studentId: newId,
      studentName: data.fullName,
      fatherName: data.fatherName,
      rollNumber: data.rollNumber,
      class: data.class,
      section: data.section,
      guardianPhone: data.guardianPhone,
      billingPeriod: 'November 2026',
      issueDate: '2026-11-01',
      dueDate: '2026-11-10',
      items: [
        { id: `item-1`, feeHeadName: 'Tuition Fee', amount: initialTuition, category: 'Tuition' },
        ...(initialAnnual > 0 ? [{ id: `item-2`, feeHeadName: data.customAnnualCharge?.title || 'Annual Charges', amount: initialAnnual, category: 'Annual' as const }] : []),
      ],
      subtotal: initialBalance,
      discountAmount: 0,
      lateFee: 0,
      previousBalance: 0,
      totalAmount: initialBalance,
      paidAmount: 0,
      remainingAmount: initialBalance,
      status: 'Unpaid',
      academicSession: data.academicSession || '2026–2027',
    };

    const log = addAuditLog(
      'Student Enrolled',
      'Students',
      data.admissionNumber,
      `Enrolled student ${data.fullName} (Roll: ${data.rollNumber}) in Class ${data.class}-${data.section}.`
    );

    setState(prev => ({
      ...prev,
      students: [newStudent, ...prev.students],
      invoices: [newInvoice, ...prev.invoices],
      auditLogs: [log, ...prev.auditLogs],
    }));

    return newStudent;
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setState(prev => {
      const updatedStudents = prev.students.map(s => (s.id === id ? { ...s, ...data } : s));
      const log = addAuditLog('Student Profile Updated', 'Students', id, `Updated student details for ${data.fullName || id}.`);
      return {
        ...prev,
        students: updatedStudents,
        auditLogs: [log, ...prev.auditLogs],
      };
    });
  };

  const getStudentById = (id: string) => {
    return state.students.find(s => s.id === id);
  };

  // ==================== FEE STRUCTURES ====================
  const addFeeStructure = (data: Omit<FeeStructure, 'id'>) => {
    const newStructure: FeeStructure = {
      ...data,
      id: `fs-${Date.now()}`,
    };
    const log = addAuditLog('Fee Structure Created', 'Fee Structures', newStructure.name, `Created fee structure ${newStructure.name} version ${newStructure.version}.`);
    setState(prev => ({
      ...prev,
      feeStructures: [newStructure, ...prev.feeStructures],
      auditLogs: [log, ...prev.auditLogs],
    }));
    return newStructure;
  };

  const updateFeeStructure = (id: string, data: Partial<FeeStructure>) => {
    setState(prev => {
      const updated = prev.feeStructures.map(fs => (fs.id === id ? { ...fs, ...data } : fs));
      const log = addAuditLog('Fee Structure Modified', 'Fee Structures', id, `Updated fee structure ${data.name || id}.`);
      return {
        ...prev,
        feeStructures: updated,
        auditLogs: [log, ...prev.auditLogs],
      };
    });
  };

  // ==================== FEE ASSIGNMENTS ====================
  const assignFees: FeeAppContextType['assignFees'] = (params) => {
    let affectedStudents = state.students;
    if (params.type === 'Class' && params.targetClass) {
      affectedStudents = state.students.filter(s => s.class === params.targetClass);
    } else if (params.type === 'Section' && params.targetClass && params.targetSection) {
      affectedStudents = state.students.filter(s => s.class === params.targetClass && s.section === params.targetSection);
    } else if (params.type === 'Individual' && params.studentIds) {
      affectedStudents = state.students.filter(s => params.studentIds!.includes(s.id));
    }

    const chargeAmount = params.customCharge ? params.customCharge.amount : 0;
    const totalAssignedAmount = chargeAmount * affectedStudents.length;

    const newAssignment: FeeAssignment = {
      id: `fa-${Date.now()}`,
      title: params.title,
      type: params.type,
      targetClass: params.targetClass,
      targetSection: params.targetSection,
      studentIds: params.studentIds,
      feeStructureId: params.feeStructureId,
      customCharge: params.customCharge,
      academicSession: params.academicSession,
      assignedDate: new Date().toISOString().slice(0, 10),
      affectedStudentsCount: affectedStudents.length,
      totalAssignedAmount,
    };

    // Update affected students' balances
    const studentIdSet = new Set(affectedStudents.map(s => s.id));
    const updatedStudents = state.students.map(s => {
      if (studentIdSet.has(s.id) && chargeAmount > 0) {
        const newBalance = s.outstandingBalance + chargeAmount;
        const newStatus: FeeStatus = newBalance > 0 ? (s.feeStatus === 'Overdue' ? 'Overdue' : 'Pending') : 'Paid';
        return {
          ...s,
          outstandingBalance: newBalance,
          feeStatus: newStatus,
        };
      }
      return s;
    });

    const log = addAuditLog(
      'Fee Assignment Executed',
      'Fee Assignments',
      params.title,
      `Assigned ${params.title} to ${affectedStudents.length} students. Total: Rs. ${totalAssignedAmount}.`
    );

    setState(prev => ({
      ...prev,
      feeAssignments: [newAssignment, ...prev.feeAssignments],
      students: updatedStudents,
      auditLogs: [log, ...prev.auditLogs],
    }));

    return { affectedCount: affectedStudents.length, totalAmount: totalAssignedAmount };
  };

  // ==================== INVOICES ====================
  const bulkGenerateInvoices: FeeAppContextType['bulkGenerateInvoices'] = ({
    academicSession,
    billingPeriod,
    classes: selectedClasses,
    dueDate,
  }) => {
    const existingKeys = new Set(
      state.invoices.map(inv => `${inv.studentId}_${inv.billingPeriod}`)
    );

    const eligibleStudents = state.students.filter(s =>
      selectedClasses.includes('All') || selectedClasses.includes(s.class)
    );

    const newInvoices: Invoice[] = [];
    let duplicateCount = 0;

    eligibleStudents.forEach(student => {
      const key = `${student.id}_${billingPeriod}`;
      if (existingKeys.has(key)) {
        duplicateCount++;
        return;
      }

      const tuition = student.monthlyTuition;
      const invNum = `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;

      newInvoices.push({
        id: `inv-${Date.now()}-${student.id}`,
        invoiceNumber: invNum,
        studentId: student.id,
        studentName: student.fullName,
        fatherName: student.fatherName,
        rollNumber: student.rollNumber,
        class: student.class,
        section: student.section,
        guardianPhone: student.guardianPhone,
        billingPeriod,
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate,
        items: [
          { id: `item-tui`, feeHeadName: 'Tuition Fee', amount: tuition, category: 'Tuition' },
        ],
        subtotal: tuition,
        discountAmount: 0,
        lateFee: 0,
        previousBalance: student.outstandingBalance,
        totalAmount: tuition,
        paidAmount: 0,
        remainingAmount: tuition,
        status: 'Unpaid',
        academicSession,
      });
    });

    // Update student balances
    const newStudentBalances = new Map(newInvoices.map(inv => [inv.studentId, inv.totalAmount]));
    const updatedStudents = state.students.map(s => {
      if (newStudentBalances.has(s.id)) {
        const added = newStudentBalances.get(s.id)!;
        const newBal = s.outstandingBalance + added;
        return {
          ...s,
          outstandingBalance: newBal,
          feeStatus: 'Pending' as FeeStatus,
        };
      }
      return s;
    });

    const log = addAuditLog(
      'Bulk Invoices Generated',
      'Invoices',
      billingPeriod,
      `Generated ${newInvoices.length} invoices for ${billingPeriod}. (${duplicateCount} skipped duplicates).`
    );

    setState(prev => ({
      ...prev,
      invoices: [...newInvoices, ...prev.invoices],
      students: updatedStudents,
      auditLogs: [log, ...prev.auditLogs],
    }));

    return { generatedCount: newInvoices.length, duplicateCount };
  };

  const getInvoiceById = (id: string) => {
    return state.invoices.find(inv => inv.id === id);
  };

  // ==================== PAYMENTS ====================
  const recordPayment: FeeAppContextType['recordPayment'] = (params) => {
    const student = state.students.find(s => s.id === params.studentId);
    if (!student) throw new Error('Student not found');

    const receiptNum = `REC-2026-${Math.floor(20000 + Math.random() * 80000)}`;
    let remainingPaymentToAllocate = params.amount;

    const allocations: Array<{ invoiceId: string; invoiceNumber: string; allocatedAmount: number }> = [];

    // Allocate across selected invoices
    const targetInvoices = state.invoices.filter(inv =>
      params.allocatedInvoiceIds.includes(inv.id) && inv.remainingAmount > 0
    );

    const updatedInvoices = state.invoices.map(inv => {
      if (params.allocatedInvoiceIds.includes(inv.id) && remainingPaymentToAllocate > 0) {
        const toPay = Math.min(inv.remainingAmount, remainingPaymentToAllocate);
        remainingPaymentToAllocate -= toPay;
        allocations.push({
          invoiceId: inv.id,
          invoiceNumber: inv.invoiceNumber,
          allocatedAmount: toPay,
        });

        const newPaid = inv.paidAmount + toPay;
        const newRemaining = Math.max(0, inv.totalAmount - newPaid);
        const newStatus = newRemaining === 0 ? 'Paid' : 'Partially Paid';

        return {
          ...inv,
          paidAmount: newPaid,
          remainingAmount: newRemaining,
          status: newStatus as Invoice['status'],
        };
      }
      return inv;
    });

    // Update student's balances
    const newStudentOutstanding = Math.max(0, student.outstandingBalance - params.amount);
    const newOverdue = Math.max(0, student.overdueBalance - params.amount);
    const excessCredit = remainingPaymentToAllocate > 0 ? remainingPaymentToAllocate : 0;
    const newAdvanceCredit = student.advanceCredit + excessCredit;

    const updatedStudents = state.students.map(s => {
      if (s.id === student.id) {
        return {
          ...s,
          outstandingBalance: newStudentOutstanding,
          overdueBalance: newOverdue,
          advanceCredit: newAdvanceCredit,
          feeStatus: newStudentOutstanding === 0 ? ('Paid' as const) : newOverdue > 0 ? ('Overdue' as const) : ('Pending' as const),
        };
      }
      return s;
    });

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      receiptNumber: receiptNum,
      paymentDate: new Date().toISOString().slice(0, 10),
      studentId: student.id,
      studentName: student.fullName,
      rollNumber: student.rollNumber,
      class: student.class,
      section: student.section,
      amount: params.amount,
      paymentMethod: params.paymentMethod,
      referenceNumber: params.referenceNumber,
      chequeDetails: params.chequeDetails,
      allocatedInvoices: allocations,
      notes: params.notes,
      recordedBy: params.recordedBy || 'Muhammad Rashid Minhas (Accountant)',
      status: 'Completed',
    };

    const log = addAuditLog(
      'Payment Recorded',
      'Fee Collection',
      receiptNum,
      `Recorded ${params.paymentMethod} payment of Rs. ${params.amount.toLocaleString()} for ${student.fullName} (Roll: ${student.rollNumber}).`
    );

    setState(prev => ({
      ...prev,
      payments: [newPayment, ...prev.payments],
      invoices: updatedInvoices,
      students: updatedStudents,
      auditLogs: [log, ...prev.auditLogs],
    }));

    return newPayment;
  };

  const reversePayment = (paymentId: string, reason: string) => {
    const payment = state.payments.find(p => p.id === paymentId);
    if (!payment || payment.status === 'Reversed') return;

    // Rollback allocations on invoices
    const updatedInvoices = state.invoices.map(inv => {
      const alloc = payment.allocatedInvoices.find(a => a.invoiceId === inv.id);
      if (alloc) {
        const newPaid = Math.max(0, inv.paidAmount - alloc.allocatedAmount);
        const newRemaining = inv.totalAmount - newPaid;
        return {
          ...inv,
          paidAmount: newPaid,
          remainingAmount: newRemaining,
          status: (newPaid === 0 ? 'Unpaid' : 'Partially Paid') as Invoice['status'],
        };
      }
      return inv;
    });

    // Rollback student outstanding balance
    const updatedStudents = state.students.map(s => {
      if (s.id === payment.studentId) {
        const restoredBalance = s.outstandingBalance + payment.amount;
        return {
          ...s,
          outstandingBalance: restoredBalance,
          feeStatus: 'Pending' as const,
        };
      }
      return s;
    });

    const updatedPayments = state.payments.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'Reversed' as const,
          reversalReason: reason,
          reversedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          reversedBy: 'Muhammad Rashid Minhas (Accountant)',
        };
      }
      return p;
    });

    const log = addAuditLog(
      'Payment Reversed',
      'Payments',
      payment.receiptNumber,
      `Reversed payment ${payment.receiptNumber} of Rs. ${payment.amount}. Reason: ${reason}.`
    );

    setState(prev => ({
      ...prev,
      payments: updatedPayments,
      invoices: updatedInvoices,
      students: updatedStudents,
      auditLogs: [log, ...prev.auditLogs],
    }));
  };

  // ==================== ADJUSTMENTS & REFUNDS ====================
  const addAdjustment: FeeAppContextType['addAdjustment'] = (data) => {
    const newAdj: Adjustment = {
      ...data,
      id: `adj-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending Approval',
    };
    const log = addAuditLog('Adjustment Created', 'Adjustments', data.studentName, `Requested ${data.adjustmentType} of Rs. ${data.amount} for ${data.studentName}.`);
    setState(prev => ({
      ...prev,
      adjustments: [newAdj, ...prev.adjustments],
      auditLogs: [log, ...prev.auditLogs],
    }));
    return newAdj;
  };

  const updateAdjustmentStatus = (id: string, status: 'Approved' | 'Rejected', approverName = 'Dr. Tariq Mahmood (Principal)') => {
    const adj = state.adjustments.find(a => a.id === id);
    if (!adj) return;

    let updatedStudents = state.students;
    if (status === 'Approved') {
      updatedStudents = state.students.map(s => {
        if (s.id === adj.studentId) {
          const newBal = Math.max(0, s.outstandingBalance - adj.amount);
          return {
            ...s,
            outstandingBalance: newBal,
            feeStatus: newBal === 0 ? ('Paid' as const) : s.feeStatus,
          };
        }
        return s;
      });
    }

    const updatedAdjustments = state.adjustments.map(a =>
      a.id === id ? { ...a, status, approvedBy: approverName } : a
    );

    const log = addAuditLog(
      `Adjustment ${status}`,
      'Adjustments',
      adj.studentName,
      `${status} ${adj.adjustmentType} of Rs. ${adj.amount} for ${adj.studentName}.`
    );

    setState(prev => ({
      ...prev,
      adjustments: updatedAdjustments,
      students: updatedStudents,
      auditLogs: [log, ...prev.auditLogs],
    }));
  };

  const processRefund: FeeAppContextType['processRefund'] = (data) => {
    const newRef: Refund = {
      ...data,
      id: `ref-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'Processed',
      processedBy: 'Muhammad Rashid Minhas (Accountant)',
    };
    const log = addAuditLog('Refund Processed', 'Refunds', data.receiptNumber, `Processed refund of Rs. ${data.refundAmount} for ${data.studentName}.`);
    setState(prev => ({
      ...prev,
      refunds: [newRef, ...prev.refunds],
      auditLogs: [log, ...prev.auditLogs],
    }));
    return newRef;
  };

  // ==================== WHATSAPP NOTIFICATIONS ====================
  const simulateWhatsAppBatch: FeeAppContextType['simulateWhatsAppBatch'] = ({
    recipientStudentIds,
    templateCategory,
    customMessageBody,
  }) => {
    const targetStudents = state.students.filter(s =>
      recipientStudentIds.includes(s.id) && s.outstandingBalance > 0
    );

    const newNotifications: NotificationRecord[] = [];
    let delivered = 0;
    let failed = 0;

    targetStudents.forEach((student, idx) => {
      // Simulate realistic delivery: 90% delivered, 10% failed
      const isFailed = (idx + 1) % 9 === 0;
      const status = isFailed ? 'Failed' : 'Delivered';
      if (status === 'Delivered') delivered++;
      else failed++;

      const body = customMessageBody
        ? customMessageBody
            .replace(/\{\{student_name\}\}/g, student.fullName)
            .replace(/\{\{parent_name\}\}/g, student.fatherName)
            .replace(/\{\{class\}\}/g, student.class)
            .replace(/\{\{section\}\}/g, student.section)
            .replace(/\{\{roll_number\}\}/g, student.rollNumber)
            .replace(/\{\{amount\}\}/g, `Rs. ${student.outstandingBalance.toLocaleString()}`)
            .replace(/\{\{balance\}\}/g, `Rs. ${student.outstandingBalance.toLocaleString()}`)
            .replace(/\{\{due_date\}\}/g, '10 Nov 2026')
            .replace(/\{\{college_name\}\}/g, state.settings.collegeName)
        : `Respected ${student.fatherName}, the fee balance for ${student.fullName} is Rs. ${student.outstandingBalance.toLocaleString()}. Please clear dues at your earliest. ${state.settings.collegeName}.`;

      newNotifications.push({
        id: `notif-${Date.now()}-${idx}`,
        studentId: student.id,
        studentName: student.fullName,
        guardianName: student.fatherName,
        whatsappNumber: student.guardianPhone,
        class: student.class,
        rollNumber: student.rollNumber,
        outstandingAmount: student.outstandingBalance,
        daysOverdue: student.feeStatus === 'Overdue' ? 14 : 0,
        lastReminderDate: new Date().toISOString().slice(0, 10),
        templateType: templateCategory,
        messageBody: body,
        sentAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: status as 'Delivered' | 'Failed',
        errorReason: isFailed ? 'Recipient WhatsApp unreachable / cellular timeout' : undefined,
      });
    });

    const log = addAuditLog(
      'WhatsApp Notifications Dispatched',
      'WhatsApp Notifications',
      `Batch-${Date.now()}`,
      `Simulated sending WhatsApp messages to ${targetStudents.length} recipients (${delivered} delivered, ${failed} failed).`
    );

    setState(prev => ({
      ...prev,
      notifications: [...newNotifications, ...prev.notifications],
      auditLogs: [log, ...prev.auditLogs],
    }));

    return { totalSent: targetStudents.length, delivered, failed };
  };

  const addTemplate = (data: Omit<MessageTemplate, 'id' | 'lastUpdated'>) => {
    const newTmpl: MessageTemplate = {
      ...data,
      id: `tmpl-${Date.now()}`,
      lastUpdated: new Date().toISOString().slice(0, 10),
    };
    setState(prev => ({
      ...prev,
      templates: [...prev.templates, newTmpl],
    }));
    return newTmpl;
  };

  const updateTemplate = (id: string, data: Partial<MessageTemplate>) => {
    setState(prev => ({
      ...prev,
      templates: prev.templates.map(t => (t.id === id ? { ...t, ...data, lastUpdated: new Date().toISOString().slice(0, 10) } : t)),
    }));
  };

  const deleteTemplate = (id: string) => {
    setState(prev => ({
      ...prev,
      templates: prev.templates.filter(t => t.id !== id),
    }));
  };

  // ==================== SYSTEM & SETTINGS ====================
  const addClass = (className: string, sections: string[], feeStructureId: string) => {
    const fs = state.feeStructures.find(f => f.id === feeStructureId);
    const newClass: ClassSection = {
      id: `cls-${Date.now()}`,
      className,
      sections,
      defaultFeeStructureId: feeStructureId,
      defaultFeeStructureName: fs?.name || 'Standard Structure',
      studentCount: 0,
    };
    setState(prev => ({ ...prev, classes: [...prev.classes, newClass] }));
  };

  const addSession = (data: Omit<AcademicSession, 'id' | 'totalStudents'>) => {
    const newSession: AcademicSession = {
      ...data,
      id: `ses-${Date.now()}`,
      totalStudents: 0,
    };
    setState(prev => ({ ...prev, sessions: [...prev.sessions, newSession] }));
    return newSession;
  };

  const setActiveSession = (id: string) => {
    setState(prev => ({
      ...prev,
      activeSessionId: id,
      sessions: prev.sessions.map(s => ({ ...s, isActive: s.id === id })),
    }));
  };

  const addUser = (data: Omit<UserAccount, 'id' | 'lastActive'>) => {
    const newUser: UserAccount = {
      ...data,
      id: `usr-${Date.now()}`,
      lastActive: 'Just now',
    };
    setState(prev => ({ ...prev, users: [...prev.users, newUser] }));
    return newUser;
  };

  const updateUser = (id: string, data: Partial<UserAccount>) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => (u.id === id ? { ...u, ...data } : u)),
    }));
  };

  const updateSettings = (data: Partial<SystemSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...data },
    }));
  };

  const resetDemoData = () => {
    clearStoredState();
    const fresh = getInitialState();
    setState(fresh);
  };

  return (
    <FeeAppContext.Provider
      value={{
        state,
        isLoaded,
        activeSession,
        students: state.students,
        addStudent,
        updateStudent,
        getStudentById,
        feeStructures: state.feeStructures,
        feeHeads: state.feeHeads,
        addFeeStructure,
        updateFeeStructure,
        feeAssignments: state.feeAssignments,
        assignFees,
        invoices: state.invoices,
        bulkGenerateInvoices,
        getInvoiceById,
        payments: state.payments,
        recordPayment,
        reversePayment,
        adjustments: state.adjustments,
        addAdjustment,
        updateAdjustmentStatus,
        refunds: state.refunds,
        processRefund,
        notifications: state.notifications,
        templates: state.templates,
        simulateWhatsAppBatch,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        classes: state.classes,
        addClass,
        sessions: state.sessions,
        addSession,
        setActiveSession,
        users: state.users,
        addUser,
        updateUser,
        auditLogs: state.auditLogs,
        settings: state.settings,
        updateSettings,
        resetDemoData,
      }}
    >
      {children}
    </FeeAppContext.Provider>
  );
}

export function useFeeApp() {
  const context = useContext(FeeAppContext);
  if (!context) {
    throw new Error('useFeeApp must be used within a FeeAppProvider');
  }
  return context;
}
