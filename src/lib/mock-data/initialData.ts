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
} from '@/types';

export const INITIAL_SETTINGS: SystemSettings = {
  collegeName: 'Jammu Kashmir College',
  subtitle: 'Fee Management System',
  address: 'Allama Iqbal Road, Mirpur, Azad Jammu & Kashmir',
  phone: '+92 5827 443210',
  email: 'info@jkcollege.edu.pk',
  website: 'www.jkcollege.edu.pk',
  receiptFooter: 'This is a computer-generated receipt from Jammu Kashmir College Fee Management System.',
  defaultGracePeriodDays: 10,
  defaultBillingCycle: 'Monthly',
  defaultDueDateDayOfMonth: 10,
  lateFeePerDay: 50,
  allowPartialPayment: true,
  allowAdvancePayment: true,
  invoicePrefix: 'INV-2026-',
  receiptPrefix: 'REC-2026-',
  challanLayout: 'Compact 3-Part',
  whatsappSenderName: 'JK College Finance Office',
};

export const INITIAL_SESSIONS: AcademicSession[] = [
  {
    id: 'ses-2026-27',
    name: '2026–2027',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    isActive: true,
    isArchived: false,
    totalStudents: 1250,
  },
  {
    id: 'ses-2025-26',
    name: '2025–2026',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    isActive: false,
    isArchived: true,
    totalStudents: 1180,
  },
  {
    id: 'ses-2024-25',
    name: '2024–2025',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    isActive: false,
    isArchived: true,
    totalStudents: 1120,
  },
];

export const INITIAL_FEE_HEADS: FeeHead[] = [
  { id: 'fh-1', name: 'Tuition Fee', description: 'Standard monthly instruction fee', category: 'Tuition', defaultAmount: 3500, frequency: 'Monthly', isMandatory: true },
  { id: 'fh-2', name: 'Sports Fund', description: 'Athletic facilities and tournaments', category: 'Sports', defaultAmount: 1000, frequency: 'Annual', isMandatory: true },
  { id: 'fh-3', name: 'Laboratory Fund', description: 'Science lab chemicals and apparatus', category: 'Laboratory', defaultAmount: 2000, frequency: 'Annual', isMandatory: false },
  { id: 'fh-4', name: 'Examination Charges', description: 'Term exams, printing and evaluation', category: 'Examination', defaultAmount: 1500, frequency: 'Annual', isMandatory: true },
  { id: 'fh-5', name: 'Computer Lab Fee', description: 'High-speed internet and workstation upkeep', category: 'Laboratory', defaultAmount: 1800, frequency: 'Annual', isMandatory: false },
  { id: 'fh-6', name: 'Library Fund', description: 'Book acquisitions and digital library access', category: 'Annual', defaultAmount: 800, frequency: 'Annual', isMandatory: true },
  { id: 'fh-7', name: 'Admission Fee', description: 'One-time registration and enrollment charge', category: 'Admission', defaultAmount: 5000, frequency: 'One-Time', isMandatory: true },
  { id: 'fh-8', name: 'Utility & Generator Fund', description: 'Power backup and generator fuel maintenance', category: 'Utility', defaultAmount: 1200, frequency: 'Annual', isMandatory: true },
  { id: 'fh-9', name: 'Late Fee Surcharge', description: 'Fine for payment after due date', category: 'Other', defaultAmount: 500, frequency: 'One-Time', isMandatory: false },
  { id: 'fh-10', name: 'Annual College Magazine', description: 'Publication and literary society', category: 'Annual', defaultAmount: 600, frequency: 'Annual', isMandatory: false },
];

export const INITIAL_CLASSES: ClassSection[] = [
  { id: 'cls-9', className: '9th', sections: ['A', 'B'], defaultFeeStructureId: 'fs-9', defaultFeeStructureName: '9th Standard Matric', studentCount: 310 },
  { id: 'cls-10', className: '10th', sections: ['A', 'B'], defaultFeeStructureId: 'fs-10', defaultFeeStructureName: '10th Standard Matric', studentCount: 290 },
  { id: 'cls-11', className: '11th', sections: ['A', 'B'], defaultFeeStructureId: 'fs-11-med', defaultFeeStructureName: '11th Pre-Medical F.Sc', studentCount: 330 },
  { id: 'cls-12', className: '12th', sections: ['A', 'B'], defaultFeeStructureId: 'fs-12-eng', defaultFeeStructureName: '12th Pre-Engineering F.Sc', studentCount: 320 },
];

