export function PromiseBuilder<T>(
  promise: Promise<T>,
  onResolve: (value: T) => void,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onReject: (reason: any) => void,
  onLoading?: () => void,
) {
  promise.then(onResolve).catch(onReject);
}