'use client';

import { useState } from 'react';
import { useUiStore, Role } from '../stores/uiStore';
import { User, Users, Briefcase, Shield, ChevronDown, Check } from 'lucide-react';

const roleMeta: Record<Role, { label: string; icon: any; color: string; desc: string }> = {
  Employee: {
    label: 'Employee',
    icon: User,
    color: 'text-teal-600 bg-teal-50 border-teal-200 dark:bg-teal-950/30 dark:border-teal-900/50',
    desc: 'Self-service onboarding, attendance & contributions',
  },
  Manager: {
    label: 'Manager',
    icon: Users,
    color: 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-900/50',
    desc: 'Team performance, leave approvals & check-ins',
  },
  HR: {
    label: 'HR Operations',
    icon: Briefcase,
    color: 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/50',
    desc: 'Onboarding, recruitment analytics & announcements',
  },
  Admin: {
    label: 'System Admin',
    icon: Shield,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900/50',
    desc: 'Global configurations & audit logs',
  },
};

export default function RoleSwitcher() {
  const { activeRole, setRole } = useUiStore();
  const [isOpen, setIsOpen] = useState(false);

  const active = roleMeta[activeRole];
  const Icon = active.icon;

  const handleRoleSelect = (role: Role) => {
    setRole(role);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border shadow-sm transition-all bg-white hover:bg-slate-50 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200"
      >
        <span className={`p-1 rounded-full ${active.color.split(' ')[0]} ${active.color.split(' ')[1]}`}>
          <Icon className="w-3.5 h-3.5" />
        </span>
        <span>{active.label}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-xl z-50 py-1.5 overflow-hidden animate-slide-in">
            <div className="px-3 py-2 border-b border-slate-50 dark:border-zinc-800">
              <p className="text-2xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Demo Access Control
              </p>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {(Object.keys(roleMeta) as Role[]).map((role) => {
                const item = roleMeta[role];
                const ItemIcon = item.icon;
                const isSelected = activeRole === role;

                return (
                  <button
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className={`w-full text-left px-3 py-2.5 flex items-start gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/50 ${
                      isSelected ? 'bg-slate-50/50 dark:bg-zinc-800/30' : ''
                    }`}
                  >
                    <span className={`p-1.5 rounded-lg border mt-0.5 flex-shrink-0 ${item.color}`}>
                      <ItemIcon className="w-4 h-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-semibold ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-700 dark:text-zinc-300'}`}>
                          {item.label}
                        </p>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
                      </div>
                      <p className="text-2xs text-slate-400 dark:text-zinc-500 line-clamp-1 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
