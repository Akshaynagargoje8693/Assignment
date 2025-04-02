import { Component, OnInit } from '@angular/core';
import { CrudService } from '../crud.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm:any = FormGroup
  constructor(private crudService:CrudService,public fb: FormBuilder,private router:Router){}
  ngOnInit(): void {
      this.initForm();
      let userData = localStorage.getItem('user');
      console.log("user",userData)
      if(userData){
        this.crudService.isLoggedIn.next(true);

        this.router.navigate(['products']);
        }
  }

  initForm(){
    this.loginForm = this.fb.group({
      email: ['',[Validators.email,Validators.required]],
      password:['',[Validators.required]],
    })
  }

onFormSubmit(){
console.log(this.loginForm.getRawValue());
this.crudService.loginUser({...this.loginForm.getRawValue()}).subscribe((data:any)=>{
  console.log(data);
  if(data){
    localStorage.setItem('user',data.data);
    this.crudService.isLoggedIn.next(true);
    this.router.navigate(['products']);
  }
})
}
}
