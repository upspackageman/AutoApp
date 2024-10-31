import { Component,ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { HttpClientModule } from '@angular/common/http';
import { IpTrafficService } from './_services/ip-traffic.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, NavbarComponent, FooterComponent, HttpClientModule, CommonModule,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
policy: any;
/**
 *
 */
constructor(public ipTrafficService:IpTrafficService) {}

  title = 'auto-client';

  policyAcknowledge(){
    this.ipTrafficService.policy = true; 
    this.ipTrafficService.getClientIp();
    localStorage.setItem('daccord', 'accepted ' + Date.now() )
  }
 
 
}


