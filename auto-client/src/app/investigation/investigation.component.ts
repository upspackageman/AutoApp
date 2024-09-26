import { CommonModule } from '@angular/common';
import {  Component, inject, signal, TemplateRef, ChangeDetectorRef } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NhtsaService } from '../_services/nhtsa.service';
import {
  Investigation,
  Pagination,
  Result,
  InvestigationResult,
  AssociatedDocument,
  AssociatedProduct,
  Component as AutoComponent,
} from '../_models/investigation';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { BusyService } from '../_services/busy.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay';


@Component({
  selector: 'app-investigation',
  standalone: true,
  providers: [
    { provide: OverlayContainer,useClass: FullscreenOverlayContainer },
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonModule,
    MatMenuModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  
  templateUrl: './investigation.component.html',
  styleUrl: './investigation.component.css',
  
})
export class InvestigationComponent {
  investgationPagination: Pagination[] = [];
  result: Result[] = [];
  investigationResult: InvestigationResult[] = [];
  associateDocument: AssociatedDocument[] = [];
  associateProduct: AssociatedProduct[] = [];
  autoComponent: AutoComponent[] = [];
  investigation: Investigation[] = [];
  issueAssociatedProd: any[] = [];
  issueAssociatedCom: any[] = [];
  issueDetail: any = ([] = []);
  busyService = inject(BusyService);
  init:boolean = true;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[4]);
  pdfUrl:any='';

  readonly panelOpenState = signal(false);
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  subMenus: any;

  constructor(
    private nhtsaService: NhtsaService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  checkFileFormat(item:string){
    if(item.toLowerCase().includes('.pdf')){
      return true;
    }
    else{
      return false;
    }
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  pageChange(event: PageEvent, info:any){
    if (event.previousPageIndex !== undefined && event.previousPageIndex < event.pageIndex && info?.nextUrl) {
    this.investigationResult=[];
    this.getInvestigation(info?.nextUrl.start, info?.nextUrl.end, info?.nextUrl.offset);
    }

    if (event.previousPageIndex !== undefined && event.previousPageIndex > event.pageIndex && info?.previousUrl !==null) {
      this.investigationResult=[];
      this.getInvestigation(info?.previousUrl.start, info?.previousUrl.end, info?.previousUrl.offset);
      }

  }

  closeIssueTab(){
    const list = document.querySelector('.issue-info') as HTMLElement;
    list.style.width='0px';
    list.style.display='none';
  }

  issueTab(item: any){
    this.issueAssociatedProd = item.associatedProducts;
    this.issueAssociatedCom = item.components;
    this.issueDetail = item;
    const list = document.querySelector('.issue-info') as HTMLElement;
    list.style.width='700px';
    list.style.display='inline';
  }

  getModal(templateRef: TemplateRef<any>, item: any) {
    this.issueAssociatedProd = item.associatedProducts;
    this.issueAssociatedCom = item.components;
    this.issueDetail = item;
   
    this.dialog.open(templateRef, {
      width: '100%',
      height: '98%',
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'investigation-modal'
    });
  }

  async getModalDoc(templateRef: TemplateRef<any>, url: any) {
    
    (await this.nhtsaService.getPdfData(url)).subscribe(
      (objectUrl)=>{
        this.pdfUrl = objectUrl;
        this.cdr.detectChanges();
        
      },
      (error) => {
        //this.errorMessage = 'Error fetching vehicle data';
        console.error(error);
      }
    )

    if(this.pdfUrl){
      this.dialog.open(templateRef, {
        width: '100vw',  // Set to 100% of the viewport width
        height: '100vh', // Set to 100% of the viewport height
        hasBackdrop: true,
        disableClose: false,
        panelClass: 'investigation-doc-modal',
      });
    }

    
  }

dateChange() {
    this.init=false;
    const startDate = this.range.controls['start'].value;
    const endDate = this.range.controls['end'].value;

    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);
    this.investigationResult=[];
    this.getInvestigation(formattedStartDate, formattedEndDate);
  }

  // 

  

  async getInvestigation(start: any, end: any, offset:any= 0) {
    await (await this.nhtsaService.getVehicleInvestigation(start, end, offset)).subscribe(
      (data: Investigation) => {
        this.result = data.results;
        this.investgationPagination = [data.meta.pagination];

        this.associateDocument =
          data.results[0].investigations[0].associatedDocuments;
        this.associateProduct =
          data.results[0].investigations[0].associatedProducts;
        this.autoComponent = data.results[0].investigations[0].components;
        this.investigationResult = data.results[0].investigations;
        this.investigation = [data];

        this.investigationResult.map((item) => {
         
          item.dateOpened = this.formatDateToMMDDYYYY(item.dateOpened);
          item.dateClosed = this.formatDateToMMDDYYYY(item.dateClosed);
          return item;
        });
       
      },
      (error: any) => {
        //this.errorMessage = 'Error fetching vehicle data';
        console.error(error);
      }
    );
  }


  formatDate2(item:string){
    const [month,day,year] = item.split('-').map(Number);
    const date =new Date(year,month - 1, day);
    const options:Intl.DateTimeFormatOptions ={
      year:"numeric",
      month:"long",
      day:"numeric"
    }
    const formattedDate= date.toLocaleDateString('en-US',options);
    return formattedDate;
  }

  formatDateToMMDDYYYY(dateString: string): string  {
    if(!dateString){
      return '';
    }
    const date = new Date(dateString);
  

    // Get the month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
  
    // Format to MM-DD-YYYY
    return `${month}-${day}-${year}`;
  }

  formatDate(date: Date | null): string | null {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
