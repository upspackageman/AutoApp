import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin } from '../_models/admin';
import { map, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  baseUrl ='http://192.168.0.28:8000/AutoApp/API/Controllers/AuthController.php';
  private currentUserSource = new BehaviorSubject<Admin | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router:Router) { }

  login(modelLogin: any) {
    return this.http.post(this.baseUrl + '/login', modelLogin).pipe(
      map((response)=>{
        const user = response as Admin;
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }
  
  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.router.navigate(['adminlogin']);
  }

}
