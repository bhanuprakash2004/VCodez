import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WaterService } from '../water';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'] 
})
export class LoginComponent {

  username = '';
  password = '';
  error = '';

  showPassword = false; // ✅ NEW

  constructor(private router: Router, private service: WaterService) {}

  togglePassword() {     // ✅ NEW
    this.showPassword = !this.showPassword;
  }

  login() {
    this.service.login({
      username: this.username,
      password: this.password
    }).subscribe((res:any) => {

      if (res.status === 'success') {
        localStorage.setItem('user', this.username);
        this.router.navigate(['/home']);
      } else {
        this.error = 'Invalid username or password';
      }

    });
  }
}
