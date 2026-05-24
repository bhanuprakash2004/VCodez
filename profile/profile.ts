import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WaterService } from '../water';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})

export class ProfileComponent {

  profile: any = null;

  editMode = false;

  oldUsername = '';

  popupMessage = '';
  showPopup = false;

  constructor(private service: WaterService) {

    const user = localStorage.getItem('user') || 'sasi';

    this.oldUsername = user;

    this.service.getProfile(user).subscribe((res: any) => {
      console.log('PROFILE DATA:', res);
      this.profile = res;
    });

  }

  editProfile() {
    this.editMode = true;
  }

  saveProfile() {

    const data = {
      oldUsername: this.oldUsername,
      username: this.profile.username,
      phone: this.profile.phone
    };

    this.service.updateProfile(data).subscribe((res: any) => {

      if (res.status === 'success') {

        localStorage.setItem('user', this.profile.username);

        this.oldUsername = this.profile.username;

        this.editMode = false;

        this.showSavedPopup('Profile updated successfully');

      } else {

        this.showSavedPopup(res.message || 'Update failed');

      }

    });

  }

  showSavedPopup(message: string) {

    this.popupMessage = message;
    this.showPopup = true;

    setTimeout(() => {
      this.showPopup = false;
    }, 2500);

  }

}
