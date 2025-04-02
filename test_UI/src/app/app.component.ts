import { Component, OnInit } from '@angular/core';
import { CrudService } from './crud.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Test_UI';
  isProduct=true;
  isCatrgorys=false;
  userData:any;
  constructor(private crudService:CrudService){}
  ngOnInit(): void {
    this.userData = localStorage.getItem('user');
    this.crudService.isLoggedIn.subscribe(data=>{
      console.log(data);
      this.userData = data;
    })
  }

}
