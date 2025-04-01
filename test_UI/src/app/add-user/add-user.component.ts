import { Component, OnInit } from '@angular/core';
import { CrudService } from '../crud.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit{
  userForm:any = FormGroup
  companiesArr:any = [];
  selectedCompanies:any=[];
  constructor(private crudService:CrudService,public fb: FormBuilder,private router:Router){}
  ngOnInit(): void {
    this.getCompanies();

      this.initForm();
  }
  initForm(){
    this.userForm = this.fb.group({
      name:['',[Validators.required]],
      email: ['',[Validators.email,Validators.required]],
      phone:['',[Validators.maxLength(10),Validators.minLength(10),Validators.required]],
    })
  }
getCompanies(){
  this.crudService.getCompanies().subscribe(data=>{
    this.companiesArr = data;
  })
}
onFormSubmit(){
console.log(this.userForm.getRawValue());
console.log(this.companiesArr);
console.log("selectedCompanies",this.selectedCompanies);
this.crudService.saveUser({...this.userForm.getRawValue(),companies:this.selectedCompanies}).subscribe(data=>{
  console.log(data);
  if(data){
    alert("user Added successfull");
    this.router.navigate(['']);
  }
})
}

onChangeCheckbox(event:any,id:any){
  console.log(event.target.checked,id);
  if(event.target.checked){
    this.selectedCompanies.push(id)
  }else{
    let index = this.selectedCompanies.findIndex((ele:any)=> ele==id);
    this.selectedCompanies.splice(index,1);
  }
}
}