export const INITIAL_FEE_STRUCTURES: FeeStructure[] = [
  {
    id: 'fs-9',
    name: '9th Standard Matric',
    class: '9th',
    billingFrequency: 'Monthly',
    totalStandardFee: 7500,
    effectiveDate: '2026-04-01',
    academicSession: '2026–2027',
    status: 'Active',
    version: 'v2.1',
    feeHeads: [
      { feeHeadId: 'fh-1', feeHeadName: 'Tuition Fee', amount: 3200, frequency: 'Monthly', isMandatory: true },
      { feeHeadId: 'fh-2', feeHeadName: 'Sports Fund', amount: 900, frequency: 'Annual', isMandatory: true },
      { feeHeadId: 'fh-4', feeHeadName: 'Examination Charges', amount: 1400, frequency: 'Annual', isMandatory: true },
      { feeHeadId: 'fh-6', feeHeadName: 'Library Fund', amount: 800, frequency: 'Annual', isMandatory: true },
      { feeHeadId: 'fh-8', feeHeadName: 'Utility & Generator Fund', amount: 1200, frequency: 'Annual', isMandatory: true },
    ],
  },
  {
    id: 'fs-10',
    name: '10th Standard Matric',
    class: '10th',
    billingFrequency: 'Monthly',
    totalStandardFee: 7800,
    effectiveDate: '2026-04-01',
    academicSession: '2026–2027',
    status: 'Active',
    version: 'v2.0',
    feeHeads: [
      { feeHeadId: 'fh-1', feeHeadName: 'Tuition Fee', amount: 3400, frequency: 'Monthly', isMandatory: true },
      { feeHeadId: 'fh-2', feeHeadName: 'Sports Fund', amount: 1000, frequency: 'Annual', isMandatory: true },
      { feeHeadId: 'fh-4', feeHeadName: 'Examination Charges', amount: 1500, frequency: 'Annual', isMandatory: true },
      { feeHeadId: 'fh-6', feeHeadName: 'Library Fund', amount: 700, frequency: 'Annual', isMandatory: true },
      { feeHeadId: 'fh-8', feeHeadName: 'Utility & Generator Fund', amount: 1200, frequency: 'Annual', isMandatory: true },
    ],
  },
  {
    id: 'fs-11-med',
    name: '11th Pre-Medical F.Sc',
    class: '11th',
    billingFrequency: 'Monthly',
    totalStandardFee: 8800,
    effectiveDate: '2026-04-01',
    academicSession: '2026–2027',
    status: 'Active',
    version: 'v3.0',
    feeHeads: [
      { feeHeadId: 'fh-1', feeHeadName: 'Tuition Fee', amount: 3500, frequency: 'Monthly', isMandatory: true },
      { feeHeadId: 'fh-2', feeHeadName: 'Sports Fund', amount: 1000, frequency: 'Annual', isMandatory: true },
      { feeHeadId: 'fh-3', feeHeadName: 'Laboratory Fund', amount: 2000, frequency: 'Annual', isMandatory: true },
      { feeHeadId: 'fh-4', feeHeadName: 'Examination Charges', amount: 1500, frequency: 'Annual', isMandatory: true },
      { feeHeadId: 'fh-8', feeHeadName: 'Utility & Generator Fund', amount: 800, frequency: 'Annual', isMandatory: true },
    ],
  },
  {
    id: 'fs-11-eng',
    name: '11th Pre-Engineering F.Sc',
    class: '11th',
    billingFrequency: 'Monthly',
    totalStandardFee: 8600,
    effectiveDate: '2026-04-01',
    academicSession: '2026–2027',
    status: 'Active',
    version: 'v2.2',
    feeHeads: [
      { feeHeadId: 'fh-1', feeHeadName: 'Tuition Fee', amount: 3500, frequency: 'Monthly', isMandatory: true },
      { feeHeadId: 'fh-2', feeHeadName: 'Sports Fund', amount: 1000, frequency: 'Annual', isMandatory: true },
      { feeHeadId: 'fh-3', feeHeadName: 'Laboratory Fund', amount: 1800, frequency: 'Annual', isMandatory: true },
      { feeHeadId: 'fh-4', feeHeadName: 'Examination Charges', amount: 1500, frequency: 'Annual', isMandatory: true },
      { feeHeadId: 'fh-8', feeHeadName: 'Utility & Generator Fund', amount: 800, frequency: 'Annual', isMandatory: true },
    ],
  },
  {
    id: 'fs-12-med',
    name: '12th Pre-Medical F.Sc',
    class: '12th',
    billingFrequency: 'Monthly',
    totalStandardFee: 9000,
    effectiveDate: '2026-04-01',
    academicSession: '2026–2027',
    status: 'Active',
    version: 'v3.1',
    feeHeads: [
      { feeHeadId: 'fh-1', feeHeadName: 'Tuition Fee', amount: 3700, frequency: 'Monthly', isMandatory: true },
      { feeHeadId: 'fh-2', feeHeadName: 'Sports Fund', amount: 1000, frequency: 'Annual', isMandatory: true },
      { feeHeadId: 'fh-3', feeHeadName: 'Laboratory Fund', amount: 2000, frequency: 'Annual', isMandatory: true },
      { feeHeadId: 'fh-4', feeHeadName: 'Examination Charges', amount: 1500, frequency: 'Annual', isMandatory: true },
      { feeHeadId: 'fh-8', feeHeadName: 'Utility & Generator Fund', amount: 800, frequency: 'Annual', isMandatory: true },
    ],
  },
  {
    id: 'fs-12-eng',
    name: '12th Pre-Engineering F.Sc',
    class: '12th',
    billingFrequency: 'Monthly',
    totalStandardFee: 8800,
    effectiveDate: '2026-04-01',
    academicSession: '2026–2027',
    status: 'Active',
    version: 'v2.4',
    feeHeads: [
      { feeHeadId: 'fh-1', feeHeadName: 'Tuition Fee', amount: 3700, frequency: 'Monthly', isMandatory: true },
      { feeHeadId: 'fh-2', feeHeadName: 'Sports Fund', amount: 1000, frequency: 'Annual', isMandatory: true },
      { feeHeadId: 'fh-3', feeHeadName: 'Laboratory Fund', amount: 1800, frequency: 'Annual', isMandatory: true },
      { feeHeadId: 'fh-4', feeHeadName: 'Examination Charges', amount: 1500, frequency: 'Annual', isMandatory: true },
      { feeHeadId: 'fh-8', feeHeadName: 'Utility & Generator Fund', amount: 800, frequency: 'Annual', isMandatory: true },
    ],
  },
];

