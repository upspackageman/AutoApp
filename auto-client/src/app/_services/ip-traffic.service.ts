import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IpTrafficService {

  private trackIpUrl = 'https://auto-complaints.com/api/Controllers/VisitedUsersController.php';  // Update to your PHP file URL
  public policy:boolean =false;
  
  constructor(private http: HttpClient,private router: Router) {
    // Subscribe to router events to detect page changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.logPageVisit(event.urlAfterRedirects);
      }
    });
   }


   policyAccepted(){
    if(this.videoLocalStorageAvailable()){
     this.policy =true;
    }else{
     
      this.policy = false;
    }
    
  }

  logPageVisit(page: string) {
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    const body = `page=${encodeURIComponent(page)}`;
    
    return this.http.post(this.trackIpUrl+'/getTrack', body, { headers: headers }).subscribe({
      // next: (response) =>  response,
      // error: (error) => console.error('Error logging IP:', error)
    });
  }

  getClientIp() {
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post(this.trackIpUrl+'/getTrackIp', { headers: headers }).subscribe({
      // next: (response) =>  response,
      // error: (error) => console.error('Error logging IP:', error)
    });
  }

  videoLocalStorageAvailable(): boolean {
    try {
      const key='daccord';
      const approveExist = localStorage.getItem(key);
      return  approveExist !== null;
    } catch (error) {
      return false;
    }
  }
}
