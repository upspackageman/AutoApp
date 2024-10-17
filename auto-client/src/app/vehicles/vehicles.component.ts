import {
  Component,
  ElementRef,
  inject,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NhtsaService } from '../_services/nhtsa.service';
import {
  VehicleByYear,
  Results as VehicleByYearResults,
} from '../_models/vehicleByYear';
import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';
import {
  VehicleModel,
  Results as VehicleModelResults,
} from '../_models/vehicleModel';
import {
  VehicleCrashRatingId,
  Results as VehicleCrashRatingIdResults,
} from '../_models/vehicleCrashRatingId';
import { Recall, Results as RecallResults } from '../_models/recall';
import { Complaint, Product } from '../_models/complaint';
import { CarInspectionZip } from '../_models/carInspectionZip';
import { CarInspectionState } from '../_models/carInspectionState';
import {
  VehicleCrashRating,
  Results as VehicleCrashRatingResult,
} from '../_models/vehicleCrashRating';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
//import { VehiclemodalComponent } from '../modals/vehiclemodal/vehiclemodal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { ComplaintDetail } from '../_models/complaintDetail';
import { RecallDetail } from '../_models/recallDetail';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BusyService } from '../_services/busy.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatGridListModule,
    MatProgressBarModule,
    MatMenuModule
  ],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css',
  encapsulation: ViewEncapsulation.None, // Disable view encapsulation
})
export class VehiclesComponent {
  years: any[] = [];
  vehicleByYears: VehicleByYearResults[] = [];
  vehicleModels: VehicleModelResults[] = [];
  vehicleCrashRatingId: VehicleCrashRatingIdResults[] = [];
  recalls: RecallResults[]=[];
  complaints: Product[] = [];
  carInspectionZip: CarInspectionZip[] = [];
  carInspectionState: CarInspectionState[] = [];
  vehicleCrashRating: VehicleCrashRatingResult[] = [];
  busyService = inject(BusyService);
  @ViewChild('videoPlayer') videoPlayer: ElementRef<HTMLVideoElement> | undefined;
  dialogRef: MatDialogRef<any> | undefined;
  errorMessage: string | null = null;
  vehicleImage: string | null = null;
  vehiceDescription: string | null = null;
  vehicleNumberOfComplaints: any | undefined;
  vehicleOverallRating: any | undefined;
  overallFrontCrashRating: any | undefined;
  complaintDetails: ComplaintDetail[] | undefined;
  recallDetails: RecallDetail[] =[];
  mainElement: HTMLElement | null | undefined;
  videoLink: any = '';
  vidInit: boolean = true;
  vidLinkValid: boolean = true;
  crashHeader:string='';
  frontCrash:boolean=false;
  sideCrash:boolean=false;
  sidePoleCrash:boolean=false;
  complaintText:boolean =false;
  recallText:boolean=false;
  complaintComponents:any[]=[];
  recallComponents:any[]=[];
  filteredComplaintComponents:any[]=[];
  selectedComplaintComponents:any='';
  filteredRecallComponents:any[]=[];
  selectedRecallComponents:any='';
  activeTabIndex:any=0;



  constructor(
    private nhtsaService: NhtsaService,
    public dialog: MatDialog,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to the observable returned by the service method
    
    this.getYears();
    this.getVehicleCrashRatingId(2021, 'TESLA', 'Model 3');
    this.getRecalls(2021, 'TESLA', 'Model 3');
    this.getComplaints(2021, 'TESLA', 'Model 3');
    
  }


  redirect() {
    if (!localStorage.getItem('direct_detail')) {
      localStorage.setItem('direct_detail', 'not reload');
      const currentUrl = this.router.url;

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    } 
    else {
      localStorage.removeItem('direct_detail');
    }
  }


  getBackgroundImage(imageUrl: string | undefined) {
    const altImage='https://static.nhtsa.gov/crashTest/images/2021/v10384P105.jpg';
    
    if (imageUrl) {
      return {
        'background-image': `linear-gradient(45deg, rgb(103 97 145 / 65%) 50%, rgb(219 63 63 / 52%) 100%), url(${imageUrl})`,
        'background-size': 'cover',
        'background-repeat': 'no-repeat'
      };
    }
    else{
      return {
        'background-image': `linear-gradient(45deg, rgb(103 97 145 / 65%) 50%, rgb(219 63 63 / 52%) 100%), url(${altImage})`,
        'background-size': 'cover',
        'background-repeat': 'no-repeat'
      };
    }
    
  }

  async loadCrashVideo( crashType:number,image: string) {
    this.videoLink = null;
    this.frontCrash=false;
    this.sideCrash=false;
    this.sidePoleCrash=false;
    if (this.vidInit === true) {
      this.vidInit = false;
    }
    if(crashType===1){
      this.frontCrash=true;
    }
    if(crashType===2){
      this.sideCrash=true;
    }
    if(crashType===3){
      this.sidePoleCrash=true;
    }
    
    (await this.nhtsaService.getVideoPlayback(image)).subscribe((objectUrl) => {


      this.cdr.detectChanges();

    
      this.videoLink = objectUrl;

    
    });

    this.videoPlayer?.nativeElement.load();
  }

