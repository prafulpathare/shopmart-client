import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/serv/user.service';
import { MainService } from 'src/app/serv/main.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  err: string;
  err2: string;
  suc: string;

  signInForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private http: HttpClient,
    private serv: UserService,
    public mainServ: MainService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  signIn() {
    this.http.post("http://127.0.0.1:8080/customer/authenticate", {
      "email": this.signInForm.controls['email'].value,
      "password": this.signInForm.controls['password'].value
    }).subscribe(
      data => { console.log(data)
        localStorage.setItem("jwt", "Bearer " + data['token']);
        console.log("jwt", localStorage.getItem("jwt"));
        this.serv.user.isAuthenticated = true;
        this.serv.getUserInfo();
        this.router.navigate(['/']);
      },
      error => {
        if (error['error']['status'] == 401) {
          this.err = "invalid password.";
        }
        if (error['error']['status'] == 500) {
          this.err = "invalid email.";
        }
      }
    )
  }

}
