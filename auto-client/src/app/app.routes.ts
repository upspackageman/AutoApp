import { Routes } from '@angular/router';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { HomeComponent } from './home/home.component';
import { CarseatinspectionComponent } from './carseatinspection/carseatinspection.component';
import { InvestigationComponent } from './investigation/investigation.component';
import { RssComponent } from './rss/rss.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { authGuard } from './guards/auth.guard';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
//
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'vehicles', component: VehiclesComponent },
  { path: 'carseat', component: CarseatinspectionComponent },
  { path: 'investigation', component: InvestigationComponent},
  { path: 'adminlogin', component: LoginComponent},
  { path: 'admin', component: AdminComponent,canActivate:[authGuard]},
  { path: 'rss', component: RssComponent},
  {path:'terms', component:TermsComponent},
  {path:'privacy', component:PrivacyComponent}
];
