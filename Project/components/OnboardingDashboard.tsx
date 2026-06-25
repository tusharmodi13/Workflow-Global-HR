'use client';

import { useState, useMemo } from 'react';
import { useUiStore } from '../stores/uiStore';
import { 
  mockEmployee, 
  initialOnboardingTasks, 
  mockWelcomeMessages, 
  mockRelocation, 
  mockTeamIntros, 
  mockMilestones,
  OnboardingTask,
  OnboardingPhase
} from '../lib/mockData';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Play, 
  Plane, 
  ShieldCheck, 
  Home as HomeIcon, 
  CreditCard,
  MessageSquare, 
  Phone, 
  Mail, 
  AlertCircle, 
  Award,
  Sparkles,
  ArrowRight,
  Info,
  X
} from 'lucide-react';

export default function OnboardingDashboard() {
  const { setOnboardingActive } = useUiStore();
  const [tasks, setTasks] = useState<OnboardingTask[]>(initialOnboardingTasks);
  const [activeSubTab, setActiveSubTab] = useState<'checklist' | 'welcome' | 'relocation' | 'team'>('checklist');
  const [selectedPhase, setSelectedPhase] = useState<OnboardingPhase>('Pre-joining');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  // Calculate progress
  const progressStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [tasks]);

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
        return {
          ...t,
          status: nextStatus,
          completedDate: nextStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return t;
    }));
  };

  const currentPhaseTasks = useMemo(() => {
    return tasks.filter(t => t.phase === selectedPhase);
  }, [tasks, selectedPhase]);

  // Relocation status step styling helper
  const getStepStyle = (status: string, target: string) => {
    const statuses = ['Not Started', 'In Progress', 'Approved', 'Completed'];
    const targetIdx = statuses.indexOf(target);
    const currentIdx = statuses.indexOf(status);

    if (currentIdx >= targetIdx) {
      return 'bg-teal-600 text-white';
    } else if (currentIdx + 1 === targetIdx) {
      return 'bg-orange-100 text-orange-600 border border-orange-200 animate-pulse';
    }
    return 'bg-slate-100 text-slate-400 border border-slate-200';
  };

  const handleCompleteOnboarding = () => {
    if (progressStats.percentage < 100) {
      if (confirm(`You have completed ${progressStats.completed} of ${progressStats.total} onboarding tasks. Are you sure you want to finish onboarding?`)) {
        setOnboardingActive(false);
      }
    } else {
      setOnboardingActive(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-zinc-950 overflow-y-auto pb-24">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 text-white p-5 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-orange-500/20 rounded-full blur-lg pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl border-2 border-white/20 overflow-hidden bg-teal-50">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" 
              alt="Sarah Jenkins" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-orange-500 rounded-full text-white">
                New Joiner
              </span>
              <span className="text-[10px] text-teal-100">Joining {mockEmployee.joiningDate}</span>
            </div>
            <h1 className="text-lg font-bold truncate mt-0.5">{mockEmployee.name}</h1>
            <p className="text-xs text-teal-100 truncate">{mockEmployee.designation}</p>
          </div>
        </div>

        {/* Dynamic Progress Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 mt-4 shadow-md text-slate-800 dark:text-zinc-200 border border-slate-100 dark:border-zinc-800 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold dark:text-zinc-500">
                Onboarding Progress
              </span>
              <p className="text-sm font-bold text-slate-700 dark:text-zinc-300 mt-0.5">
                {progressStats.completed} of {progressStats.total} Tasks Completed
              </p>
            </div>
            <div className="relative flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle 
                  cx="24" cy="24" r="20" 
                  className="stroke-slate-100 dark:stroke-zinc-800" 
                  strokeWidth="4" 
                  fill="transparent" 
                />
                <circle 
                  cx="24" cy="24" r="20" 
                  className="stroke-teal-600 dark:stroke-teal-400 transition-all duration-500" 
                  strokeWidth="4" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - progressStats.percentage / 100)}
                />
              </svg>
              <span className="absolute text-xs font-bold text-teal-600 dark:text-teal-400">
                {progressStats.percentage}%
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full mt-3.5 overflow-hidden">
            <div 
              className="bg-teal-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progressStats.percentage}%` }}
            />
          </div>

          {progressStats.percentage === 100 ? (
            <div className="flex items-center gap-2 mt-3 bg-teal-50 dark:bg-teal-950/20 p-2.5 rounded-xl border border-teal-100 dark:border-teal-900/50">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0 animate-bounce" />
              <p className="text-2xs text-teal-700 dark:text-teal-400 font-semibold leading-normal">
                Awesome! All tasks are completed. You're ready to enter standard mode.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 mt-3 text-slate-400 dark:text-zinc-500">
              <Info className="w-3.5 h-3.5 text-teal-600" />
              <p className="text-2xs leading-normal">
                Finish tasks below to reach 100% and transition.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center justify-between px-4 mt-4 bg-white dark:bg-zinc-900 border-y border-slate-100 dark:border-zinc-800 py-1.5">
        {(['checklist', 'welcome', 'relocation', 'team'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
              activeSubTab === tab
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 px-4 mt-3">
        {/* CHECKLIST TAB */}
        {activeSubTab === 'checklist' && (
          <div className="space-y-4">
            {/* Phase Selector Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(['Pre-joining', 'Day 1', 'Week 1', 'Month 1'] as OnboardingPhase[]).map((phase) => {
                const count = tasks.filter(t => t.phase === phase).length;
                const completedCount = tasks.filter(t => t.phase === phase && t.status === 'completed').length;
                const isSelected = selectedPhase === phase;

                return (
                  <button
                    key={phase}
                    onClick={() => setSelectedPhase(phase)}
                    className={`flex-shrink-0 px-3 py-2 rounded-xl text-2xs font-semibold flex items-center gap-1.5 transition-all border ${
                      isSelected
                        ? 'bg-white border-teal-200 text-teal-700 shadow-sm dark:bg-zinc-900 dark:border-teal-900'
                        : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    <span>{phase}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                      isSelected
                        ? 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400'
                        : 'bg-slate-200 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}>
                      {completedCount}/{count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Task List */}
            <div className="space-y-2.5">
              {currentPhaseTasks.map((task) => {
                const isCompleted = task.status === 'completed';

                return (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-emerald-50/40 border-emerald-100 dark:bg-emerald-950/5 dark:border-emerald-900/30'
                        : 'bg-white border-slate-100 dark:bg-zinc-900 dark:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5 text-teal-600 dark:text-teal-400 hover:scale-105 active:scale-95 transition-transform"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950/20" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 hover:text-teal-600" />
                        )}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className={`text-xs font-bold leading-normal ${
                            isCompleted ? 'line-through text-slate-400 dark:text-zinc-500' : 'text-slate-800 dark:text-zinc-200'
                          }`}>
                            {task.title}
                          </h3>
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
                            task.priority === 'High' 
                              ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/30' 
                              : task.priority === 'Medium'
                                ? 'bg-teal-50 text-teal-600 dark:bg-teal-950/30'
                                : 'bg-slate-50 text-slate-500 dark:bg-zinc-800'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className={`text-2xs mt-1 leading-normal ${
                          isCompleted ? 'text-slate-400 dark:text-zinc-500' : 'text-slate-500 dark:text-zinc-400'
                        }`}>
                          {task.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400 dark:text-zinc-500 border-t border-slate-50 dark:border-zinc-800/80 pt-2.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due {task.dueDate}
                          </span>
                          <span className="font-semibold text-slate-600 dark:text-zinc-400">
                            Assignee: {task.assignee}
                          </span>
                        </div>
                        {isCompleted && task.completedDate && (
                          <p className="text-[9px] text-emerald-600 dark:text-emerald-500 font-medium mt-1">
                            Completed on {task.completedDate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Complete Onboarding Button Banner */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm text-center">
              <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                Ready to Join the Team?
              </h4>
              <p className="text-2xs text-slate-400 dark:text-zinc-500 mt-1 max-w-[280px] mx-auto leading-normal">
                Once you are done with the checklists, click below to access the full WorkFlow HRMS employee portal.
              </p>
              <button
                onClick={handleCompleteOnboarding}
                className="w-full mt-3.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl py-2.5 text-xs font-bold shadow-md hover:from-teal-700 hover:to-teal-800 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Complete Onboarding & Enter Home</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* WELCOME MESSAGES TAB */}
        {activeSubTab === 'welcome' && (
          <div className="space-y-4">
            {mockWelcomeMessages.map((msg) => (
              <div 
                key={msg.id} 
                className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100">
                    <img src={msg.senderPhoto} alt={msg.senderName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                      {msg.senderName}
                    </h3>
                    <p className="text-2xs text-slate-400 dark:text-zinc-500">
                      {msg.senderRole}
                    </p>
                  </div>
                  {msg.videoUrl && (
                    <button
                      onClick={() => setPlayingVideo(msg.videoUrl ?? null)}
                      className="ml-auto flex items-center gap-1 px-2.5 py-1.5 bg-orange-500 text-white rounded-lg text-2xs font-semibold shadow-sm hover:bg-orange-600 transition-colors animate-pulse"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Watch Video</span>
                    </button>
                  )}
                </div>
                
                <div className="mt-3 bg-slate-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-slate-50 dark:border-zinc-850">
                  <p className="text-2xs text-slate-600 dark:text-zinc-300 italic leading-relaxed">
                    "{msg.message}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RELOCATION TAB */}
        {activeSubTab === 'relocation' && (
          <div className="space-y-4">
            {/* Relocation Timeline Tracker */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-orange-500" />
                <span>Relocation Tracker</span>
              </h3>
              <p className="text-2xs text-slate-400 dark:text-zinc-500 mt-0.5">
                Real-time tracking of international relocation support.
              </p>

              <div className="relative mt-5 pl-8 border-l border-slate-100 dark:border-zinc-800 space-y-5">
                {/* Step 1: Visa */}
                <div className="relative">
                  <span className={`absolute left-[-42px] top-0 p-1.5 rounded-full ${getStepStyle(mockRelocation.visaStatus, 'Approved')}`}>
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Visa Application</h4>
                    <p className="text-2xs text-slate-400 dark:text-zinc-500 mt-0.5">
                      Status: <span className="font-semibold text-teal-600">{mockRelocation.visaStatus}</span>
                    </p>
                  </div>
                </div>

                {/* Step 2: Flights */}
                <div className="relative">
                  <span className={`absolute left-[-42px] top-0 p-1.5 rounded-full ${getStepStyle(mockRelocation.flightStatus, 'Booked')}`}>
                    <Plane className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Flight Booking</h4>
                    <p className="text-2xs text-slate-400 dark:text-zinc-500 mt-0.5">
                      Status: <span className="font-semibold text-teal-600">{mockRelocation.flightStatus}</span>
                    </p>
                  </div>
                </div>

                {/* Step 3: Accommodation */}
                <div className="relative">
                  <span className={`absolute left-[-42px] top-0 p-1.5 rounded-full ${getStepStyle(mockRelocation.accommodationStatus, 'Booked (Temp)')}`}>
                    <HomeIcon className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Temporary Housing</h4>
                    <p className="text-2xs text-slate-400 dark:text-zinc-500 mt-0.5">
                      Status: <span className="font-semibold text-teal-600">{mockRelocation.accommodationStatus}</span>
                    </p>
                  </div>
                </div>

                {/* Step 4: Allowance */}
                <div className="relative">
                  <span className={`absolute left-[-42px] top-0 p-1.5 rounded-full ${getStepStyle(mockRelocation.allowanceStatus, 'Processed')}`}>
                    <CreditCard className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Settling-in Allowance</h4>
                    <p className="text-2xs text-slate-400 dark:text-zinc-500 mt-0.5">
                      Status: <span className="font-semibold text-teal-600">{mockRelocation.allowanceStatus}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Local Buddy */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-teal-500" />
                <span>Your Relocation Coordinator</span>
              </h3>
              
              <div className="flex items-center gap-3 mt-3.5">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100">
                  <img src={mockRelocation.localBuddy.photo} alt={mockRelocation.localBuddy.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                    {mockRelocation.localBuddy.name}
                  </h4>
                  <p className="text-2xs text-slate-400 dark:text-zinc-500">
                    Global Mobility Specialist
                  </p>
                </div>
                
                <div className="ml-auto flex items-center gap-1.5">
                  <a 
                    href={`tel:${mockRelocation.localBuddy.phone}`}
                    className="p-2 bg-slate-50 dark:bg-zinc-800 text-teal-600 hover:bg-slate-100 rounded-xl border border-slate-100 dark:border-zinc-700/80"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a 
                    href={`mailto:${mockRelocation.localBuddy.email}`}
                    className="p-2 bg-slate-50 dark:bg-zinc-800 text-teal-600 hover:bg-slate-100 rounded-xl border border-slate-100 dark:border-zinc-700/80"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Support Tickets */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-teal-500" />
                  <span>Mobility Tickets</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
                  {mockRelocation.tickets.length} Active
                </span>
              </div>

              <div className="mt-3.5 space-y-2">
                {mockRelocation.tickets.map((t) => (
                  <div key={t.id} className="p-2.5 bg-slate-50 dark:bg-zinc-800/40 rounded-xl border border-slate-50 dark:border-zinc-800/50 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono text-slate-400">{t.id}</span>
                        <span className="text-[9px] font-semibold text-slate-500 dark:text-zinc-400 bg-slate-200 dark:bg-zinc-800 px-1.5 py-0.25 rounded-md">{t.category}</span>
                      </div>
                      <h4 className="text-2xs font-bold text-slate-700 dark:text-zinc-300 mt-1 truncate">
                        {t.subject}
                      </h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold ${
                      t.status === 'Open'
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20'
                        : t.status === 'In Progress'
                          ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/20'
                          : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEAM TAB */}
        {activeSubTab === 'team' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-950/10 dark:to-teal-900/5 p-4 rounded-2xl border border-teal-100/40 dark:border-teal-900/10">
              <h3 className="text-xs font-bold text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                <span>Meet Platform Engineering</span>
              </h3>
              <p className="text-2xs text-teal-600/80 dark:text-teal-400/60 mt-0.5 leading-normal">
                These are the core members of your direct team. Hit them up on Slack when you get your credentials!
              </p>
            </div>

            {mockTeamIntros.map((member) => (
              <div 
                key={member.id}
                className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                      {member.name}
                    </h3>
                    <p className="text-2xs text-teal-600 dark:text-teal-400 font-semibold">
                      {member.role}
                    </p>
                    <p className="text-2xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-50 dark:border-zinc-800 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {member.expertise.map((exp) => (
                      <span key={exp} className="px-1.5 py-0.5 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded text-[9px] font-medium border border-slate-100/50 dark:border-zinc-700/50">
                        {exp}
                      </span>
                    ))}
                  </div>
                  <div className="bg-orange-50/50 dark:bg-orange-950/10 p-2.5 rounded-xl border border-orange-100/30 dark:border-orange-900/10 text-2xs">
                    <span className="font-bold text-orange-600 dark:text-orange-400">Fun Fact: </span>
                    <span className="text-slate-600 dark:text-zinc-450">{member.funFact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {playingVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 rounded-3xl w-full max-w-sm overflow-hidden border border-zinc-800 relative">
            <button 
              onClick={() => setPlayingVideo(null)}
              className="absolute top-3 right-3 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <video 
              src={playingVideo} 
              controls 
              autoPlay 
              className="w-full aspect-video bg-black"
            />
            <div className="p-4 bg-zinc-900/90 text-white">
              <h4 className="text-xs font-bold">Welcome Message from CEO</h4>
              <p className="text-2xs text-zinc-400 mt-1">
                A personal greetings from Elena Rostova, welcoming you to the WorkFlow family.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
