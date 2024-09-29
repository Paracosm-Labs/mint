// utils/analytics.js
import * as amplitude from '@amplitude/analytics-browser';

let amplitudeInstance = null;

export function getAmplitudeInstance() {
  return amplitudeInstance;
}

export function initializeAmplitude() {
  if (!amplitudeInstance) {
    amplitudeInstance = amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_ANALYTICS, undefined, {
      defaultTracking: {
        pageViews: true, // Automatically track page views
      },
    });
  }
}


export function logEvent(eventName, eventProperties) {
  amplitude.track(eventName, eventProperties);
}
