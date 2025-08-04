import { createContextState } from "@frontend/components/create-context-state";

const LOCAL_STORAGE_KEY = "sidebar-open";

export const { Provider: SidebarProvider, contextHook: useSidebar } =
	createContextState({
		defaultValue: () => {
			const open = localStorage.getItem(LOCAL_STORAGE_KEY);
			if (open === null) {
				localStorage.setItem(LOCAL_STORAGE_KEY, "true");
				return true;
			}
			return open === "true";
		},
		setValue: (value) => {
			localStorage.setItem(LOCAL_STORAGE_KEY, value ? "true" : "false");
			return value;
		},
		schema: (state, setState) => ({
			setIsOpen: setState,
			isOpen: state,
		}),
	});
