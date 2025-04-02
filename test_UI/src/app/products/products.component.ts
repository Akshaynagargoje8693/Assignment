import { Component, OnInit } from '@angular/core';
import { CrudService } from '../crud.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
  currentPage = 1;
  itemsPerPage = 10; 
  ProductsList:any=[];
  constructor(private crudService:CrudService){}
  ngOnInit(): void {
    this.getProducts();
  }
  getProducts(){
    this.crudService.getProducts({page:this.currentPage,limit: this.itemsPerPage}).subscribe((data:any)=>{
      this.ProductsList = data.data;
    })
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getProducts();
  }

}
