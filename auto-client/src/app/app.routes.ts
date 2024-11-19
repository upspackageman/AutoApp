import { Routes, RouterModule, PreloadingStrategy, Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { authGuard } from './guards/auth.guard';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { CookiepolicyComponent } from './cookiepolicy/cookiepolicy.component';
import { Observable, of } from 'rxjs';

class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Use 'preload' from route data to decide whether to load or not
    return route.data && route.data['preload'] ? load() : of(null);
  }
}

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  
  // Lazy-loaded routes with custom preload condition
  { 
    path: 'vehicles', 
    loadChildren: () => import('./vehicles/vehicles.module').then(m => m.VehiclesModule),
    data: { preload: true } // Will be preloaded
  },
  { 
    path: 'carseat', 
    loadChildren: () => import('./carseatinspection/carseatinspection.module').then(m => m.CarseatinspectionModule),
    data: { preload: false } // Will not be preloaded
  },
  { 
    path: 'investigation', 
    loadChildren: () => import('./investigation/investigation.module').then(m => m.InvestigationModule),
    data: { preload: true } // Will be preloaded
  },

  // Regular routes
  { path: 'adminlogin', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  
  // Static routes
  { path: 'terms', component: TermsComponent },
  { path: 'policy', component: CookiepolicyComponent },
  { path: 'privacy', component: PrivacyComponent }
];

// Enable Preloading for lazy-loaded modules using custom strategy
export const routing = RouterModule.forRoot(routes, { preloadingStrategy: CustomPreloadingStrategy });
