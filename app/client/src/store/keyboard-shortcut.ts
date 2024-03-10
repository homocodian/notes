import { create } from "zustand";

type KeyboardShortcutState = {
	open: boolean;
	openModal: () => void;
	closeModal: () => void;
	toggleModal: () => void;
};

export const useKeyboardShortcutStore = create<KeyboardShortcutState>(
	(set) => ({
		open: false,
		openModal() {
			set({ open: true });
		},
		closeModal() {
			set({ open: false });
		},
		toggleModal() {
			set((state) => ({
				open: !state.open,
			}));
		},
	})
);
