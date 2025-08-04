import { useEffect, useState } from "react";

export function useIsMobile({
	breakpoint = 768,
	onChange,
}: {
	breakpoint?: number;
	onChange?: (isMobile: boolean) => void;
} = {}) {
	const [isMobile, setIsMobile] = useState<boolean | undefined>();

	useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

		const onQueryChange = () => {
			setIsMobile(window.innerWidth < breakpoint);
			onChange?.(window.innerWidth < breakpoint);
		};

		mql.addEventListener("change", onQueryChange);

		setIsMobile(window.innerWidth < breakpoint);

		return () => {
			mql.removeEventListener("change", onQueryChange);
		};
	}, [breakpoint]);

	return !!isMobile;
}
