import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http: HttpClient) { }

  private url = "http://localhost:3000"
  getUsers(filters={}){
    return this.http.get(`${this.url}/users`,{params:filters});
  }
  getCompanies(){
    return this.http.get(`${this.url}/companies`);
  }
  saveUser(body:any){
    return this.http.post(`${this.url}/add/user`,body);
  }
}
