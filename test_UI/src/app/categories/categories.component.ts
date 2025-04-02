import { Component } from '@angular/core';
import { CrudService } from '../crud.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
  CategoriesList:any=[];
  constructor(private crudService:CrudService){}
  ngOnInit(): void {
    this.getCategories();
  }
  getCategories(){
    this.crudService.getCategories().subscribe((data:any)=>{
      this.CategoriesList = data.data; 
    })
  }

  openPrompt(){
    let name = window.prompt('Category Name:');
    if (name !== null && name.trim() !== '') {
      this.crudService.postCategory({name}).subscribe((data:any)=>{
        if(data.code==201){
          this.getCategories();
        }
      })
    } 
  }

}
