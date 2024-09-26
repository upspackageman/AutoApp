import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VisitorService } from '../_services/visitor.service';
import { Visitor } from '../_models/visitor';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { GoogleMapsModule } from "@angular/google-maps";
import { AdminAuthService } from '../_services/admin-auth.service';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatTabsModule,
    MatTableModule, 
    GoogleMapsModule,
    MatButtonModule

],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminComponent {
  visitors: Visitor | any;
  errorMessage: string | null = null;
  displayedColumns: string[] = ['ip_address', 'visited_page', 'date_visited', 'country','country_code', 'city'];

  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: { lat: -31, lng: 147 },
    zoom: 4,
  };

  constructor(private vistorService: VisitorService, private adminAuthService:AdminAuthService){}

  ngOnInit(){
    this.getVisitors();
  }

  logout(){
    this.adminAuthService.logout();
  }


  getVisitors() {

    this.vistorService.getVisitors().subscribe(
      (data: Visitor) => {
        this.visitors = data;
      },
      (error) => {
        this.errorMessage = 'Error fetching vehicle data';
        console.error(error);
      }
    );
  }

}
