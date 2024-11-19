import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarseatinspectionComponent } from './carseatinspection.component';  // Corrected import
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CarseatinspectionComponent }
    ])
  ]
})
export class CarseatinspectionModule { }
