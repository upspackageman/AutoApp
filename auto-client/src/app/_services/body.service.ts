import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BodyService {
  private isScrolledSource = new BehaviorSubject<boolean>(false);
  isScrolled$ = this.isScrolledSource.asObservable();
  
  updateScrollState(isScrolled: boolean) {
    this.isScrolledSource.next(isScrolled);
  }
}
