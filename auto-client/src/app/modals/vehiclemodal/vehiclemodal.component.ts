// import { Component, Inject } from '@angular/core';
// import { MatButtonModule } from '@angular/material/button';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { VehicleByYear,Results } from '../../_models/vehicleByYear';
// import { NhtsaService } from '../../_services/nhtsa.service';
// import { CommonModule } from '@angular/common';
// import { VehicleModel, Result } from '../../_models/vehicleModel';

// @Component({
//   selector: 'app-vehiclemodal',
//   standalone: true,
//   imports: [CommonModule ,MatFormFieldModule,MatInputModule,MatSelectModule,MatButtonModule],
//   templateUrl: './vehiclemodal.component.html',
//   styleUrl: './vehiclemodal.component.css'
// })
// export class VehiclemodalComponent {
  
//   years:any[]=[];
//   errorMessage: string | null = null;
//   vehicleByYears: Results[]=[];
//   vehicleModels: Result[]=[];
  
  
//   constructor(private nhtsaService: NhtsaService,public dialogRef: MatDialogRef<VehiclemodalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {}

//   ngOnInit(): void {
//     this.getYears();
//   }

//   closeDialog(): void {
//     this.dialogRef.close();
//   }

//   getYears(){
//     const currentYear = new Date().getFullYear();
//     for(let i = 1900; i <= currentYear; i++ ){
//       const set = i;
//       this.years.push(i);
//     }
//     console.log(this.years.reverse());

//   }

//   getVehicleCompliants(vehicle:any){
//     console.log(vehicle.value);
//     let year = vehicle.value.ModelYear
//     let make = vehicle.value.Make;
//     let model = vehicle.value.Model;
    
//     if(this.data && this.data.getComplaints){
//       this.data.getComplaints(year,make,model);
//     }
//   }


//   getVehicleModel(model:any){
//     console.log(model.value);
//     const year = model.value.ModelYear;
//     const make = model.value.Make;
//     this.nhtsaService.getVehicleModel(year,make).subscribe(
//       (data:VehicleModel) => {
//         //console.log(data);
//         this.vehicleModels = data.Result;
//         console.log(this.vehicleModels);
//       },
//       (error) => {
//         this.errorMessage = 'Error fetching vehicle data';
//         console.error(error);
//       }
//     );
//   }


//   getVehiclesByYear(year:any): void {
//     console.log(year.value);
//     this.nhtsaService.getVehicleByYear(year.value).subscribe(
//       (data: VehicleByYear) =>{
//         console.log('API Response:', data); // Log the entire response
//         this.vehicleByYears = data.Results; // Assign the Results array to vehicleByYears
//         console.log('Results:', this.vehicleByYears);
//       },
//       (error) => {
//         this.errorMessage = 'Error fetching vehicle data';
//         console.error(error);
//       }
//     );
   
//   }
// }