  loadVehicleInfo(vehicle: any) {
    this.vehiceDescription = null;
    const year = vehicle.value.ModelYear;
    const make = vehicle.value.Make;
    const model = vehicle.value.Model;
    this.selectedComplaintComponents ='';
    this.selectedRecallComponents='';
    this.filteredComplaintComponents=[];
    this.filteredRecallComponents=[];
    this.videoLink = '';
    this.vidInit = true;
    
    this.getComplaints(year, make, model);
    this.getRecalls(year, make, model);
    this.getVehicleCrashRatingId(year, make, model);
    this.activeTabIndex=0;
    // document.getElementById('mat-tab-label-0-0')?.click();
    // document.getElementById('mat-tab-label-0-0')?.click();

    this.closeDialog();
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  getOverviewDetailsModal(templateRef: TemplateRef<any>) {
    this.vehicleDetailsModal(templateRef);
  }

  getRecallDetailsModal(id: any, templateRef: TemplateRef<any>) {
    const recall = this.recalls;
    
    const foundItem = recall?.find((item) => item?.NHTSACampaignNumber === id);
    if (foundItem) {
      this.recallDetails = [foundItem].map((item) => item); // Wrap foundItem in an array to use map
      this.vehicleDetailsModal(templateRef);
    }
  }

  getVideoCrashModal(crashType:number, header:string, image: string, templateRef: TemplateRef<any>) {
    
    this.crashHeader = header;
    this.crashModal(templateRef);
    this.loadCrashVideo(crashType, image);

    
    const dialogContainer = document.querySelector(
      '.crash-vehicle-details .mat-mdc-dialog-surface'
    ) as HTMLElement;

    dialogContainer.style.borderRadius = '.25rem'; // Apply your custom styles here
    
  }

  crashModal(templateRef: TemplateRef<any>){
    this.dialog.open(templateRef, {
      width: '200%',
      height: '98%',
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'crash-vehicle-details'
    });

    
  }

  getComplaintDetailsModal(id: any, templateRef: TemplateRef<any>) {
    const complaint = this.complaints;
    const foundItem = complaint.filter((item) => id === item.odiNumber);
    if (foundItem) {
      this.complaintDetails = foundItem.map((item) => item); // Wrap foundItem in an array to use map
      this.vehicleDetailsModal(templateRef);
    } 
  }

  

  vehicleDetailsModal(templateRef: TemplateRef<any>): void {
    this.dialog.open(templateRef, {
      width: '200%',
      height: '98%',
      hasBackdrop: true,
      disableClose: false,

      panelClass: 'custom-vehicle-details',
    });
    const url =
      'https://images.unsplash.com/photo-1501300140941-6c556d26c1b9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzh8fHZlaGljbGV8ZW58MHx8MHx8fDA%3D';
    const dialogContainer = document.querySelector(
      '.custom-vehicle-details .mat-mdc-dialog-surface'
    ) as HTMLElement;
    dialogContainer.style.borderRadius = '.25rem'; // Apply your custom styles here
    dialogContainer.style.backgroundImage = `linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.97)), url('${url}')`;
    dialogContainer.style.backgroundSize = 'cover'; // Ensure the image covers the entire area
    dialogContainer.style.backgroundPosition = 'center';
  }

  findVehicleModal(templateRef: TemplateRef<any>): void {
    this.dialog.open(templateRef, {
      width: '550px',
      hasBackdrop: true,
      disableClose: false,
    });
  }

  getVehicleCrashRating(id: any) {
    this.nhtsaService.getVehicleCrashRating(id).subscribe(
      (data: VehicleCrashRating) => {
        this.vehicleCrashRating = data.Results;
        this.vehicleImage = this.vehicleCrashRating[0].VehiclePicture;
        this.vehiceDescription = this.vehicleCrashRating[0].VehicleDescription;
        this.vehicleNumberOfComplaints =
          this.vehicleCrashRating[0].ComplaintsCount;
        this.vehicleOverallRating = this.vehicleCrashRating[0].OverallRating;
      },
      (error) => {
        this.errorMessage = 'Error fetching vehicle data';
        console.error(error);
      }
    );
  }

  getRecallDetails(id: any) {
    const recall = this.recalls;
    this.recallText=false;
    this.cdr.detectChanges();

    const foundItem = recall?.find((item) => item?.NHTSACampaignNumber === id);
    if (foundItem) {
      this.recallDetails=[];
      this.cdr.detectChanges();
      this.recallDetails = [foundItem].map((item) => item); // Wrap foundItem in an array to use map
      this.recallText=true;
    }
  }

  getComplaintDetails(id: any) {
    const complaint = this.complaints;
    this.complaintText = false;
    this.cdr.detectChanges();
    const foundItem = complaint.filter((item) => id === item.odiNumber);
    
    if (foundItem) {
     
      this.complaintDetails =[];
      this.cdr.detectChanges();
      this.complaintDetails = foundItem.map((item) => item); // Wrap foundItem in an array to use map
      this.complaintText = true;
    }
  }

  filterComplaintsByComponents(val:any){
    this.filteredComplaintComponents=[];
    this.selectedComplaintComponents=val;
    this.cdr.detectChanges();
    const check = this.complaints;
    if(val===''){
      return;
    }
    this.filteredComplaintComponents = check.filter(item => 
      item.components.includes(val) // Access the correct property
    );
  }

  getComplaints(year: any, make: any, model: any) {
    this.complaints = [];
    this.complaintComponents =[];
    this.nhtsaService.getComplaints(year, make, model).subscribe(
      (data: Complaint) => {
        this.complaints = data.results;
        this.complaintComponents = data.results;
        this.getComplaintDetails(this.complaintComponents[0].odiNumber);
        this.complaintComponents =  Array.from(new Set(this.complaintComponents.flat().map(item => item.components))).sort();
       
        this.complaintComponents = this.complaintComponents.flatMap(item => item.split(','));
        this.complaintComponents =  Array.from(new Set(this.complaintComponents));
        this.complaintComponents = this.complaintComponents.sort();

        this.complaints.sort((a, b) => {
          const dateA: any = new Date(a.dateComplaintFiled);
          const dateB: any = new Date(b.dateComplaintFiled);
          return dateB - dateA;
        });
       
      },
      (error) => {
        this.errorMessage = 'Error fetching vehicle data';
        console.error(error);
      }
    );
  }

  filterRecallsByComponents(val:any){
    this.selectedRecallComponents=val;
    this.filteredRecallComponents=[];
    const check = this.recalls;
    this.cdr.detectChanges();
    this.filteredRecallComponents = check.filter(item => 
      item.Component.includes(val) // Access the correct property
    );
  }

  getRecalls(year: any, make: any, model: any) {
    this.recalls =[];
    this.recallComponents =[];
    this.nhtsaService.getRecalls(year, make, model).subscribe(
     
      (data: Recall) => {
        
        this.recalls = data.results;

        this.recallComponents = data.results;
        this.getRecallDetails(this.recallComponents[0].NHTSACampaignNumber);
       this.recallComponents =  this.recallComponents.map(item => item.Component);
        this.recallComponents = this.recallComponents.flatMap(item => item.split(','));
        this.recallComponents =  Array.from(new Set(this.recallComponents)).sort();
        this.recallComponents = this.recallComponents.sort();

        
        this.recalls.sort((a, b) => {
          const dateA: any = new Date(
            a.ReportReceivedDate.split('/').reverse().join('-')
          );
          const dateB: any = new Date(
            b.ReportReceivedDate.split('/').reverse().join('-')
          );
          return dateB - dateA;
        });

        this.recalls.map((item) => {
          const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
          if (regex.test(item.ReportReceivedDate)) {
            return item;
          }

          const [day, month, year] = item.ReportReceivedDate.split('/');
          item.ReportReceivedDate = `${month}/${day}/${year}`;
          return item;
        });
      },
      (error) => {
        this.errorMessage = 'Error fetching vehicle data';
        console.error(error);
      }
    );
  }

  getVehicleCrashRatingId(year: any, make: any, model: any) {
    this.nhtsaService.getVehicleCrashRatingId(year, make, model).subscribe(
      (data: VehicleCrashRatingId) => {
        this.vehicleCrashRatingId = data.Results;
        this.getVehicleCrashRating(this.vehicleCrashRatingId[0].VehicleId);
      },
      (error) => {
        this.errorMessage = 'Error fetching vehicle data';
        console.error(error);
      }
    );
  }
  getYears() {
    const currentYear = new Date().getFullYear();
    for (let i = 1900; i <= currentYear; i++) {
      const set = i;
      this.years.push(i);
    }this.years.reverse();

  }

  getVehicleModel(model: any) {
    const year = model.value.ModelYear;
    const make = model.value.Make;
    this.nhtsaService.getVehicleModel(year, make).subscribe(
      (data: VehicleModel) => {
        this.vehicleModels = data.Results;
      },
      (error) => {
        this.errorMessage = 'Error fetching vehicle data';
        console.error(error);
      }
    );
  }

  getVehiclesByYear(year: any): void {
    this.nhtsaService.getVehicleByYear(year.value).subscribe(
      (data: VehicleByYear) => {
        this.vehicleByYears = data.Results; // Assign the Results array to vehicleByYears
      },
      (error) => {
        this.errorMessage = 'Error fetching vehicle data';
        console.error(error);
      }
    );
  }
}
