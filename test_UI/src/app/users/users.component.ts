import { Component, OnInit } from '@angular/core';
import { CrudService } from '../crud.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{
  constructor(private crudService: CrudService){

  }

  userList :any=[]
  ngOnInit(): void {
    this.getUsers()  
  }
  getUsers(){
    this.crudService.getUsers().subscribe(data=>{
      this.userList = data;
    })
  }
}
