import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { WaterService } from '../water';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent {

  phone = '';
  otp = '';
  newPassword = '';
  confirmPassword = '';

  message = '';

  otpSent = false;

  constructor(
    private service: WaterService,
    private router: Router
  ) {}

  sendOtp() {
    this.message = '';

    const phonePattern = /^[6-9]\d{9}$/;

    if (!phonePattern.test(this.phone)) {
      this.message = 'Enter valid Indian mobile number';
      return;
    }

    this.service.sendOtp({ phone: this.phone }).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.otpSent = true;
          this.message = 'OTP sent successfully';
        } else {
          this.message = res.msg || 'Failed to send OTP';
        }
      },
      error: () => {
        this.message = 'Server error';
      }
    });
  }

  resetPassword() {
    this.message = '';

    if (!this.otp || !this.newPassword || !this.confirmPassword) {
      this.message = 'Please fill all fields';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Passwords do not match';
      return;
    }

    this.service.resetPassword({
      phone: this.phone,
      otp: this.otp,
      password: this.newPassword
    }).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
  alert('Password changed successfully');
  this.router.navigate(['/']);
}else {
          this.message = res.msg || 'Password reset failed';
        }
      },
      error: () => {
        this.message = 'Server error';
      }
    });
  }
}
