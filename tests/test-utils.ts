export async function nextEventLoop(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 0));
}