export const INITIAL_USERS: UserAccount[] = [
  { id: 'usr-1', name: 'Dr. Tariq Mahmood', email: 'principal@jkcollege.edu.pk', role: 'Principal', status: 'Active', lastActive: '2026-11-09 18:20', permissions: ['All Modules', 'Discounts Approval', 'System Settings', 'Reports'] },
  { id: 'usr-2', name: 'Muhammad Rashid Minhas', email: 'rashid.accounts@jkcollege.edu.pk', role: 'Accountant', status: 'Active', lastActive: '2026-11-09 19:40', permissions: ['Fee Collection', 'Invoices', 'Payments', 'Adjustments', 'Reports', 'WhatsApp Reminders'] },
  { id: 'usr-3', name: 'Yasir Nawaz', email: 'yasir.cashier@jkcollege.edu.pk', role: 'Fee Collection Staff', status: 'Active', lastActive: '2026-11-09 17:15', permissions: ['Fee Collection', 'Receipts Printing', 'Search Accounts'] },
  { id: 'usr-4', name: 'Nasir Iqbal', email: 'nasir.staff@jkcollege.edu.pk', role: 'Fee Collection Staff', status: 'Inactive', lastActive: '2026-10-28 14:00', permissions: ['Fee Collection', 'Search Accounts'] },
];

export const INITIAL_TEMPLATES: MessageTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Standard Fee Due Reminder',
    category: 'Fee Due Reminder',
    body: 'Respected {{parent_name}}, fee for {{student_name}} (Class: {{class}}-{{section}}, Roll: {{roll_number}}) for the current billing cycle is Rs. {{amount}}. Due date is {{due_date}}. Kindly clear the dues before the deadline. Thank you, {{college_name}}.',
    isDefault: true,
    lastUpdated: '2026-11-01',
  },
  {
    id: 'tmpl-2',
    name: 'Urgent Overdue Notice',
    category: 'Overdue Fee Reminder',
    body: 'URGENT: Respected {{parent_name}}, the fee account for {{student_name}} (Roll No: {{roll_number}}, Class: {{class}}) has an overdue balance of Rs. {{balance}}. Please settle the outstanding fee immediately at the Accounts Office to avoid a late fee surcharge. {{college_name}} Accounts Office.',
    isDefault: true,
    lastUpdated: '2026-11-05',
  },
  {
    id: 'tmpl-3',
    name: 'Payment Confirmation Receipt',
    category: 'Payment Confirmation',
    body: 'Dear {{parent_name}}, payment of Rs. {{amount}} for {{student_name}} has been received with thanks. Remaining balance: Rs. {{balance}}. Receipt generated by {{college_name}}.',
    isDefault: true,
    lastUpdated: '2026-10-15',
  },
  {
    id: 'tmpl-4',
    name: 'Upcoming Due Date Alert',
    category: 'Upcoming Due Date',
    body: 'Dear {{parent_name}}, this is a friendly reminder that college tuition fee of Rs. {{amount}} for {{student_name}} is due on {{due_date}}. We appreciate your timely cooperation. {{college_name}}.',
    isDefault: false,
    lastUpdated: '2026-10-20',
  },
  {
    id: 'tmpl-5',
    name: 'General Fee Announcement',
    category: 'General Announcement',
    body: 'Notice from {{college_name}}: Fee counters are open Monday to Saturday, 8:30 AM to 2:00 PM. Parents may also pay through direct bank transfer to Allied Bank Account No. 0124-5541098. Please present deposit slip to Accounts.',
    isDefault: false,
    lastUpdated: '2026-09-30',
  },
];

