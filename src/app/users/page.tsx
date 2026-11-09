'use client';

import React, { useState } from 'react';
import {
  Shield,
  Plus,
  CheckCircle2,
  Lock,
  UserCheck,
  Mail,
  Clock,
  X,
} from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { UserAccount } from '@/types';
import { toast } from 'sonner';

export default function UsersPage() {
  const { users, addUser, updateUser } = useFeeApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserAccount['role']>('Fee Collection Staff');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Please enter name and email');
      return;
    }

    const perms =
      role === 'Principal'
        ? ['All Modules', 'Discounts Approval', 'System Settings', 'Reports']
        : role === 'Accountant'
        ? ['Fee Collection', 'Invoices', 'Payments', 'Adjustments', 'Reports', 'WhatsApp Reminders']
        : ['Fee Collection', 'Receipts Printing', 'Search Accounts'];

    addUser({
      name,
      email,
      role,
      status: 'Active',
      permissions: perms,
    });

    toast.success(`User account for ${name} created successfully!`);
    setIsAddOpen(false);
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
            User Management & Role Permissions
          </h1>
          <p className="text-[13px] text-[#334155]">
            Configure administrative accounts, role delegations, and fee cashier access permissions.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-3.5 py-1.5 text-[12px] font-medium text-white shadow-xs hover:bg-[#142842] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add User Account</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">System Role</th>
                <th className="py-3 px-4">Assigned Permissions</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {users.map((usr) => (
                <tr key={usr.id} className="hover:bg-[#f8f9fb] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e3a5f] text-white font-semibold text-[12px]">
                        {usr.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-[#0f172a]">{usr.name}</div>
                        <div className="text-[11px] text-[#334155] flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {usr.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        usr.role === 'Principal'
                          ? 'bg-[#f1f5f9] text-[#1e3a5f]'
                          : usr.role === 'Accountant'
                          ? 'bg-[#f0fdf4] text-[#166534]'
                          : 'bg-[#f1f5f9] text-[#334155]'
                      }`}
                    >
                      {usr.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {usr.permissions.map((p) => (
                        <span key={p} className="text-[10px] bg-[#f8f9fb] border border-[#e2e8f0] px-1.5 py-0.2 rounded text-[#0f172a]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#334155] text-[12px]">{usr.lastActive}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        usr.status === 'Active' ? 'bg-[#f0fdf4] text-[#166534]' : 'bg-[#f1f5f9] text-[#334155]'
                      }`}
                    >
                      {usr.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Matrix Preview */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-2xs space-y-4">
        <h3 className="text-[14px] font-semibold text-[#0f172a]">Role Permission Hierarchy Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[12px]">
          <div className="p-3.5 rounded-lg border border-[#e2e8f0] bg-[#f8f9fb] space-y-2">
            <span className="font-bold text-[#1e3a5f] block">Principal</span>
            <ul className="space-y-1 text-[#334155]">
              <li>✓ Full institutional financial control</li>
              <li>✓ Scholarship & waiver approvals</li>
              <li>✓ Payment reversal authorizations</li>
              <li>✓ System settings & fee structures</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-lg border border-[#e2e8f0] bg-[#f8f9fb] space-y-2">
            <span className="font-bold text-[#166534] block">Accountant</span>
            <ul className="space-y-1 text-[#334155]">
              <li>✓ Fee collection & challan issuance</li>
              <li>✓ Ledger reconciliations & receipts</li>
              <li>✓ WhatsApp notification broadcasts</li>
              <li>✓ Financial reports & aging analysis</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-lg border border-[#e2e8f0] bg-[#f8f9fb] space-y-2">
            <span className="font-bold text-[#64748B] block">Fee Collection Staff</span>
            <ul className="space-y-1 text-[#334155]">
              <li>✓ Search student fee accounts</li>
              <li>✓ Counter cash/cheque recording</li>
              <li>✓ Instant receipt printouts</li>
              <li>✗ Cannot delete or reverse records</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal: Add User Account */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <h3 className="text-[16px] font-bold text-[#0f172a]">Create Staff User</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-[#334155] hover:text-[#0f172a]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asif Qureshi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  placeholder="asif.finance@jkcollege.edu.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserAccount['role'])}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                >
                  <option value="Fee Collection Staff">Fee Collection Staff</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Principal">Principal</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded px-4 py-1.5 text-[12px] text-[#334155]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-[#1e3a5f] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#142842]"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
