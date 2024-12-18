import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclesComponent } from './vehicles.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: VehiclesComponent }
    ])
  ]
})
export class VehiclesModule { }
