import { Component, HostListener } from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouterOutlet,
  RouterLink
} from '@angular/router';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule
  ],
  templateUrl: './app.html'
})

export class AppComponent {

  username = '';
  menuOpen = false;

  timeout: any;

  constructor(private router: Router) {

    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {

        this.username =
          localStorage.getItem('user') || '';

        this.menuOpen = false;
      }
    });

    this.resetTimer();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  showNavbar() {

    const role = localStorage.getItem('role');

    if (role === 'admin') {
      return false;
    }

    return this.router.url !== '/' &&
           this.router.url !== '/signup' &&
           this.router.url !== '/forgot-password';
  }

  logout() {

    this.menuOpen = false;

    localStorage.clear();

    this.router.navigate(['/']);
  }

  autoLogout() {

    alert('Session expired. Please login again.');

    localStorage.clear();

    this.router.navigate(['/']);
  }

  resetTimer() {

    clearTimeout(this.timeout);

    const user = localStorage.getItem('user');

    if(user){

      this.timeout = setTimeout(() => {

        this.autoLogout();

      }, 15 * 60 * 1000);

    }

  }

  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:click')

  activity() {

    this.resetTimer();

  }

}
