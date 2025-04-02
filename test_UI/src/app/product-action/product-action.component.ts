import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../crud.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-action',
  templateUrl: './product-action.component.html',
  styleUrls: ['./product-action.component.css']
})
export class ProductActionComponent implements OnInit {
  productForm:any = FormGroup;
  CategoriesList:any=[];
  createType="Single";
  bulkUploadFile:any;
  constructor(public fb: FormBuilder,private crudService:CrudService,private router:Router){}
  ngOnInit(): void {
    this.initForm();
    this.getCategories();
  }
  initForm(){
    this.productForm = this.fb.group({
      name:['',[Validators.required]],
      image: ['',[Validators.required]],
      price: ['',[Validators.required]],
      category_id:['',[Validators.required]],
    })
  }
  getCategories(){
    this.crudService.getCategories().subscribe((data:any)=>{
      this.CategoriesList = data.data; 
    })
  }
  onSelectFile1(event: any) {
    if (event.target.files.length > 0) {
      this.bulkUploadFile = event.target.files[0];
    }
  }

  onSelectFile(event: any) {
    if (event.target.files.length > 0) {
      this.productForm.patchValue({ image: event.target.files[0] });
    }
  }

  onFormSubmit() {
    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('category_id', this.productForm.get('category_id')?.value);
    formData.append('image', this.productForm.get('image')?.value);
    this.crudService.postProduct(formData).subscribe((data:any)=>{
      if(data.code == 201){
        this.router.navigate(['products']);
      }
    })
  }

  bulkUploadProducts(){
    const formData = new FormData();
    formData.append('file', this.bulkUploadFile);
    this.crudService.postProductBulk(formData).subscribe((data:any)=>{
      if(data.code == 201){
        this.router.navigate(['products']);
      }
    })
  }
}
