export interface OnboardingEmployee {
  name: string;
  designation: string;
  department: string;
  manager: {
    name: string;
    role: string;
    photo: string;
  };
  buddy: {
    name: string;
    role: string;
    photo: string;
  };
  joiningDate: string;
}

export type OnboardingPhase = 'Pre-joining' | 'Day 1' | 'Week 1' | 'Month 1';

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  phase: OnboardingPhase;
  status: 'completed' | 'pending';
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  assignee: string;
  completedDate?: string;
}

export interface WelcomeMessage {
  id: string;
  senderName: string;
  senderRole: string;
  senderPhoto: string;
  message: string;
  videoUrl?: string;
}

export interface RelocationSupport {
  visaStatus: 'Not Started' | 'In Progress' | 'Approved' | 'Completed';
  flightStatus: 'Not Booked' | 'Booked' | 'Completed';
  accommodationStatus: 'Searching' | 'Booked (Temp)' | 'Completed';
  allowanceStatus: 'Pending' | 'Processed' | 'Paid';
  localBuddy: {
    name: string;
    phone: string;
    email: string;
    photo: string;
  };
  tickets: Array<{
    id: string;
    subject: string;
    status: 'Open' | 'In Progress' | 'Resolved';
    category: string;
  }>;
}

export interface TeamIntroduction {
  id: string;
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  funFact: string;
  photo: string;
}

export interface OnboardingMilestone {
  id: string;
  title: string;
  daysOffset: number;
  status: 'completed' | 'pending';
  scheduledDate: string;
  description: string;
}

// Actual Mock Data
export const mockEmployee: OnboardingEmployee = {
  name: "Sarah Jenkins",
  designation: "Senior Cloud Engineer",
  department: "Platform Engineering",
  manager: {
    name: "Marcus Aurelius",
    role: "Engineering Director",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
  },
  buddy: {
    name: "Alex Rivera",
    role: "Senior Developer (Buddy)",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"
  },
  joiningDate: "2026-07-01",
};

export const initialOnboardingTasks: OnboardingTask[] = [
  // Pre-joining
  {
    id: "pre-1",
    title: "Sign Offer Letter & Contract",
    description: "Review and digitally sign the employment agreement sent via DocuSign.",
    phase: "Pre-joining",
    status: "completed",
    dueDate: "2026-06-20",
    priority: "High",
    assignee: "Employee (Self)",
    completedDate: "2026-06-19"
  },
  {
    id: "pre-2",
    title: "Submit Tax & Bank Details",
    description: "Provide tax declaration forms and bank routing details for payroll setup.",
    phase: "Pre-joining",
    status: "pending",
    dueDate: "2026-06-28",
    priority: "High",
    assignee: "Employee (Self)"
  },
  {
    id: "pre-3",
    title: "Hardware Preferences Survey",
    description: "Select your preferred laptop (MacBook Pro vs ThinkPad) and monitor accessories.",
    phase: "Pre-joining",
    status: "completed",
    dueDate: "2026-06-25",
    priority: "Medium",
    assignee: "Employee (Self)",
    completedDate: "2026-06-24"
  },
  // Day 1
  {
    id: "day-1",
    title: "IT Setup & Credentials Provisioning",
    description: "Collect your laptop, configure SSO accounts, and setup security keys.",
    phase: "Day 1",
    status: "pending",
    dueDate: "2026-07-01",
    priority: "High",
    assignee: "IT Ops Team"
  },
  {
    id: "day-2",
    title: "Onboarding Kick-off & HR Briefing",
    description: "Meet your HR partner and run through benefits, insurance, and company culture overview.",
    phase: "Day 1",
    status: "pending",
    dueDate: "2026-07-01",
    priority: "High",
    assignee: "HR Operations"
  },
  {
    id: "day-3",
    title: "Team Lunch with Buddy",
    description: "Casual lunch with Alex Rivera (Buddy) and team members to say hello.",
    phase: "Day 1",
    status: "pending",
    dueDate: "2026-07-01",
    priority: "Low",
    assignee: "Onboarding Buddy"
  },
  // Week 1
  {
    id: "week-1",
    title: "1-on-1 with Reporting Manager",
    description: "Establish working agreements, discuss team mission, and clarify first 30-day goals.",
    phase: "Week 1",
    status: "pending",
    dueDate: "2026-07-05",
    priority: "High",
    assignee: "Marcus Aurelius"
  },
  {
    id: "week-2",
    title: "Security & Compliance Training",
    description: "Complete the mandatory SOC2 and GDPR compliance courses in the Learning Hub.",
    phase: "Week 1",
    status: "pending",
    dueDate: "2026-07-07",
    priority: "High",
    assignee: "Employee (Self)"
  },
  // Month 1
  {
    id: "month-1",
    title: "First Code Contribution",
    description: "Clone the repo, fix a minor bug or add a simple component, and submit a pull request.",
    phase: "Month 1",
    status: "pending",
    dueDate: "2026-07-25",
    priority: "Medium",
    assignee: "Employee (Self)"
  },
  {
    id: "month-2",
    title: "30-Day Check-in Feedback Survey",
    description: "Provide feedback on your recruitment and onboarding experience to the HR team.",
    phase: "Month 1",
    status: "pending",
    dueDate: "2026-07-31",
    priority: "Low",
    assignee: "Employee (Self)"
  }
];

