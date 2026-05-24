import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WaterService {

  url = "http://localhost/water-api/";

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(
      this.url + "login.php",
      data
    );
  }

  signup(data: any) {
    return this.http.post(
      this.url + "signup.php",
      data
    );
  }

  addData(data: any) {
    return this.http.post(
      this.url + "add.php",
      data
    );
  }

  getAll(user: any) {
    return this.http.get(
      this.url + "get.php?user=" + user
    );
  }

  getAdminStats() {
    return this.http.get(
      this.url + "admin.php"
    );
  }

  deleteUser(id: any) {
    return this.http.get(
      this.url + "delete-user.php?id=" + id
    );
  }

  getAllUsers() {
    return this.http.get(
      this.url + "all-users.php"
    );
  }

  deleteRecord(id: any) {
    return this.http.get(
      this.url + "delete-record.php?id=" + id
    );
  }
sendOtp(data: any) {
  return this.http.post(
    this.url + "send-otp.php",
    data
  );
}

resetPassword(data: any) {
  return this.http.post(
    this.url + "reset-password.php",
    data
  );
}
getProfile(user:any){
  return this.http.get(
    this.url + "profile.php?user=" + user
  );
}
getRecycleUsers() {
  return this.http.get(
    this.url + "recycle-users.php"
  );
}

restoreUser(id: any) {
  return this.http.get(
    this.url + "restore-user.php?id=" + id
  );
}
updateProfile(data:any) {
  return this.http.post(this.url + 'update_profile.php', data);
}
}