// Helper to generate 100 realistic Pakistani student accounts
const FIRST_NAMES = [
  'Ahmed', 'Muhammad', 'Ali', 'Hamza', 'Usman', 'Ayesha', 'Fatima', 'Zainab', 'Bilal', 'Hassan',
  'Hussein', 'Omar', 'Saad', 'Daniyal', 'Mustafa', 'Maryam', 'Sana', 'Hira', 'Iqra', 'Khadija',
  'Zubair', 'Shahzaib', 'Faizan', 'Farhan', 'Shoaib', 'Asad', 'Waqas', 'Kamran', 'Tayyab', 'Rehan',
  'Nida', 'Anum', 'Mahnoor', 'Laiba', 'Areeba', 'Rabia', 'Mehwish', 'Samina', 'Sadia', 'Sobia',
  'Tariq', 'Junaid', 'Kashif', 'Arsalan', 'Adeel', 'Babar', 'Haris', 'Shaheen', 'Noman', 'Rizwan'
];

const LAST_NAMES = [
  'Khan', 'Abdullah', 'Raza', 'Shah', 'Ahmad', 'Noor', 'Ahmed', 'Malik', 'Chaudhry', 'Bhatti',
  'Mir', 'Dar', 'Qureshi', 'Abbasi', 'Butt', 'Siddiqui', 'Mughal', 'Gondal', 'Gillani', 'Wani',
  'Lone', 'Sheikh', 'Kayani', 'Baig', 'Awan', 'Kiani', 'Rathore', 'Ghafoor', 'Sultan', 'Akram'
];

const FATHERS_NAMES = [
  'Tariq Khan', 'Muhammad Abdullah', 'Rashid Raza', 'Syed Anwar Shah', 'Nadeem Ahmad', 'Khalid Noor',
  'Javed Ahmed', 'Abdul Malik', 'Muhammad Asif Chaudhry', 'Sajid Bhatti', 'Mushtaq Mir', 'Altaf Dar',
  'Zahid Qureshi', 'Iftikhar Abbasi', 'Pervaiz Butt', 'Mansoor Siddiqui', 'Naveed Mughal', 'Akhtar Gondal',
  'Syed Shafqat Gillani', 'Ghulam Hassan Wani', 'Ghulam Nabi Lone', 'Farooq Sheikh', 'Raja Zafar Kayani',
  'Mirza Tahir Baig', 'Malik Ashfaq Awan', 'Raja Masood Kiani', 'Chaudhry Sarwar', 'Shaukat Rathore'
];

