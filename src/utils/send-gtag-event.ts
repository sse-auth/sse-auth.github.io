export default function sendGtagEvent(eventName: string, properties?: Record<string, any>) {
  if (window.zaraz) {
    window.zaraz.track(eventName, properties);
  }
}
