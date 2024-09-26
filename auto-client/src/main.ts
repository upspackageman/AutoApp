import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
// import { AdminComponent } from './app/admin/admin.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


  // bootstrapApplication(AdminComponent, appConfig)
  // .catch((err) => console.error(err));
