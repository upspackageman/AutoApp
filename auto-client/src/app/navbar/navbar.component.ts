import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterModule,CommonModule]
})
export class NavbarComponent  {
  isScrolled: boolean = false;

  constructor() {
    window.addEventListener('scroll', this.scrolled, true);
   }
  
  
   ngOnInit(): void {
    // Listen to the scroll event on the window
    window.addEventListener('scroll', this.scrolled, true);
  }
  
  ngOnDestroy(): void {
    window.removeEventListener('scroll',this.scrolled);
  }
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled();
  }

  scrolled() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > 5) {
      this.isScrolled = true;
     
    } else {
      this.isScrolled = false;
     
    }
  }
  
}
