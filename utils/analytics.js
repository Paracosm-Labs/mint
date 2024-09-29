import * as amplitude from '@amplitude/analytics-browser';

let amplitudeInstance = null;

export function initializeAmplitude() {
  if (!amplitudeInstance) {
    amplitudeInstance = amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_ANALYTICS, undefined, {
      defaultTracking: {
        pageViews: true, // Automatically track page views
      },
    });

    // Attempt to set the cookie
    try {
      document.cookie = "AMP_234b49b7b0=value; path=/"; // Attempt to set cookie
    } catch (error) {
      // Fallback to local storage if cookie setting fails
      localStorage.setItem("AMP_234b49b7b0", "value");
      console.warn("Cookie could not be set, using local storage instead.");
    }
  }
  return amplitudeInstance;
}

export function logEvent(eventName, eventProperties) {
  amplitude.track(eventName, eventProperties);
}
