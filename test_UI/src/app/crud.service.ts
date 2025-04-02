import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CrudService {

  isLoggedIn = new BehaviorSubject(false);
  constructor(private http: HttpClient) {
    let userData = localStorage.getItem('user');
    if(userData) this.isLoggedIn.next(true);
   }

  private url = "http://localhost:3000"
  getProducts(filters={}){
    return this.http.get(`${this.url}/products`,{params:filters});
  }
  getCategories(){
    return this.http.get(`${this.url}/categories`);
  }
  postCategory(body:any){
    return this.http.post(`${this.url}/category`,body);
  }
  saveUser(body:any){
    return this.http.post(`${this.url}/add/user`,body);
  }
  loginUser(body:any){
    return this.http.post(`${this.url}/login`,body);
  }

  postProduct(formData:any){
    return this.http.post(`${this.url}/product`,formData);
  }
  postProductBulk(formData:any){
    return this.http.post(`${this.url}/products/bulk-upload`,formData);
  }

}
