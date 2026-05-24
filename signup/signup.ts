import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WaterService } from '../water';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {

  username = '';
  phone = '';
  password = '';
  confirmPassword = '';
  secretCode = '';
  message = '';

  constructor(
    private service: WaterService,
    private router: Router
  ) {}

  signup() {

    this.message = '';

    const phonePattern = /^[6-9]\d{9}$/;

    if (
      !this.username ||
      !this.phone ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.message = 'Please fill all required fields';
      return;
    }

    if (!phonePattern.test(this.phone)) {
      this.message = 'Enter valid Indian mobile number';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.message = 'Passwords do not match';
      return;
    }

    this.service.signup({
      username: this.username,
      phone: this.phone,
      password: this.password,
      secretCode: this.secretCode
    }).subscribe({

      next: (res:any) => {

        if (res.status === 'success') {

          if (res.role === 'admin') {
            alert('Admin account created successfully');
          } else {
            alert('Signup successful');
          }

          this.router.navigate(['/']);

        }
        else if (res.status === 'exists') {
          this.message = 'User already exists';
        }
        else if (res.status === 'phone_exists') {
          this.message = 'Phone number already registered';
        }
        else {
          this.message = res.msg || 'Error occurred';
        }
      },

      error: () => {
        this.message = 'Server error';
      }
    });
  }
}
