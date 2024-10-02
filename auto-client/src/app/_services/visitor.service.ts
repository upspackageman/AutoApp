import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Visitor } from '../_models/visitor';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  private baseUrl = 'http://64.176.213.121/api/Controllers/VisitedUsersController.php';

  constructor(private http: HttpClient) { }

  getVisitors(){
    return this.http.get<Visitor>(this.baseUrl+'/getVisitors');
  }
}
