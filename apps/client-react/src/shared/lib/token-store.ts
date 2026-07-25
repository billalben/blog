let accessToken: string | null = null;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

export const tokenStore = {
  get(): string | null {
    return accessToken;
  },
  set(token: string) {
    accessToken = token;
    notify();
  },
  clear() {
    accessToken = null;
    notify();
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
