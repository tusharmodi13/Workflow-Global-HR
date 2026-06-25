'use client';

import { useUiStore, Role } from '../stores/uiStore';
import { 
  Home, 
  Clock, 
  TrendingUp, 
  GraduationCap, 
  Award, 
  Users, 
  CalendarDays, 
  Briefcase, 
  BarChart3, 
  Megaphone 
} from 'lucide-react';

interface TabItem {
  name: string;
  icon: any;
  label: string;
}

const tabMetaData: Record<string, TabItem> = {
  Home: { name: 'Home', icon: Home, label: 'Home' },
  Attendance: { name: 'Attendance', icon: Clock, label: 'Clock' },
  Performance: { name: 'Performance', icon: TrendingUp, label: 'Growth' },
  Training: { name: 'Training', icon: GraduationCap, label: 'Learn' },
  Contributions: { name: 'Contributions', icon: Award, label: 'Points' },
  Team: { name: 'Team', icon: Users, label: 'Team' },
  Leave: { name: 'Leave', icon: CalendarDays, label: 'Leave' },
  Recruitment: { name: 'Recruitment', icon: Briefcase, label: 'Hire' },
  Analytics: { name: 'Analytics', icon: BarChart3, label: 'Stats' },
  Announcements: { name: 'Announcements', icon: Megaphone, label: 'Alerts' },
};

const navigationMatrix: Record<Role, string[]> = {
  Employee: ['Home', 'Attendance', 'Performance', 'Training', 'Contributions'],
  Manager: ['Home', 'Team', 'Leave', 'Performance', 'Training'],
  HR: ['Home', 'Recruitment', 'Analytics', 'Training', 'Announcements'],
  Admin: ['Home', 'Analytics', 'Team', 'Training', 'Announcements'],
};

export default function BottomNav() {
  const { activeRole, activeTab, setTab, isOnboardingActive } = useUiStore();

  // If Employee is in onboarding flow, keep bottom navigation disabled or simplified to focus on onboarding
  const tabs = navigationMatrix[activeRole];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-slate-100 dark:border-zinc-800 flex items-center justify-around px-2 z-30">
      {tabs.map((tabName) => {
        const tab = tabMetaData[tabName];
        if (!tab) return null;
        const Icon = tab.icon;
        const isSelected = activeTab === tabName;
        
        // Disable tabs other than Home if onboarding is active for employee
        const isDisabled = activeRole === 'Employee' && isOnboardingActive && tabName !== 'Home';

        return (
          <button
            key={tabName}
            onClick={() => !isDisabled && setTab(tabName)}
            disabled={isDisabled}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
              isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer active:scale-95'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${
              isSelected 
                ? 'bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400' 
                : 'text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300'
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={`text-[9px] font-medium tracking-tight mt-0.5 ${
              isSelected 
                ? 'text-teal-600 dark:text-teal-400 font-bold' 
                : 'text-slate-400 dark:text-zinc-500'
            }`}>
              {tab.label}
            </span>
            {isSelected && (
              <span className="w-1 h-1 bg-teal-500 dark:bg-teal-400 rounded-full mt-0.5 absolute bottom-1.5" />
            )}
          </button>
        );
      })}
    </div>
  );
}
