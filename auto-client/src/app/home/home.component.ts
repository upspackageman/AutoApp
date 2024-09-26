import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { IpTrafficService } from '../_services/ip-traffic.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
 
 constructor(private ipTrafficService:IpTrafficService) {}

 



}
