import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private database: DatabaseService) { }

  ngOnInit() {
    this.database.initializPlugin().then(r => {
      this.database.getUsers().then(result => {
        console.log(result.values)
      })
    }).catch(error => {

    })
  }

}
