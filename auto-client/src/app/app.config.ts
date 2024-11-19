import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, withComponentInputBinding, withEnabledBlockingInitialNavigation } from '@angular/router';
import { routes } from './app.routes';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes,
      withHashLocation(), // Replaces useHash: true
      withEnabledBlockingInitialNavigation(), // Sets sameUrlNavigation: 'reload'
      withComponentInputBinding(),

    ),
     
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([loadingInterceptor])), provideClientHydration(),
    // Configure AgmCoreModule with forRoot
    // Spread the providers safely

    // ...(AgmCoreModule.forRoot().providers || []): This spreads the providers array into the main providers list. 
    // If providers is undefined, it falls back to an empty array [], which is valid.
    // This ensures that the configuration will work without throwing a type error when providers is undefined

   
  ], 

};