export function generate100Students(): Student[] {
  const students: Student[] = [];
  const classes = ['9th', '10th', '11th', '12th'];
  const sections = ['A', 'B'];

  for (let i = 1; i <= 100; i++) {
    const fnIndex = (i * 7) % FIRST_NAMES.length;
    const lnIndex = (i * 11) % LAST_NAMES.length;
    const faIndex = (i * 3) % FATHERS_NAMES.length;

    const firstName = FIRST_NAMES[fnIndex];
    const lastName = LAST_NAMES[lnIndex];
    const fullName = `${firstName} ${lastName}`;
    const fatherName = FATHERS_NAMES[faIndex];

    const cls = classes[(i - 1) % classes.length];
    const sec = sections[Math.floor((i - 1) / 2) % sections.length];
    const rollNo = `${cls === '9th' ? '9' : cls === '10th' ? '10' : cls === '11th' ? '11' : '12'}${sec}-${String(100 + ((i * 3) % 89)).padStart(3, '0')}`;
    const admNo = `JKC-2026-${String(1000 + i).padStart(4, '0')}`;

    // Status distribution: ~68% Paid, ~19% Pending, ~13% Overdue
    let feeStatus: 'Paid' | 'Pending' | 'Overdue' = 'Paid';
    let outstandingBalance = 0;
    let overdueBalance = 0;
    let advanceCredit = 0;

    if (i % 8 === 0 || i % 13 === 0) {
      feeStatus = 'Overdue';
      overdueBalance = [3500, 7000, 8800, 10500, 14000][(i * 5) % 5];
      outstandingBalance = overdueBalance;
    } else if (i % 4 === 0) {
      feeStatus = 'Pending';
      outstandingBalance = [3200, 3500, 4200, 7000][(i * 3) % 4];
    } else if (i % 9 === 0) {
      advanceCredit = 1500;
    }

    const monthlyTuition = cls === '9th' ? 3200 : cls === '10th' ? 3400 : 3500;
    const initialAnnualCharges = cls.startsWith('11') || cls.startsWith('12') ? 5300 : 4300;

    const phoneMiddle = String(1000000 + ((i * 84627) % 8999999)).slice(0, 7);
    const guardianPhone = `+92 3${(i % 5 === 0 ? '00' : i % 5 === 1 ? '21' : i % 5 === 2 ? '33' : i % 5 === 3 ? '45' : '12')} ${phoneMiddle}`;
    const studentPhone = `+92 3${(i % 5 === 0 ? '01' : i % 5 === 1 ? '22' : i % 5 === 2 ? '34' : i % 5 === 3 ? '46' : '13')} ${phoneMiddle}`;

    students.push({
      id: `std-${i}`,
      admissionNumber: admNo,
      rollNumber: rollNo,
      fullName,
      fatherName,
      guardianPhone,
      studentPhone,
      class: cls,
      section: sec,
      admissionDate: `2026-04-${String(1 + (i % 20)).padStart(2, '0')}`,
      academicSession: '2026–2027',
      monthlyTuition,
      initialAnnualCharges,
      outstandingBalance,
      overdueBalance,
      advanceCredit,
      feeStatus,
      status: 'Active',
    });
  }

  return students;
}

export function generateInitialInvoices(students: Student[]): Invoice[] {
  const invoices: Invoice[] = [];
  let invCount = 1001;

  students.forEach((student, idx) => {
    // Generate an invoice for current month (November 2026)
    const baseAmount = student.monthlyTuition;
    let paid = 0;
    let remaining = baseAmount;
    let status: 'Draft' | 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled' = 'Paid';

    if (student.feeStatus === 'Paid') {
      paid = baseAmount;
      remaining = 0;
      status = 'Paid';
    } else if (student.feeStatus === 'Pending') {
      if (idx % 2 === 0) {
        paid = Math.floor(baseAmount / 2);
        remaining = baseAmount - paid;
        status = 'Partially Paid';
      } else {
        paid = 0;
        remaining = baseAmount;
        status = 'Unpaid';
      }
    } else if (student.feeStatus === 'Overdue') {
      paid = 0;
      remaining = student.overdueBalance || baseAmount;
      status = 'Overdue';
    }

    invoices.push({
      id: `inv-${invCount}`,
      invoiceNumber: `INV-2026-${String(invCount).padStart(5, '0')}`,
      studentId: student.id,
      studentName: student.fullName,
      fatherName: student.fatherName,
      rollNumber: student.rollNumber,
      class: student.class,
      section: student.section,
      guardianPhone: student.guardianPhone,
      billingPeriod: 'November 2026',
      issueDate: '2026-11-01',
      dueDate: '2026-11-10',
      items: [
        { id: `item-${invCount}-1`, feeHeadName: 'Tuition Fee', amount: baseAmount, category: 'Tuition' },
      ],
      subtotal: baseAmount,
      discountAmount: 0,
      lateFee: status === 'Overdue' ? 500 : 0,
      previousBalance: status === 'Overdue' ? remaining - baseAmount : 0,
      totalAmount: status === 'Overdue' ? remaining + 500 : baseAmount,
      paidAmount: paid,
      remainingAmount: remaining,
      status,
      academicSession: '2026–2027',
    });

    invCount++;

    // For overdue students, also add an October 2026 invoice that was unpaid
    if (student.feeStatus === 'Overdue') {
      invoices.push({
        id: `inv-${invCount}`,
        invoiceNumber: `INV-2026-${String(invCount).padStart(5, '0')}`,
        studentId: student.id,
        studentName: student.fullName,
        fatherName: student.fatherName,
        rollNumber: student.rollNumber,
        class: student.class,
        section: student.section,
        guardianPhone: student.guardianPhone,
        billingPeriod: 'October 2026',
        issueDate: '2026-10-01',
        dueDate: '2026-10-10',
        items: [
          { id: `item-${invCount}-1`, feeHeadName: 'Tuition Fee', amount: baseAmount, category: 'Tuition' },
        ],
        subtotal: baseAmount,
        discountAmount: 0,
        lateFee: 500,
        previousBalance: 0,
        totalAmount: baseAmount + 500,
        paidAmount: 0,
        remainingAmount: baseAmount + 500,
        status: 'Overdue',
        academicSession: '2026–2027',
      });
      invCount++;
    }
  });

  return invoices;
}

