import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestigationComponent } from './investigation.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: InvestigationComponent }
    ])
  ]
})
export class InvestigationModule { }
