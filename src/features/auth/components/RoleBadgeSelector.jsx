import { USER_ROLES } from '../types/authTypes';
import { cn } from '../../../utils/cn';
import { GraduationCap, Briefcase, Building, ShieldCheck } from 'lucide-react';

export function RoleBadgeSelector({ currentRole, onSelectRole, className = '' }) {
  const roles = [
    {
      id: USER_ROLES.STUDENT,
      label: 'Student',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      color: 'hover:border-indigo-500 hover:text-indigo-300',
      activeColor: 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-sm shadow-indigo-500/20',
    },
    {
      id: USER_ROLES.TEACHER,
      label: 'Teacher / Faculty',
      icon: <Briefcase className="w-3.5 h-3.5" />,
      color: 'hover:border-purple-500 hover:text-purple-300',
      activeColor: 'bg-purple-600/30 border-purple-500 text-purple-300 shadow-sm shadow-purple-500/20',
    },
    {
      id: USER_ROLES.INSTITUTION_ADMIN,
      label: 'College Admin',
      icon: <Building className="w-3.5 h-3.5" />,
      color: 'hover:border-cyan-500 hover:text-cyan-300',
      activeColor: 'bg-cyan-600/30 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/20',
    },
    {
      id: USER_ROLES.SUPER_ADMIN,
      label: 'Super Admin',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      color: 'hover:border-emerald-500 hover:text-emerald-300',
      activeColor: 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-500/20',
    },
  ];

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      <span className="text-[11px] font-mono uppercase text-slate-400 mr-1 hidden sm:inline">
        Simulate Role:
      </span>
      {roles.map((r) => {
        const isSelected = currentRole === r.id;
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onSelectRole(r.id)}
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-800 bg-slate-900/80 text-slate-400 transition-all cursor-pointer',
              r.color,
              isSelected && r.activeColor
            )}
          >
            {r.icon}
            <span>{r.label}</span>
          </button>
        );
      })}
    </div>
  );
}
