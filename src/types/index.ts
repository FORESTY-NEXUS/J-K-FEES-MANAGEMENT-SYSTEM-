export type FeeStatus = 'Paid' | 'Pending' | 'Overdue';
export type InvoiceStatus = 'Draft' | 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';
export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Online Payment' | 'Cheque' | 'Advance Credit';
export type Frequency = 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Annual' | 'One-Time';

export interface Student {
  id: string;
  admissionNumber: string;
  rollNumber: string;
  fullName: string;
  fatherName: string;
  guardianPhone: string;
  studentPhone: string;
  class: string;
  section: string;
  admissionDate: string;
  academicSession: string;
  monthlyTuition: number;
  initialAnnualCharges: number;
  outstandingBalance: number;
  overdueBalance: number;
  advanceCredit: number;
  feeStatus: FeeStatus;
  status: 'Active' | 'Inactive';
}

export interface FeeHeadItem {
  id: string;
  feeHeadId?: string;
  feeHeadName: string;
  amount: number;
  category: 'Tuition' | 'Annual' | 'Laboratory' | 'Sports' | 'Examination' | 'Admission' | 'Utility' | 'Other';
  frequency?: Frequency;
  isMandatory?: boolean;
}

export interface FeeHead {
  id: string;
  name: string;
  description: string;
  category: 'Tuition' | 'Annual' | 'Laboratory' | 'Sports' | 'Examination' | 'Admission' | 'Utility' | 'Other';
  defaultAmount: number;
  frequency: Frequency;
  isMandatory: boolean;
}

export interface FeeStructure {
  id: string;
  name: string;
  class: string;
  billingFrequency: Frequency;
  totalStandardFee: number;
  effectiveDate: string;
  academicSession: string;
  status: 'Active' | 'Draft' | 'Archived';
  version: string;
  feeHeads: Array<{
    feeHeadId: string;
    feeHeadName: string;
    amount: number;
    frequency: Frequency;
    isMandatory: boolean;
  }>;
}

export interface FeeAssignment {
  id: string;
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
  assignedDate: string;
  affectedStudentsCount: number;
  totalAssignedAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  rollNumber: string;
  class: string;
  section: string;
  guardianPhone: string;
  billingPeriod: string;
  issueDate: string;
  dueDate: string;
  items: FeeHeadItem[];
  subtotal: number;
  discountAmount: number;
  lateFee: number;
  previousBalance: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: InvoiceStatus;
  academicSession: string;
}

export interface PaymentAllocation {
  invoiceId: string;
  invoiceNumber: string;
  allocatedAmount: number;
}

export interface Payment {
  id: string;
  receiptNumber: string;
  paymentDate: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  class: string;
  section: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  chequeDetails?: {
    chequeNumber: string;
    bankName: string;
    expectedClearingDate: string;
  };
  allocatedInvoices: PaymentAllocation[];
  notes?: string;
  recordedBy: string;
  status: 'Completed' | 'Reversed';
  reversalReason?: string;
  reversedAt?: string;
  reversedBy?: string;
}

export interface Adjustment {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  class: string;
  adjustmentType: 'Merit Scholarship' | 'Sibling Discount' | 'Financial Assistance' | 'Special Concession' | 'Fee Waiver' | 'Manual Correction';
  amount: number;
  reason: string;
  applicableInvoiceId?: string;
  applicableInvoiceNumber?: string;
  date: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  approvedBy?: string;
}

export interface Refund {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  originalPaymentId: string;
  receiptNumber: string;
  refundAmount: number;
  refundReason: string;
  paymentMethod: PaymentMethod;
  date: string;
  status: 'Processed' | 'Pending' | 'Rejected';
  processedBy: string;
}

export interface NotificationRecord {
  id: string;
  studentId: string;
  studentName: string;
  guardianName: string;
  whatsappNumber: string;
  class: string;
  rollNumber: string;
  outstandingAmount: number;
  daysOverdue: number;
  lastReminderDate?: string;
  templateType: string;
  messageBody: string;
  sentAt: string;
  status: 'Delivered' | 'Queued' | 'Failed';
  errorReason?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: 'Fee Due Reminder' | 'Overdue Fee Reminder' | 'Payment Confirmation' | 'Upcoming Due Date' | 'General Announcement';
  body: string;
  isDefault: boolean;
  lastUpdated: string;
}

export interface AcademicSession {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isArchived: boolean;
  totalStudents: number;
}

export interface ClassSection {
  id: string;
  className: string;
  sections: string[];
  defaultFeeStructureId: string;
  defaultFeeStructureName: string;
  studentCount: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Principal' | 'Accountant' | 'Fee Collection Staff';
  status: 'Active' | 'Inactive';
  lastActive: string;
  permissions: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  recordReference: string;
  description: string;
}

export interface SystemSettings {
  collegeName: string;
  subtitle: string;
  logoUrl?: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  receiptFooter: string;
  defaultGracePeriodDays: number;
  defaultBillingCycle: 'Monthly' | 'Quarterly' | 'Annual';
  defaultDueDateDayOfMonth: number;
  lateFeePerDay: number;
  allowPartialPayment: boolean;
  allowAdvancePayment: boolean;
  invoicePrefix: string;
  receiptPrefix: string;
  challanLayout: 'Standard A4' | 'Compact 3-Part' | 'Single Copy';
  whatsappSenderName: string;
}