export function generateInitialPayments(students: Student[], invoices: Invoice[]): Payment[] {
  const payments: Payment[] = [];
  let recCount = 2001;

  // Generate payments for paid or partially paid invoices
  invoices.filter(inv => inv.paidAmount > 0).forEach((inv) => {
    const student = students.find(s => s.id === inv.studentId);
    if (!student) return;

    const methods: Array<'Cash' | 'Bank Transfer' | 'Online Payment' | 'Cheque'> = ['Cash', 'Bank Transfer', 'Online Payment', 'Cheque'];
    const method = methods[recCount % methods.length];

    payments.push({
      id: `pay-${recCount}`,
      receiptNumber: `REC-2026-${String(recCount).padStart(5, '0')}`,
      paymentDate: `2026-11-${String((recCount % 8) + 1).padStart(2, '0')}`,
      studentId: student.id,
      studentName: student.fullName,
      rollNumber: student.rollNumber,
      class: student.class,
      section: student.section,
      amount: inv.paidAmount,
      paymentMethod: method,
      referenceNumber: method === 'Bank Transfer' ? `ABL-TRX-${100000 + recCount}` : method === 'Online Payment' ? `EP-${200000 + recCount}` : undefined,
      chequeDetails: method === 'Cheque' ? {
        chequeNumber: `CHQ-${440000 + recCount}`,
        bankName: 'Habib Bank Limited (Mirpur Branch)',
        expectedClearingDate: '2026-11-12',
      } : undefined,
      allocatedInvoices: [
        {
          invoiceId: inv.id,
          invoiceNumber: inv.invoiceNumber,
          allocatedAmount: inv.paidAmount,
        },
      ],
      notes: 'Cleared in full during early payment discount window',
      recordedBy: recCount % 2 === 0 ? 'Muhammad Rashid Minhas' : 'Yasir Nawaz',
      status: 'Completed',
    });

    recCount++;
  });

  // Add 2 reversed payments for demo integrity
  if (payments.length > 5) {
    const p1 = payments[2];
    p1.status = 'Reversed';
    p1.reversalReason = 'Cheque bounced due to insufficient funds';
    p1.reversedAt = '2026-11-05 14:30';
    p1.reversedBy = 'Dr. Tariq Mahmood (Principal)';

    const p2 = payments[4];
    p2.status = 'Reversed';
    p2.reversalReason = 'Duplicate entry error corrected by cashier';
    p2.reversedAt = '2026-11-07 10:15';
    p2.reversedBy = 'Muhammad Rashid Minhas (Accountant)';
  }

  return payments;
}

export const INITIAL_ADJUSTMENTS: Adjustment[] = [
  {
    id: 'adj-1',
    studentId: 'std-5',
    studentName: 'Usman Ahmad',
    rollNumber: '9A-115',
    class: '9th',
    adjustmentType: 'Merit Scholarship',
    amount: 1500,
    reason: 'Top 3 rank in Matric Entry Board Examination',
    applicableInvoiceNumber: 'INV-2026-01005',
    date: '2026-11-02',
    status: 'Approved',
    approvedBy: 'Dr. Tariq Mahmood (Principal)',
  },
  {
    id: 'adj-2',
    studentId: 'std-12',
    studentName: 'Omar Khan',
    rollNumber: '10B-136',
    class: '10th',
    adjustmentType: 'Sibling Discount',
    amount: 1000,
    reason: 'Younger sibling of Daniyal Khan (Roll 12A-110)',
    applicableInvoiceNumber: 'INV-2026-01012',
    date: '2026-11-03',
    status: 'Approved',
    approvedBy: 'Muhammad Rashid Minhas (Accountant)',
  },
  {
    id: 'adj-3',
    studentId: 'std-25',
    studentName: 'Faizan Bhatti',
    rollNumber: '11A-175',
    class: '11th',
    adjustmentType: 'Financial Assistance',
    amount: 2000,
    reason: 'Verified hardship case recommended by Staff Council',
    applicableInvoiceNumber: 'INV-2026-01025',
    date: '2026-11-06',
    status: 'Pending Approval',
  },
  {
    id: 'adj-4',
    studentId: 'std-33',
    studentName: 'Shoaib Dar',
    rollNumber: '12B-199',
    class: '12th',
    adjustmentType: 'Special Concession',
    amount: 1200,
    reason: 'National level sports competition award winner',
    date: '2026-11-07',
    status: 'Pending Approval',
  },
  {
    id: 'adj-5',
    studentId: 'std-41',
    studentName: 'Tariq Mughal',
    rollNumber: '9A-123',
    class: '9th',
    adjustmentType: 'Fee Waiver',
    amount: 3200,
    reason: 'Deceased guardian welfare fund grant',
    date: '2026-10-25',
    status: 'Approved',
    approvedBy: 'Dr. Tariq Mahmood (Principal)',
  },
];

