import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WaterService {

  url = "http://localhost/water-api/";

  constructor(private http: HttpClient) {}
login(data:any){
  return this.http.post(this.url + "login.php", data);
}

addData(data:any){
  return this.http.post(this.url + "add.php", data);
}

getAll(user:any){
  return this.http.get(this.url + "get.php?user=" + user);
}
signup(data:any){
  return this.http.post(this.url + "signup.php", data);
}
}
