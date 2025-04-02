import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProductActionComponent } from './product-action/product-action.component';
import { CategoryActionComponent } from './category-action/category-action.component';

const routes: Routes = [
  {path:'', component:LoginComponent},
  {path:'products',component:ProductsComponent},
  {path:'categories',component:CategoriesComponent},
  {path:'product/:action',component:ProductActionComponent},
  {path:'product/:action/:id',component:ProductActionComponent},
  {path:'category/:action',component:CategoryActionComponent},
  {path:'category/:action/:id',component:CategoryActionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
