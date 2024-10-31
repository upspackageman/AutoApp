import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Visitor } from '../_models/visitor';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  private baseUrl = 'http://45.32.71.33/api/Controllers/VisitedUsersController.php';

  constructor(private http: HttpClient) { }

  getVisitors(){
    return this.http.get<Visitor>(this.baseUrl+'/getVisitors');
  }
}
