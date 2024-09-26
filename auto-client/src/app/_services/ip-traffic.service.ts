import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IpTrafficService {

  private trackIpUrl = 'http://64.176.213.121/API/Controllers/VisitedUsersController.php';  // Update to your PHP file URL

  constructor(private http: HttpClient,private router: Router) {
    // Subscribe to router events to detect page changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.logPageVisit(event.urlAfterRedirects);
      }
    });
   }

  logPageVisit(page: string) {
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    const body = `page=${encodeURIComponent(page)}`;
    
    return this.http.post(this.trackIpUrl+'/getTrack', body, { headers: headers }).subscribe({
      next: (response) => console.log('IP Logged Successfully:', response),
      error: (error) => console.error('Error logging IP:', error)
    });
  }
}
