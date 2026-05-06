import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html'
})
export class AppComponent {

  username = '';
  menuOpen = false;

  constructor(private router: Router) {

    // ✅ update username on route change
    this.router.events.subscribe(event => {
  if (event instanceof NavigationEnd) {
    this.username = localStorage.getItem('user') || '';
    this.menuOpen = false; // ✅ auto close on navigation
  }
});
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  showNavbar() {
    return this.router.url !== '/' && this.router.url !== '/signup';
  }

  logout() {
  this.menuOpen = false; // ✅ close sidebar
  localStorage.removeItem('user');
  this.router.navigate(['/']);
}
}
