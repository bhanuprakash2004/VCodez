import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WaterService } from '../water';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './signup.html'
})
export class SignupComponent {

  username = '';
  password = '';
  confirmPassword = '';
  message = '';

  constructor(private service: WaterService, private router: Router) {}

 signup() {

  if (this.password !== this.confirmPassword) {
    this.message = "Passwords do not match";
    return;
  }

  this.service.signup({
    username: this.username,
    password: this.password
  }).subscribe({
    next: (res:any) => {
      console.log("Response:", res); // 👈 DEBUG

      if (res.status === 'success') {
        alert('Signup successful');
        this.router.navigate(['/']);
      }
      else if(res.status === 'exists'){
        this.message = "User already exists";
      }
      else {
        this.message = "Error occurred";
      }
    },
    error: (err) => {
      console.error("API ERROR:", err); // 👈 DEBUG
      this.message = "Server error";
    }
  });
}
}