export const INITIAL_REFUNDS: Refund[] = [
  {
    id: 'ref-1',
    studentId: 'std-8',
    studentName: 'Bilal Malik',
    class: '10th',
    originalPaymentId: 'pay-2008',
    receiptNumber: 'REC-2026-02008',
    refundAmount: 1800,
    refundReason: 'Excess tuition fee deposited by parent via ATM',
    paymentMethod: 'Bank Transfer',
    date: '2026-11-04',
    status: 'Processed',
    processedBy: 'Muhammad Rashid Minhas',
  },
  {
    id: 'ref-2',
    studentId: 'std-19',
    studentName: 'Iqra Abbasi',
    class: '11th',
    originalPaymentId: 'pay-2019',
    receiptNumber: 'REC-2026-02019',
    refundAmount: 2000,
    refundReason: 'Security deposit refund after migration to Rawalpindi Board',
    paymentMethod: 'Cash',
    date: '2026-10-29',
    status: 'Processed',
    processedBy: 'Muhammad Rashid Minhas',
  },
  {
    id: 'ref-3',
    studentId: 'std-44',
    studentName: 'Arsalan Gondal',
    class: '12th',
    originalPaymentId: 'pay-2044',
    receiptNumber: 'REC-2026-02044',
    refundAmount: 1500,
    refundReason: 'Overpayment on laboratory apparatus breakage deposit',
    paymentMethod: 'Bank Transfer',
    date: '2026-11-08',
    status: 'Pending',
    processedBy: 'Yasir Nawaz',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 'notif-1',
    studentId: 'std-8',
    studentName: 'Bilal Malik',
    guardianName: 'Abdul Malik',
    whatsappNumber: '+92 300 5543210',
    class: '10th',
    rollNumber: '10B-124',
    outstandingAmount: 7000,
    daysOverdue: 14,
    lastReminderDate: '2026-11-05',
    templateType: 'Overdue Fee Reminder',
    messageBody: 'URGENT: Respected Abdul Malik, the fee account for Bilal Malik (Roll No: 10B-124, Class: 10th) has an overdue balance of Rs. 7,000.00. Please settle the outstanding fee immediately at the Accounts Office. Jammu Kashmir College.',
    sentAt: '2026-11-05 11:30',
    status: 'Delivered',
  },
  {
    id: 'notif-2',
    studentId: 'std-13',
    studentName: 'Mustafa Dar',
    guardianName: 'Altaf Dar',
    whatsappNumber: '+92 321 8876543',
    class: '9th',
    rollNumber: '9A-139',
    outstandingAmount: 3500,
    daysOverdue: 8,
    lastReminderDate: '2026-11-06',
    templateType: 'Fee Due Reminder',
    messageBody: 'Respected Altaf Dar, fee for Mustafa Dar (Class: 9th-A, Roll: 9A-139) for November 2026 is Rs. 3,500.00. Due date is 10 Nov 2026. Thank you, Jammu Kashmir College.',
    sentAt: '2026-11-06 14:15',
    status: 'Delivered',
  },
  {
    id: 'notif-3',
    studentId: 'std-16',
    studentName: 'Maryam Siddiqui',
    guardianName: 'Mansoor Siddiqui',
    whatsappNumber: '+92 333 4455667',
    class: '11th',
    rollNumber: '11B-148',
    outstandingAmount: 8800,
    daysOverdue: 22,
    lastReminderDate: '2026-11-04',
    templateType: 'Overdue Fee Reminder',
    messageBody: 'URGENT: Respected Mansoor Siddiqui, the fee account for Maryam Siddiqui (Roll No: 11B-148, Class: 11th) has an overdue balance of Rs. 8,800.00. Jammu Kashmir College.',
    sentAt: '2026-11-04 09:45',
    status: 'Delivered',
  },
  {
    id: 'notif-4',
    studentId: 'std-24',
    studentName: 'Farhan Mir',
    guardianName: 'Mushtaq Mir',
    whatsappNumber: '+92 345 7788990',
    class: '12th',
    rollNumber: '12B-172',
    outstandingAmount: 10500,
    daysOverdue: 35,
    lastReminderDate: '2026-11-07',
    templateType: 'Overdue Fee Reminder',
    messageBody: 'URGENT: Respected Mushtaq Mir, the fee account for Farhan Mir (Roll No: 12B-172, Class: 12th) has an overdue balance of Rs. 10,500.00. Jammu Kashmir College.',
    sentAt: '2026-11-07 16:20',
    status: 'Failed',
    errorReason: 'WhatsApp number switched off / unreachable on cellular gateway',
  },
  {
    id: 'notif-5',
    studentId: 'std-32',
    studentName: 'Mahnoor Lone',
    guardianName: 'Ghulam Nabi Lone',
    whatsappNumber: '+92 312 9988776',
    class: '10th',
    rollNumber: '10A-196',
    outstandingAmount: 7000,
    daysOverdue: 18,
    lastReminderDate: '2026-11-08',
    templateType: 'Overdue Fee Reminder',
    messageBody: 'URGENT: Respected Ghulam Nabi Lone, fee for Mahnoor Lone is overdue. Jammu Kashmir College.',
    sentAt: '2026-11-08 10:05',
    status: 'Delivered',
  },
  {
    id: 'notif-6',
    studentId: 'std-40',
    studentName: 'Sobia Kayani',
    guardianName: 'Raja Zafar Kayani',
    whatsappNumber: '+92 300 2233445',
    class: '12th',
    rollNumber: '12A-120',
    outstandingAmount: 14000,
    daysOverdue: 42,
    lastReminderDate: '2026-11-08',
    templateType: 'Overdue Fee Reminder',
    messageBody: 'Final Notice: Fee for Sobia Kayani is 42 days overdue. Jammu Kashmir College.',
    sentAt: '2026-11-08 12:50',
    status: 'Queued',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'aud-1', timestamp: '2026-11-09 19:35', user: 'Muhammad Rashid Minhas', action: 'Payment Recorded', module: 'Fee Collection', recordReference: 'REC-2026-02088', description: 'Recorded cash payment of Rs. 3,500.00 for student Hamza Shah (Roll 11A-104).' },
  { id: 'aud-2', timestamp: '2026-11-09 18:40', user: 'Dr. Tariq Mahmood', action: 'Discount Approved', module: 'Adjustments', recordReference: 'ADJ-001', description: 'Approved Merit Scholarship discount of Rs. 1,500.00 for Usman Ahmad.' },
  { id: 'aud-3', timestamp: '2026-11-09 16:15', user: 'Yasir Nawaz', action: 'Payment Recorded', module: 'Fee Collection', recordReference: 'REC-2026-02087', description: 'Recorded Bank Transfer payment of Rs. 7,000.00 for Ali Raza (Roll 10A-102).' },
  { id: 'aud-4', timestamp: '2026-11-09 14:20', user: 'Muhammad Rashid Minhas', action: 'WhatsApp Reminder Initiated', module: 'WhatsApp Notifications', recordReference: 'BATCH-2026-1109', description: 'Dispatched simulated WhatsApp fee overdue batch to 18 eligible recipients.' },
  { id: 'aud-5', timestamp: '2026-11-09 11:05', user: 'Muhammad Rashid Minhas', action: 'Payment Reversed', module: 'Payments', recordReference: 'REC-2026-02003', description: 'Reversed payment due to cheque dishonour returned by Habib Bank Limited.' },
  { id: 'aud-6', timestamp: '2026-11-08 16:50', user: 'Muhammad Rashid Minhas', action: 'Student Created', module: 'Students', recordReference: 'JKC-2026-1101', description: 'Enrolled new student Daniyal Qureshi in Class 11th Section A.' },
  { id: 'aud-7', timestamp: '2026-11-08 14:10', user: 'Dr. Tariq Mahmood', action: 'Fee Structure Modified', module: 'Fee Structures', recordReference: 'fs-11-med', description: 'Published version v3.0 of 11th Pre-Medical fee structure for 2026-27.' },
  { id: 'aud-8', timestamp: '2026-11-07 10:30', user: 'Muhammad Rashid Minhas', action: 'Refund Processed', module: 'Refunds', recordReference: 'REF-001', description: 'Processed refund of Rs. 1,800.00 to parent of Bilal Malik (excess deposit).' },
  { id: 'aud-9', timestamp: '2026-11-06 15:25', user: 'Yasir Nawaz', action: 'Invoice Generated', module: 'Invoices', recordReference: 'INV-2026-01099', description: 'Bulk generated 125 monthly invoices for Class 10th November cycle.' },
  { id: 'aud-10', timestamp: '2026-11-05 09:15', user: 'Muhammad Rashid Minhas', action: 'Annual Charge Assigned', module: 'Fee Assignments', recordReference: 'ASSIGN-2026-44', description: 'Assigned annual Sports and Laboratory charges to 330 students of 11th class.' },
];
