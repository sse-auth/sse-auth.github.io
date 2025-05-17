interface Zaraz {
  track(eventName: string, properties?: Record<string, any>): void;
}

interface Window {
  zaraz?: Zaraz;
}
