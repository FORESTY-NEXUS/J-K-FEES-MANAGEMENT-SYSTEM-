'use client';

import React, { useState } from 'react';
import {
  Send,
  Plus,
  Copy,
  Trash2,
  Pencil,
  CheckCircle2,
  Smartphone,
  Sparkles,
  Building2,
  X,
} from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { MessageTemplate } from '@/types';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function MessageTemplatesPage() {
  const { templates, addTemplate, updateTemplate, deleteTemplate, settings } = useFeeApp();

  const [activeTemplate, setActiveTemplate] = useState<MessageTemplate>(templates[0] || {
    id: 'tmpl-new',
    name: 'New Custom Reminder',
    category: 'Fee Due Reminder',
    body: 'Respected {{parent_name}}, fee for {{student_name}} is {{amount}}. Due: {{due_date}}. {{college_name}}.',
    isDefault: false,
    lastUpdated: '2026-11-09',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState(activeTemplate.name);
  const [formCategory, setFormCategory] = useState(activeTemplate.category);
  const [formBody, setFormBody] = useState(activeTemplate.body);

  const handleSelectTemplate = (tmpl: MessageTemplate) => {
    setActiveTemplate(tmpl);
    setFormName(tmpl.name);
    setFormCategory(tmpl.category);
    setFormBody(tmpl.body);
    setIsEditing(false);
  };

  const handleInsertPlaceholder = (placeholder: string) => {
    setFormBody((prev) => `${prev} ${placeholder}`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formBody.trim()) {
      toast.error('Please fill template name and message body');
      return;
    }

    if (activeTemplate.id.startsWith('new-')) {
      const created = addTemplate({
        name: formName,
        category: formCategory,
        body: formBody,
        isDefault: false,
      });
      setActiveTemplate(created);
      toast.success('New message template created!');
    } else {
      updateTemplate(activeTemplate.id, {
        name: formName,
        category: formCategory,
        body: formBody,
      });
      setActiveTemplate({
        ...activeTemplate,
        name: formName,
        category: formCategory,
        body: formBody,
      });
      toast.success('Message template updated!');
    }
    setIsEditing(false);
  };

  const handleDuplicate = (tmpl: MessageTemplate) => {
    const dupl = addTemplate({
      name: `${tmpl.name} (Copy)`,
      category: tmpl.category,
      body: tmpl.body,
      isDefault: false,
    });
    setActiveTemplate(dupl);
    setFormName(dupl.name);
    setFormCategory(dupl.category);
    setFormBody(dupl.body);
    toast.success('Template duplicated!');
  };

  const handleDelete = (id: string) => {
    if (templates.length <= 1) {
      toast.error('At least one template must remain in the system.');
      return;
    }
    deleteTemplate(id);
    const next = templates.find((t) => t.id !== id) || templates[0];
    handleSelectTemplate(next);
    toast.success('Template deleted.');
  };

  // Preview replacement using sample demo student
  const previewRendered = (formBody || activeTemplate.body)
    .replace(/\{\{student_name\}\}/g, 'Hamza Shah')
    .replace(/\{\{parent_name\}\}/g, 'Syed Anwar Shah')
    .replace(/\{\{class\}\}/g, '11th')
    .replace(/\{\{section\}\}/g, 'A')
    .replace(/\{\{roll_number\}\}/g, '11A-104')
    .replace(/\{\{amount\}\}/g, 'Rs. 3,500.00')
    .replace(/\{\{balance\}\}/g, 'Rs. 7,000.00')
    .replace(/\{\{due_date\}\}/g, '10 Nov 2026')
    .replace(/\{\{college_name\}\}/g, settings.collegeName);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
            Message Templates
          </h1>
          <p className="text-[13px] text-[#334155]">
            Configure and standardize dynamic WhatsApp notifications and institutional fee notices.
          </p>
        </div>

        <button
          onClick={() => {
            const newT: MessageTemplate = {
              id: `new-${Date.now()}`,
              name: 'Untitled Template',
              category: 'General Announcement',
              body: 'Notice from {{college_name}}: Respected {{parent_name}}, fee for {{student_name}} is due on {{due_date}}.',
              isDefault: false,
              lastUpdated: '2026-11-09',
            };
            setActiveTemplate(newT);
            setFormName(newT.name);
            setFormCategory(newT.category);
            setFormBody(newT.body);
            setIsEditing(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-3.5 py-1.5 text-[12px] font-medium text-white shadow-xs hover:bg-[#142842] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (4/12): Templates List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-2xs space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] px-2 block">
              Available Templates ({templates.length})
            </span>
            <div className="space-y-1.5">
              {templates.map((tmpl) => {
                const isSelected = activeTemplate.id === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#1e3a5f] bg-[#f1f5f9]'
                        : 'border-[#e2e8f0] bg-white hover:bg-[#f8f9fb]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[13px] text-[#0f172a]">{tmpl.name}</span>
                      {tmpl.isDefault && (
                        <span className="text-[10px] font-bold text-[#166534] bg-[#f0fdf4] px-1.5 py-0.2 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#334155] mt-0.5">{tmpl.category}</div>
                    <div className="flex items-center justify-between text-[10px] text-[#64748b] mt-2 pt-2 border-t border-[#e2e8f0]">
                      <span>Updated: {formatDate(tmpl.lastUpdated)}</span>
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleDuplicate(tmpl)}
                          className="hover:text-[#1e3a5f]"
                          title="Duplicate template"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        {!tmpl.isDefault && (
                          <button
                            onClick={() => handleDelete(tmpl.id)}
                            className="hover:text-[#991b1b]"
                            title="Delete template"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col (8/12): Side-by-side Editor & Live Preview */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Template Editor Form */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
                <h3 className="text-[14px] font-semibold text-[#0f172a]">
                  {isEditing ? 'Editing Template' : 'Template Specifications'}
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[12px] font-semibold text-[#1e3a5f] hover:underline flex items-center gap-1"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit Template
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-[12px] text-[#334155] hover:text-[#0f172a]"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#334155] mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px] disabled:bg-[#f8f9fb]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#334155] mb-1">
                    Category
                  </label>
                  <select
                    disabled={!isEditing}
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as MessageTemplate['category'])}
                    className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px] disabled:bg-[#f8f9fb]"
                  >
                    <option value="Fee Due Reminder">Fee Due Reminder</option>
                    <option value="Overdue Fee Reminder">Overdue Fee Reminder</option>
                    <option value="Payment Confirmation">Payment Confirmation</option>
                    <option value="Upcoming Due Date">Upcoming Due Date</option>
                    <option value="General Announcement">General Announcement</option>
                  </select>
                </div>

                {/* Variable inserters */}
                {isEditing && (
                  <div>
                    <label className="block text-[11px] font-medium text-[#334155] mb-1">
                      Insert Placeholders
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {[
                        '{{student_name}}',
                        '{{parent_name}}',
                        '{{class}}',
                        '{{section}}',
                        '{{roll_number}}',
                        '{{amount}}',
                        '{{balance}}',
                        '{{due_date}}',
                        '{{college_name}}',
                      ].map((ph) => (
                        <button
                          key={ph}
                          type="button"
                          onClick={() => handleInsertPlaceholder(ph)}
                          className="rounded bg-[#f1f5f9] px-2 py-0.5 font-mono text-[10px] text-[#1e3a5f] hover:bg-[#f1f5f9]"
                        >
                          {ph}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-medium text-[#334155] mb-1">
                    Message Body
                  </label>
                  <textarea
                    rows={6}
                    disabled={!isEditing}
                    value={formBody}
                    onChange={(e) => setFormBody(e.target.value)}
                    className="w-full rounded border border-[#e2e8f0] p-2.5 text-[12px] leading-relaxed disabled:bg-[#f8f9fb]"
                  />
                </div>

                {isEditing && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="rounded bg-[#1e3a5f] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#142842]"
                    >
                      Save Template
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Desktop Side-by-Side Live Mobile WhatsApp Preview */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
                <span className="text-[14px] font-semibold text-[#0f172a] flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4 text-[#166534]" />
                  <span>WhatsApp Message Live Preview</span>
                </span>
                <span className="text-[10px] bg-[#f0fdf4] text-[#166534] font-bold px-2 py-0.5 rounded">
                  Simulated Guardian View
                </span>
              </div>

              {/* Mock phone bubble presentation */}
              <div className="rounded-xl bg-[#F0F2F5] p-4 border border-[#e2e8f0] space-y-3">
                <div className="flex items-center gap-2 border-b border-[#e2e8f0] pb-2 text-[11px] text-[#334155]">
                  <div className="h-2 w-2 rounded-full bg-[#166534]" />
                  <span>{settings.collegeName} (Official Finance Service)</span>
                </div>

                <div className="rounded-lg bg-white p-3 shadow-xs border border-[#e2e8f0] text-[12px] leading-relaxed text-[#0f172a] space-y-2">
                  <p className="whitespace-pre-wrap">{previewRendered}</p>
                  <div className="text-right text-[10px] text-[#64748b]">11:42 AM · Read ✓✓</div>
                </div>
              </div>

              <div className="text-[11px] text-[#334155] bg-[#f8f9fb] p-2.5 rounded border border-[#e2e8f0]">
                <strong>Sample Student Record:</strong> Hamza Shah (Roll 11A-104) · Guardian: Syed Anwar Shah
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
