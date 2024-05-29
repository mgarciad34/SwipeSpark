import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [

    provideRouter(
    routes,
    withViewTransitions(
    {

    }
    ),
    ),

    importProvidersFrom
    (
      HttpClientModule
    )

  ]
};
