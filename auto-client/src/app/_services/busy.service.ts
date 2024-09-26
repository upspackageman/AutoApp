import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount =0;
  loading = false;

  busy(){
    this.busyRequestCount++;
    this.loading=true;
  }

  idle(){
    this.busyRequestCount--;
    if(this.busyRequestCount <=0){
      this.busyRequestCount = 0;
      this.loading=false;
    }
  }
}
