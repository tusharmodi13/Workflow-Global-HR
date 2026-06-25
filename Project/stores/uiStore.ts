import { create } from "zustand";

export type Role = 'Employee' | 'Manager' | 'HR' | 'Admin';

type UiState = {
	isSidebarOpen: boolean;
	openSidebar: () => void;
	closeSidebar: () => void;
	toggleSidebar: () => void;
	
	// Role and Tab navigation state
	activeRole: Role;
	activeTab: string;
	isOnboardingActive: boolean;
	setRole: (role: Role) => void;
	setTab: (tab: string) => void;
	setOnboardingActive: (active: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
	isSidebarOpen: false,
	openSidebar: () => set({ isSidebarOpen: true }),
	closeSidebar: () => set({ isSidebarOpen: false }),
	toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
	
	// Default starting states
	activeRole: 'Employee',
	activeTab: 'Home',
	isOnboardingActive: true,
	
	setRole: (role) => set({ activeRole: role, activeTab: 'Home' }),
	setTab: (tab) => set({ activeTab: tab }),
	setOnboardingActive: (active) => set({ isOnboardingActive: active }),
}));
