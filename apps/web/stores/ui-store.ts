import { create } from "zustand";

interface UIState {
  /* Sidebar */
  sidebarOpen:     boolean;
  setSidebarOpen:  (open: boolean) => void;
  toggleSidebar:   () => void;

  /* Command palette */
  commandOpen:     boolean;
  setCommandOpen:  (open: boolean) => void;
  toggleCommand:   () => void;

  /* Mobile nav */
  mobileNavOpen:   boolean;
  setMobileNavOpen:(open: boolean) => void;

  /* Active modals/drawers */
  activeModal:     string | null;
  openModal:       (id: string) => void;
  closeModal:      () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen:    true,
  setSidebarOpen: (open)  => set({ sidebarOpen: open }),
  toggleSidebar:  ()      => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  commandOpen:    false,
  setCommandOpen: (open)  => set({ commandOpen: open }),
  toggleCommand:  ()      => set((s) => ({ commandOpen: !s.commandOpen })),

  mobileNavOpen:    false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

  activeModal:  null,
  openModal:    (id)   => set({ activeModal: id }),
  closeModal:   ()     => set({ activeModal: null }),
}));
