import { Component, TemplateRef, inject, signal } from '@angular/core';
import { NhtsaService } from '../_services/nhtsa.service';
import {
  CarInspectionZip,
  Results as ZipResults,
} from '../_models/carInspectionZip';
import {
  CarInspectionState,
  Results as StateResults,
} from '../_models/carInspectionState';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogRef  } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BusyService } from '../_services/busy.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-carseatinspection',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './carseatinspection.component.html',
  styleUrl: './carseatinspection.component.css',
})
export class CarseatinspectionComponent {
  currentZip: any = '';
  zipInit = false;
  zipList: any;
  errorMessage: string | null = null;
  init: boolean = true;
  readonly panelOpenState = signal(false);
  carInspectionZip: ZipResults[] = [];
  carInspectionState: StateResults[] = [];
  sanitizer:any;
  orgName:string ='';
  locationLastUpdate:any;
  mapUrl: string = '';
  allZip: number = 0;
  states: string[] = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
  ];
private dialogRef: MatDialogRef<any> | null = null;
  constructor(private nhtsaService: NhtsaService, public dialog: MatDialog,private _sanitizer: DomSanitizer) {
    this.sanitizer =_sanitizer;
  }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }


  closeMapDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();  // Close the dialog using the stored reference
      this.dialogRef = null;   // Optionally reset the reference
    }
  }

  unZipInit() {
    if (this.zipInit === false) {
      this.zipInit = true;
    }
  }

  busyService = inject(BusyService);

  

  closeMapTab(){
    const list = document.querySelector('.map-location') as HTMLElement;
    list.style.width='0px';
    list.style.display='none';
  }

  mapTab(address:any, lastUpdated:Date, org:string){
    const date = new Date(lastUpdated);
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
    this.locationLastUpdate = formattedDate;
    this.orgName = org;
    this.mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(`${address}`)}&hl=es;z=14&output=embed`;
    const list = document.querySelector('.map-location') as HTMLElement;
    list.style.width='700px';
    list.style.display='inline';
  }

  locationModal(address:any, lastUpdated:Date, org:string, templateRef: TemplateRef<any>) {
    const date = new Date(lastUpdated);
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
    this.locationLastUpdate = formattedDate;
    this.orgName = org;
    this.mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(`${address}`)}&hl=es;z=14&output=embed`;
    this.dialogRef = this.dialog.open(templateRef, {
      width: '100%',
      height: '98%',
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'custom-modal',
    });
  }

  getStateListModal(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '100%',
      height: '98%',
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'custom-modal',
    });

    const url =
      'https://images.unsplash.com/photo-1501300140941-6c556d26c1b9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzh8fHZlaGljbGV8ZW58MHx8MHx8fDA%3D';
    const dialogContainer = document.querySelector(
      '.custom-modal .mat-mdc-dialog-surface'
    ) as HTMLElement;
    dialogContainer.style.borderRadius = '.15rem'; // Apply your custom styles here
    dialogContainer.style.backgroundImage = `linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.77)), url('${url}')`;
    dialogContainer.style.backgroundSize = 'cover'; // Ensure the image covers the entire area
    dialogContainer.style.backgroundPosition = 'center';
  }

  
  carSeatInspectionLocatorByState(state: any) {
    document.getElementById('by-state')?.scrollTo(0, 0);
    this.carInspectionZip = [];
    this.nhtsaService.carSeatInspectionLocatorByState(state).subscribe(
      (data: CarInspectionState) => {
       
        this.carInspectionState = data.Results;
        let item: any = this.carInspectionState;
        item = item.map((x: { Zip: any }) => x.Zip);
        item = Array.from(new Set(item));
        item = item.filter((x: { length: number; Zip: any }) => x?.length > 4);

        for (let i = 0; i < item.length; i++) {
          if (item[i] === 'All i') {
            item.splice(i, 1); // Remove the item at index i
            i--;
          }
        }

        this.zipList = item
          .map((str: any) => Number(str)) // Convert to number
          .sort((a: number, b: number) => a - b)
          .filter((str: any) => {
            const num = Number(str);
            return !isNaN(num); // Keep only valid numbers
          }) // Sort numerically
          .map((num: { toString: () => any }) => num.toString());
      },
      (error) => {
        this.errorMessage = 'Error fetching vehicle data';
        console.error(error);
      }
    );
  }

  carSeatInspectionLocatorByZip(zip: any) {
    document.getElementById('by-zip')?.scrollTo(0, 0);
    if (zip == 999) {
      this.allZip = 1;
    }
    //this.carInspectionState=[];
    //this.carInspectionZip =[];
    this.nhtsaService.carSeatInspectionLocatorByZip(zip).subscribe(
      (data: CarInspectionZip) => {
        this.init = false;
        this.carInspectionZip = data.Results;
        this.currentZip = zip;
      },
      (error) => {
        this.errorMessage = 'Error fetching vehicle data';
        console.error(error);
      }
    );
  }
}
