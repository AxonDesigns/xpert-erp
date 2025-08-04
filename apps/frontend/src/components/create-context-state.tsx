import {
	createContext as createContextReact,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from "react";

export function createContext<T>(initialState: T) {
	const Context = createContextReact<T>(initialState);

	function contextHook(errorMessage?: string) {
		const context = useContext(Context);
		if (context === undefined) {
			throw new Error(errorMessage);
		}
		return context;
	}

	const Provider = Context.Provider;

	return {
		contextHook,
		Provider,
	};
}

type DefaultCtx<T> = { state: T; setState: Dispatch<SetStateAction<T>> };
type SchemaFn<T, R> = (state: T, setState: Dispatch<SetStateAction<T>>) => R;

export function createContextState<TValue, TReturn = DefaultCtx<TValue>>({
	defaultValue,
	setValue,
	schema,
}: {
	defaultValue: TValue | (() => TValue);
	setValue?: (value: TValue) => TValue;
	schema?: SchemaFn<TValue, TReturn>;
}) {
	const Context = createContextReact<TReturn | undefined>(undefined);

	function contextHook(errorMessage?: string) {
		const context = useContext(Context);
		if (context === undefined) {
			throw new Error(errorMessage);
		}
		return context;
	}

	const Provider = ({ children }: { children: ReactNode }) => {
		const [valueState, _setValueState] = useState<TValue>(defaultValue);

		const setValueState = (newValue: SetStateAction<TValue>) => {
			if (typeof newValue === "function") {
				//console.log("setValueState Function", newValue);
				// @ts-ignore
				const nextValue = newValue(valueState);
				_setValueState((prev) => {
					setValue?.(prev);
					// @ts-ignore
					return newValue(prev);
				});
			} else {
				//console.log("setValueState Value", newValue);
				setValue?.(newValue);
				_setValueState(newValue);
			}
		};

		return (
			<Context.Provider
				value={
					(schema?.(valueState, setValueState) || {
						state: valueState,
						setState: setValueState,
					}) as unknown as TReturn
				}
			>
				{children}
			</Context.Provider>
		);
	};

	return {
		contextHook,
		Provider,
	};
}
