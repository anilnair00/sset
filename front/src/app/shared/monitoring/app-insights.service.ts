import { Injectable } from '@angular/core';
import { AppInsights } from 'applicationinsights-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppInsightsService {
  constructor() {
    if (environment.appInsightsInstrumentationKey) {
      AppInsights.downloadAndSetup({
        instrumentationKey: environment.appInsightsInstrumentationKey,
        disableTelemetry: environment.disableAppInsights
      });
    }
  }

  public logEvent(
    name: string,
    properties?: { [key: string]: string },
    measurements?: { [key: string]: number }
  ): void {
    AppInsights.trackEvent(name, properties, measurements);
  }
}
