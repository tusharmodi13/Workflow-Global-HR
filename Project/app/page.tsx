'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useUiStore, Role } from '../stores/uiStore';
import { useSession } from '../context/SessionContext';
import RoleSwitcher from '../components/RoleSwitcher';
import BottomNav from '../components/BottomNav';
import OnboardingDashboard from '../components/OnboardingDashboard';
import CopilotWidget from '../components/copilot/CopilotWidget';
import { 
  mockEmployee, 
  mockRelocation, 
  mockTeamIntros, 
  initialOnboardingTasks 
} from '../lib/mockData';
import { 
  User, 
  Users, 
  Clock, 
  TrendingUp, 
  GraduationCap, 
  Award, 
  CalendarDays, 
  Briefcase, 
  BarChart3, 
  Megaphone,
  CheckCircle2, 
  Sparkles,
  Plane,
  Plus,
  Play,
  FileText,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  TrendingDown,
  Info
} from 'lucide-react';

export default function Home() {
  const { user, logout } = useSession();
  const { activeRole, activeTab, isOnboardingActive, setOnboardingActive, setTab } = useUiStore();

  // Local state for interactive features
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [todayHours, setTodayHours] = useState('0h 0m');
  const [selfieSrc, setSelfieSrc] = useState<string | null>(null);
  const [gpsVerified, setGpsVerified] = useState(false);
  const [ipVerified, setIpVerified] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState('Casual');
  const [leaveDays, setLeaveDays] = useState('1');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);
  const [showClockModal, setShowClockModal] = useState(false);

  // Manager Approve queue state
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: 'Alice Smith', type: 'Casual', dates: 'June 28 - June 30', days: 3, reason: 'Family gathering', status: 'Pending' },
    { id: 2, name: 'Bob Johnson', type: 'Sick', dates: 'July 02 - July 03', days: 2, reason: 'Medical checkup', status: 'Pending' },
    { id: 3, name: 'Charlie Green', type: 'Comp-off', dates: 'July 10', days: 1, reason: 'Weekend project release', status: 'Pending' },
  ]);

  const handleApproveLeave = (id: number, approved: boolean) => {
    setLeaveRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: approved ? 'Approved' : 'Rejected' };
      }
      return req;
    }));
  };

  const handleClockIn = () => {
    // Simulate selfie clock in
    setGpsVerified(true);
    setIpVerified(true);
    setSelfieSrc('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'); // placeholder avatar selfie
    setClockedIn(true);
    setClockInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setTodayHours('0h 1m');
    setShowClockModal(false);
  };

  const handleClockOut = () => {
    setClockedIn(false);
    setClockInTime(null);
    setSelfieSrc(null);
    setGpsVerified(false);
    setIpVerified(false);
    setTodayHours('0h 0m');
  };

  // Render dynamic views based on Role and activeTab
  const renderViewContent = () => {
    if (activeRole === 'Employee' && isOnboardingActive) {
      return <OnboardingDashboard />;
    }

    switch (activeTab) {
      case 'Home':
        return renderHomeTab();
      case 'Attendance':
        return renderAttendanceTab();
      case 'Performance':
        return renderPerformanceTab();
      case 'Training':
        return renderTrainingTab();
      case 'Contributions':
        return renderContributionsTab();
      case 'Team':
        return renderTeamTab();
      case 'Leave':
        return renderLeaveTab();
      case 'Recruitment':
        return renderRecruitmentTab();
      case 'Analytics':
        return renderAnalyticsTab();
      case 'Announcements':
        return renderAnnouncementsTab();
      default:
        return renderHomeTab();
    }
  };

  // ----------------------------------------------------
  // RENDER TAB: HOME
  // ----------------------------------------------------
  const renderHomeTab = () => {
    if (activeRole === 'Employee') {
      return (
        <div className="space-y-4">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-teal-100">Welcome Back</span>
                <h2 className="text-lg font-bold mt-0.5">{mockEmployee.name}</h2>
                <p className="text-xs text-teal-100">{mockEmployee.designation}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-teal-400 bg-white">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" alt="Sarah" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-teal-500/40 flex items-center justify-between">
              <button 
                onClick={() => setOnboardingActive(true)}
                className="text-xs bg-white/15 hover:bg-white/20 text-white font-bold py-1.5 px-3 rounded-xl border border-white/10 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>Onboarding Module</span>
              </button>
              <span className="text-[10px] text-teal-200">Session OK</span>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Clock-in shortcut */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between min-h-[110px]">
              <div className="flex items-center justify-between">
                <span className="p-2 bg-teal-50 dark:bg-teal-950/20 text-teal-600 rounded-xl">
                  <Clock className="w-4 h-4" />
                </span>
                <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${clockedIn ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                  {clockedIn ? 'Working' : 'Off-Duty'}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xs text-slate-400 dark:text-zinc-500 font-medium">Attendance Today</p>
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 mt-0.5">
                  {clockedIn ? `In since ${clockInTime}` : 'Not clocked in'}
                </h4>
              </div>
              <button 
                onClick={() => setTab('Attendance')}
                className="text-[10px] font-bold text-teal-600 dark:text-teal-400 hover:underline mt-2 text-left"
              >
                Go to Attendance →
              </button>
            </div>

            {/* Leave Balance shortcut */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between min-h-[110px]">
              <div className="flex items-center justify-between">
                <span className="p-2 bg-orange-50 dark:bg-orange-950/20 text-orange-600 rounded-xl">
                  <CalendarDays className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold text-slate-700 dark:text-zinc-300">
                  14 Days Left
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xs text-slate-400 dark:text-zinc-500 font-medium">Leave Encashment</p>
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 mt-0.5">
                  6 Used | 3 Pending
                </h4>
              </div>
              <button
                onClick={() => { setTab('Performance'); }} // just dummy redirect, actual leave tab is on manager
                className="text-[10px] font-bold text-teal-600 dark:text-teal-400 hover:underline mt-2 text-left"
              >
                Request Offtime →
              </button>
            </div>
          </div>

          {/* Gamified Contributions Banner */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-orange-100 text-orange-600 rounded-xl animate-pulse">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                  Contribution Rank: #4
                </h4>
                <p className="text-2xs text-slate-400 dark:text-zinc-500 mt-0.5">
                  Accumulated 340 pts this cycle.
                </p>
              </div>
            </div>
            <button
              onClick={() => setTab('Contributions')}
              className="p-1.5 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* OKR Goal Widget */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Active Goals (OKRs)</h3>
              <span className="text-[10px] font-bold text-teal-600">78% Avg</span>
            </div>
            <div className="mt-3.5 space-y-2.5">
              <div>
                <div className="flex justify-between text-2xs text-slate-500 mb-1">
                  <span>Standardize Kubernetes meshes</span>
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">85%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-850 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-2xs text-slate-500 mb-1">
                  <span>Author SOC2 compliance documentation</span>
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">70%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-850 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeRole === 'Manager') {
      return (
        <div className="space-y-4">
          {/* Manager stats */}
          <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white rounded-3xl p-5 shadow-sm">
            <h2 className="text-base font-bold">Team Lead Control Hub</h2>
            <p className="text-2xs text-teal-100 mt-0.5">Platform Engineering Group</p>
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-teal-600">
              <div className="text-center">
                <p className="text-lg font-black text-white">8</p>
                <p className="text-[8px] text-teal-100 uppercase font-bold tracking-wider mt-0.5">Team Size</p>
              </div>
              <div className="text-center border-x border-teal-600/60">
                <p className="text-lg font-black text-white">7/8</p>
                <p className="text-[8px] text-teal-100 uppercase font-bold tracking-wider mt-0.5">At Work Today</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-orange-400">3</p>
                <p className="text-[8px] text-teal-100 uppercase font-bold tracking-wider mt-0.5">Pending Leaves</p>
              </div>
            </div>
          </div>

          {/* Leave approvals queue summary */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Pending Leave Approvals</h3>
              <button 
                onClick={() => setTab('Leave')}
                className="text-[10px] font-bold text-teal-600 hover:underline"
              >
                Approve Queue ({leaveRequests.filter(r => r.status === 'Pending').length})
              </button>
            </div>
            <div className="mt-3.5 space-y-2">
              {leaveRequests.filter(r => r.status === 'Pending').slice(0, 2).map((req) => (
                <div key={req.id} className="p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-xl border border-slate-100/50 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300">{req.name}</h4>
                    <p className="text-2xs text-slate-400 mt-0.5">{req.type} • {req.dates} ({req.days}d)</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => handleApproveLeave(req.id, false)}
                      className="px-2 py-1 bg-rose-50 text-rose-600 rounded-lg text-2xs font-bold hover:bg-rose-100"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveLeave(req.id, true)}
                      className="px-2 py-1 bg-teal-600 text-white rounded-lg text-2xs font-bold hover:bg-teal-700"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Team Status list */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Active Coworkers</h3>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                    <img src={mockTeamIntros[0].photo} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">{mockTeamIntros[0].name}</p>
                    <p className="text-2xs text-slate-400">{mockTeamIntros[0].role}</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                    <img src={mockTeamIntros[1].photo} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">{mockTeamIntros[1].name}</p>
                    <p className="text-2xs text-slate-400">{mockTeamIntros[1].role}</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeRole === 'HR') {
      return (
        <div className="space-y-4">
          {/* HR Core Card */}
          <div className="bg-gradient-to-r from-rose-700 to-rose-800 text-white rounded-3xl p-5 shadow-sm">
            <h2 className="text-base font-bold">HR Management Portal</h2>
            <p className="text-2xs text-rose-100 mt-0.5 font-medium">WorkFlow Global Operations</p>
            
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-rose-600/40">
              <div className="text-center">
                <p className="text-lg font-black text-white">128</p>
                <p className="text-[8px] text-rose-100 uppercase font-bold tracking-wider">Headcount</p>
              </div>
              <div className="text-center border-x border-rose-600/60">
                <p className="text-lg font-black text-white">3</p>
                <p className="text-[8px] text-rose-100 uppercase font-bold tracking-wider">Onboarding</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-orange-400">6</p>
                <p className="text-[8px] text-rose-100 uppercase font-bold tracking-wider">Open Roles</p>
              </div>
            </div>
          </div>

          {/* Active onboarding pipelines */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Active Onboardings</h3>
            <div className="mt-3.5 space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-zinc-800/40 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-150">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300">Sarah Jenkins</h4>
                    <p className="text-[9px] text-slate-400">Join date: July 01</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xs font-bold text-teal-600">30% Done</span>
                  <div className="w-16 bg-slate-200 dark:bg-zinc-700 h-1 rounded-full mt-1">
                    <div className="bg-teal-500 h-full rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-zinc-800/40 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-150">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300">Johnathan Doe</h4>
                    <p className="text-[9px] text-slate-400">Join date: June 20</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xs font-bold text-teal-600">100% Done</span>
                  <div className="w-16 bg-slate-200 dark:bg-zinc-700 h-1 rounded-full mt-1">
                    <div className="bg-teal-500 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeRole === 'Admin') {
      return (
        <div className="space-y-4">
          {/* Admin Stats */}
          <div className="bg-gradient-to-r from-indigo-700 to-indigo-850 text-white rounded-3xl p-5 shadow-sm">
            <h2 className="text-base font-bold">Admin Operations Panel</h2>
            <p className="text-2xs text-indigo-100 mt-0.5">Control, Logs & Systems</p>
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-indigo-650/40">
              <div>
                <p className="text-xs text-indigo-200">System Security</p>
                <p className="text-sm font-bold text-white mt-0.5">SOC2 Compliant</p>
              </div>
              <div>
                <p className="text-xs text-indigo-200">Active Sessions</p>
                <p className="text-sm font-bold text-white mt-0.5">45 Active Users</p>
              </div>
            </div>
          </div>

          {/* System logs widget */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200">System Logs & Integrity</h3>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold">Stable</span>
            </div>
            <div className="space-y-2.5 font-mono text-[9px] text-slate-500 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-100/50 dark:border-zinc-800">
              <p className="text-slate-400">[2026-06-25 23:14:15] AUTH: Session verified: user_id=sarah_j</p>
              <p className="text-slate-400">[2026-06-25 23:18:22] SYNC: DB sync complete, modified_entities=2</p>
              <p className="text-teal-600">[2026-06-25 23:24:34] RBAC: Active role switcher selected = {activeRole}</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // ----------------------------------------------------
  // RENDER TAB: ATTENDANCE (Employee Clock In)
  // ----------------------------------------------------
  const renderAttendanceTab = () => {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm text-center">
          <span className="p-3 bg-teal-50 dark:bg-teal-950/20 text-teal-600 rounded-2xl inline-block">
            <Clock className="w-6 h-6" />
          </span>
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-3">
            Selfie Attendance Clock-In
          </h3>
          <p className="text-2xs text-slate-400 mt-1 max-w-[280px] mx-auto leading-normal">
            Verify identity and capture GPS coordinates and IP addresses for location compliance.
          </p>

          {clockedIn ? (
            <div className="mt-4 p-4 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl space-y-3">
              <div className="flex items-center justify-center gap-3">
                {selfieSrc && (
                  <div className="w-12 h-12 rounded-xl border border-emerald-250 overflow-hidden bg-slate-100">
                    <img src={selfieSrc} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="text-left">
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Clocked In Successfully</p>
                  <p className="text-2xs text-slate-400 mt-0.5">Time: {clockInTime} today</p>
                </div>
              </div>

              <div className="flex items-center justify-around bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 text-2xs text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-teal-600">
                  <CheckCircle2 className="w-3.5 h-3.5" /> GPS Verified
                </span>
                <span className="flex items-center gap-1 font-semibold text-teal-600">
                  <CheckCircle2 className="w-3.5 h-3.5" /> IP Validated
                </span>
              </div>

              <button
                onClick={handleClockOut}
                className="w-full bg-rose-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-rose-700 transition-colors"
              >
                Clock Out Now
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              <button
                onClick={() => setShowClockModal(true)}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md hover:from-teal-700 hover:to-teal-800 transition-all flex items-center justify-center gap-2"
              >
                <span>Trigger Selfie Clock-In</span>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Clock In Modal */}
        {showClockModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-xs overflow-hidden border border-slate-100 dark:border-zinc-800 p-5 shadow-2xl relative">
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Face Recognition Verification</h3>
              <p className="text-2xs text-slate-400 mt-1">Capturing coordinates & verifying identity via camera...</p>
              
              <div className="my-4 aspect-square bg-slate-100 dark:bg-zinc-950 border border-dashed border-slate-350 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                {/* Simulated video feedback */}
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300" 
                  className="w-full h-full object-cover opacity-60 animate-pulse" 
                />
                <div className="absolute inset-0 border-2 border-teal-500 rounded-2xl m-6 animate-ping pointer-events-none" />
                <span className="absolute bottom-2 px-3 py-1 bg-black/75 text-[9px] text-teal-400 font-bold rounded-full uppercase tracking-wider">
                  Align Face Here
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-2xs text-slate-400">
                  <span>GPS Coordinates</span>
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">40.7128° N, 74.0060° W</span>
                </div>
                <div className="flex justify-between text-2xs text-slate-400">
                  <span>ISP Network IP</span>
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">192.168.1.145</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => setShowClockModal(false)}
                  className="flex-1 py-2 border border-slate-200 dark:border-zinc-800 text-slate-500 rounded-xl text-2xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClockIn}
                  className="flex-1 py-2 bg-teal-600 text-white rounded-xl text-2xs font-semibold hover:bg-teal-700"
                >
                  Capture & Verify
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Breakdown */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Today's Working Hours</h3>
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="bg-slate-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-slate-50">
              <span className="text-[10px] text-slate-400">Productive</span>
              <p className="text-xs font-bold text-teal-600 dark:text-teal-400 mt-1">{clockedIn ? '8h 30m' : '0h 0m'}</p>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-slate-50">
              <span className="text-[10px] text-slate-400">Break</span>
              <p className="text-xs font-bold text-orange-500 mt-1">{clockedIn ? '0h 45m' : '0h 0m'}</p>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-slate-50">
              <span className="text-[10px] text-slate-400">Overtime</span>
              <p className="text-xs font-bold text-indigo-500 mt-1">{clockedIn ? '0h 15m' : '0h 0m'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // RENDER TAB: LEAVE (Manager Approve Queue & Request)
  // ----------------------------------------------------
  const renderLeaveTab = () => {
    return (
      <div className="space-y-4">
        {/* Manager Approvals queue */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Team Leave Approval Queue</h3>
            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-[9px] font-bold">
              {leaveRequests.filter(r => r.status === 'Pending').length} Pending
            </span>
          </div>

          <div className="space-y-2.5">
            {leaveRequests.map((req) => (
              <div 
                key={req.id} 
                className="p-3.5 bg-slate-50 dark:bg-zinc-800/45 rounded-xl border border-slate-100/50 dark:border-zinc-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">{req.name}</h4>
                    <p className="text-2xs text-slate-450 mt-0.5">{req.type} Leave • {req.dates}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                    req.status === 'Pending' 
                      ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/20' 
                      : req.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20'
                  }`}>
                    {req.status}
                  </span>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-2.5 rounded-lg text-2xs italic text-slate-500">
                  Reason: "{req.reason}"
                </div>

                {req.status === 'Pending' && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleApproveLeave(req.id, false)}
                      className="flex-1 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-2xs font-bold hover:bg-rose-100"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveLeave(req.id, true)}
                      className="flex-1 py-1.5 bg-teal-600 text-white rounded-lg text-2xs font-bold hover:bg-teal-700"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Leave Request Form */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Submit New Offtime Request</h3>
          
          {leaveSubmitted ? (
            <div className="mt-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
              <h4 className="text-xs font-bold text-emerald-800 mt-2">Request Submitted Successfully</h4>
              <p className="text-2xs text-slate-400 mt-1">
                Your request for {leaveDays} days has been logged and routed to Marcus Aurelius (Manager) for approval.
              </p>
              <button 
                onClick={() => setLeaveSubmitted(false)}
                className="mt-3 px-3 py-1 bg-white text-slate-650 rounded-lg text-2xs font-semibold border"
              >
                Request Again
              </button>
            </div>
          ) : (
            <form 
              onSubmit={(e) => { e.preventDefault(); setLeaveSubmitted(true); setLeaveReason(''); }}
              className="mt-3.5 space-y-3"
            >
              <div className="space-y-1.5">
                <label className="block text-2xs font-bold text-slate-450 uppercase">Leave Type</label>
                <select
                  value={selectedLeaveType}
                  onChange={(e) => setSelectedLeaveType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 px-3 py-2 text-xs bg-white dark:bg-zinc-900 text-slate-700"
                >
                  <option value="Casual">Casual Leave (12 Available)</option>
                  <option value="Sick">Sick Leave (8 Available)</option>
                  <option value="Comp-off">Comp-off (2 Available)</option>
                  <option value="LWP">Leave Without Pay (Uncapped)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-2xs font-bold text-slate-450 uppercase">Days Duration</label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={leaveDays}
                  onChange={(e) => setLeaveDays(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 px-3 py-2 text-xs bg-white dark:bg-zinc-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-2xs font-bold text-slate-450 uppercase">Absence Reason</label>
                <textarea
                  required
                  placeholder="Specify reason for leave..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 px-3 py-2 text-xs h-16 bg-white dark:bg-zinc-900"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-650 text-white py-2 rounded-xl text-2xs font-bold shadow-sm"
              >
                Log Request
              </button>
            </form>
          )}
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // OTHER DUMMY TAB VIEWS (Phase 1 placeholders)
  // ----------------------------------------------------
  const renderPerformanceTab = () => (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3">
      <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
        <TrendingUp className="w-4 h-4 text-teal-600" />
        <span>Performance & Goals (OKRs)</span>
      </h3>
      <p className="text-2xs text-slate-405 leading-normal">
        Your performance review logs and corporate OKR metrics will sync here in Phase 4.
      </p>
      <div className="bg-slate-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300">Q2 Core Review</h4>
          <p className="text-2xs text-slate-400 mt-0.5">Rating: 4.8 / 5.0 (Exceeds expectations)</p>
        </div>
        <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-2xs font-bold border border-emerald-100">
          A+ Rank
        </span>
      </div>
    </div>
  );

  const renderTrainingTab = () => (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3">
      <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
        <GraduationCap className="w-4 h-4 text-teal-600" />
        <span>Learning & Development Hub</span>
      </h3>
      <p className="text-2xs text-slate-405 leading-normal">
        Access catalog of mandatory security trainings, dev certifications and courses. Syncs in Phase 4.
      </p>
      <div className="space-y-2">
        <div className="p-2.5 bg-slate-50 dark:bg-zinc-800/40 rounded-xl flex items-center justify-between">
          <div>
            <h4 className="text-2xs font-bold text-slate-700 dark:text-zinc-300">SOC2 Information Security Compliance</h4>
            <p className="text-[10px] text-slate-400">Duration: 45 min • Mandatory</p>
          </div>
          <span className="px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded text-[9px] font-semibold border">
            Pending
          </span>
        </div>
      </div>
    </div>
  );

  const renderContributionsTab = () => (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3">
      <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
        <Award className="w-4 h-4 text-teal-600" />
        <span>Peer Recognition & Contributions</span>
      </h3>
      <p className="text-2xs text-slate-405 leading-normal">
        Earn badges, appreciation points and rank on peer leaderboards. Syncs in Phase 4.
      </p>
      
      <div className="bg-slate-50 dark:bg-zinc-800/40 p-3 rounded-xl border space-y-2.5">
        <h4 className="text-2xs uppercase tracking-wider text-slate-400 font-bold">Workspace Leaderboard</h4>
        <div className="space-y-1.5">
          <div className="flex justify-between text-2xs text-slate-650">
            <span>1. Arlene McCoy</span>
            <span className="font-bold">480 pts</span>
          </div>
          <div className="flex justify-between text-2xs text-slate-650">
            <span>2. Devon Lane</span>
            <span className="font-bold">410 pts</span>
          </div>
          <div className="flex justify-between text-2xs text-slate-650 font-semibold text-teal-650">
            <span>4. Sarah Jenkins (You)</span>
            <span className="font-bold">340 pts</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeamTab = () => (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3">
      <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
        <Users className="w-4 h-4 text-teal-600" />
        <span>Workspace Team Directory</span>
      </h3>
      <p className="text-2xs text-slate-405 leading-normal">
        Access employee contacts, structures and roles. Syncs in Phase 5.
      </p>

      <div className="space-y-2">
        {mockTeamIntros.map((m) => (
          <div key={m.id} className="p-2.5 bg-slate-50 dark:bg-zinc-850 rounded-xl flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
              <img src={m.photo} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300">{m.name}</h4>
              <p className="text-2xs text-slate-400">{m.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecruitmentTab = () => (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3">
      <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
        <Briefcase className="w-4 h-4 text-teal-600" />
        <span>Hiring & Candidate Funnels</span>
      </h3>
      <p className="text-2xs text-slate-405 leading-normal">
        Track open job openings and schedule active interviews. Syncs in Phase 5.
      </p>
      
      <div className="p-2.5 bg-slate-50 dark:bg-zinc-850 rounded-xl border border-slate-100/50">
        <h4 className="text-2xs font-bold text-slate-700 dark:text-zinc-300">Senior React Developer</h4>
        <p className="text-[10px] text-slate-400 mt-0.5">3 Active Applicants • Sourcing</p>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3">
      <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
        <BarChart3 className="w-4 h-4 text-teal-600" />
        <span>Corporate Resource Analytics</span>
      </h3>
      <p className="text-2xs text-slate-405 leading-normal">
        High-fidelity reporting dashboard for management overview. Syncs in Phase 5.
      </p>

      {/* Styled pure CSS chart mockup */}
      <div className="bg-slate-50 dark:bg-zinc-800/40 p-3 rounded-xl border">
        <h4 className="text-2xs uppercase tracking-wider text-slate-400 font-bold mb-3">Attendance Stats (Monthly)</h4>
        <div className="h-24 flex items-end justify-between gap-2.5 px-2">
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full bg-teal-500 rounded-t h-16" />
            <span className="text-[8px] text-slate-400">Week 1</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full bg-teal-500 rounded-t h-20" />
            <span className="text-[8px] text-slate-400">Week 2</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full bg-orange-500 rounded-t h-12" />
            <span className="text-[8px] text-slate-400">Week 3</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full bg-teal-500 rounded-t h-14" />
            <span className="text-[8px] text-slate-400">Week 4</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnnouncementsTab = () => (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3">
      <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
        <Megaphone className="w-4 h-4 text-teal-600" />
        <span>Corporate Announcements</span>
      </h3>
      <p className="text-2xs text-slate-405 leading-normal">
        Broadcast targeted alerts and company policy revisions. Syncs in Phase 5.
      </p>

      <div className="p-3 bg-orange-50/50 dark:bg-orange-950/10 rounded-xl border border-orange-100 space-y-2">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-[8px] font-bold">Alert</span>
          <h4 className="text-2xs font-bold text-slate-750 dark:text-zinc-300">Revised Health Insurance Policy</h4>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-normal">
          Please review the revised policy details in the document repository. Acknowledgment is required by June 30.
        </p>
        <button className="px-2 py-1 bg-orange-500 text-white rounded text-[8px] font-bold hover:bg-orange-600">
          Acknowledge Policy
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-950 font-sans flex-col items-center justify-center p-4">
      {/* Interactive Mobile Device Frame */}
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl border-[10px] border-slate-800 dark:border-zinc-800 h-[820px] relative overflow-hidden flex flex-col">
        {/* Device Speaker / Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-800 dark:bg-zinc-800 rounded-b-2xl z-40 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-700 dark:bg-zinc-700 rounded-full" />
        </div>

        {/* Device Status Bar */}
        <div className="h-8 bg-white dark:bg-zinc-900 flex items-center justify-between px-6 pt-1 text-[10px] text-slate-600 dark:text-zinc-400 font-semibold select-none z-30">
          <span>09:41 AM</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-slate-600 dark:bg-zinc-400" />
            <span className="w-3 h-2 rounded-sm border border-slate-600 dark:border-zinc-450" />
          </div>
        </div>

        {/* App Header */}
        <div className="h-14 bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between px-4 z-30">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-teal-500 to-orange-500 flex items-center justify-center">
              <span className="text-[10px] font-black text-white">W</span>
            </div>
            <span className="text-xs font-black tracking-tight text-slate-800 dark:text-zinc-200">
              WorkFlow
            </span>
          </div>
          
          <RoleSwitcher />
        </div>

        {/* Scrollable Content Viewport */}
        <div className="flex-1 overflow-y-auto relative pb-20 p-4 bg-slate-50 dark:bg-zinc-950">
          {renderViewContent()}
        </div>

        {/* Bottom Nav Bar */}
        <BottomNav />

        {/* Global HR Copilot AI Assistant */}
        <CopilotWidget />
      </div>
    </div>
  );
}
