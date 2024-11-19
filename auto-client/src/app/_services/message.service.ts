import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = 'https://auto-complaints.com/_AutoApp/API/Controllers/MessageController.php';
  constructor(private http: HttpClient) { }

  sendPolicyMessage(fname:any, lname:any, phone:any, email:any,subject:any,type:any,message:any) {

    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    const endpoint = `/policyMessage?fname=${fname}&lname=${lname}&email=${email}&phone=${phone}&subject=${subject}&type=${type}&message=${message}`;
    return this.http.post(this.baseUrl+endpoint,{},{ headers: headers });
  }


}