export const mockWelcomeMessages: WelcomeMessage[] = [
  {
    id: "wm-1",
    senderName: "Elena Rostova",
    senderRole: "Chief Executive Officer",
    senderPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    message: "Welcome to WorkFlow, Sarah! We're building the future of enterprise software, and your expertise in cloud platforms will be pivotal. I hope your onboarding is smooth and productive. Let's make a dent in the universe together!",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    id: "wm-2",
    senderName: "Marcus Aurelius",
    senderRole: "Engineering Director",
    senderPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    message: "Hey Sarah! Really excited to have you join our Platform Engineering group. We've got a lot of cool challenges ahead with scaling our Kubernetes meshes. Your background is exactly what we need. Rest up, day one is going to be fun!",
  },
  {
    id: "wm-3",
    senderName: "Alex Rivera",
    senderRole: "Onboarding Buddy",
    senderPhoto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    message: "Hi Sarah! I'll be your onboarding buddy. I will help you set up dev environments, answer any random questions about codebases or which coffee machine is best. Hit me up on Slack anytime!",
  }
];

export const mockRelocation: RelocationSupport = {
  visaStatus: "Approved",
  flightStatus: "Booked",
  accommodationStatus: "Booked (Temp)",
  allowanceStatus: "Processed",
  localBuddy: {
    name: "Elena Petrova",
    phone: "+1 (555) 019-2834",
    email: "elena.p@workflow.com",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"
  },
  tickets: [
    {
      id: "REL-101",
      subject: "Temporary Housing Extension Request",
      status: "In Progress",
      category: "Accommodation"
    },
    {
      id: "REL-102",
      subject: "Relocation Lump Sum Payout Confirmation",
      status: "Resolved",
      category: "Finance"
    }
  ]
};

export const mockTeamIntros: TeamIntroduction[] = [
  {
    id: "t-1",
    name: "Devon Lane",
    role: "Principal Architect",
    bio: "Ex-Netflix, cloud infrastructure geek. Love optimizing database queries and custom Kubernetes operators.",
    expertise: ["AWS", "Kubernetes", "Go", "Distributed Systems"],
    funFact: "Has climbed 4 of the 7 Summits and plays classical violin.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    id: "t-2",
    name: "Arlene McCoy",
    role: "Senior Frontend Lead",
    bio: "Passionate about user experience, CSS grids, and design systems. Keeps code clean and developers happy.",
    expertise: ["React", "TypeScript", "TailwindCSS", "A11y"],
    funFact: "Has a collection of over 80 board games and brews her own craft beer.",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  },
  {
    id: "t-3",
    name: "Albert Flores",
    role: "DevOps Engineer",
    bio: "Terraform enthusiast, CI/CD wizard, automation fanatic. Believes if you do it twice, script it.",
    expertise: ["Terraform", "GitHub Actions", "Docker", "Python"],
    funFact: "Speaks 4 languages fluently and was once an extra in a major movie.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
  }
];

export const mockMilestones: OnboardingMilestone[] = [
  {
    id: "ms-1",
    title: "Pre-joining Ready",
    daysOffset: -1,
    status: "pending",
    scheduledDate: "2026-06-30",
    description: "Complete all pre-joining tasks, contracts signed, hardware selected."
  },
  {
    id: "ms-2",
    title: "Day 1 Complete",
    daysOffset: 1,
    status: "pending",
    scheduledDate: "2026-07-01",
    description: "IT setup complete, login details active, team briefing finished."
  },
  {
    id: "ms-3",
    title: "First Week Check-in",
    daysOffset: 7,
    status: "pending",
    scheduledDate: "2026-07-08",
    description: "Initial 1-on-1 with manager, dev environment working, target metrics defined."
  },
  {
    id: "ms-4",
    title: "30-Day Evaluation",
    daysOffset: 30,
    status: "pending",
    scheduledDate: "2026-07-31",
    description: "Onboarding milestone review, feedback survey complete, first PR merged."
  }
];
