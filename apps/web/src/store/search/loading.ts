import { create } from "zustand";

type SearchLoading = {
	loading: boolean;
	toggleLoading: (prop: boolean) => void;
};

export const useSearchLoading = create<SearchLoading>((set) => ({
	loading: false,
	toggleLoading(prop) {
		set({
			loading: prop,
		});
	},
}));
