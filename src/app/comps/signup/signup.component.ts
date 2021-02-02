import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/serv/user.service';
import { MainService } from 'src/app/serv/main.service';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
	err: string;
	err2: string;

	status: number = 2;

	addEmailForm = new FormGroup({
		email: new FormControl('')
	});
	signUpForm = new FormGroup({
		name: new FormControl(''),
		email: new FormControl(''),
		contact: new FormControl(''),
		password: new FormControl(''),
		token: new FormControl(''),
	});

	constructor(
		private http: HttpClient,
	    private serv: UserService,
	    public mainServ: MainService,
	    private router: Router
	) {
			
	}

	ngOnInit(): void {
		this.status = 0;	
	}


	makeSignUp(){
		
		this.http.post(this.mainServ.getUserApi() + "/register", {
	      "name": this.signUpForm.controls['name'].value,
	      "email": this.signUpForm.controls['email'].value,
	      "contact": this.signUpForm.controls['contact'].value,
	      "password": this.signUpForm.controls['password'].value,
	      "token": this.signUpForm.controls['token'].value,
	    }).subscribe(
	      user => {
	      		this.router.navigate(['/signin']);
	      },
	      error => {
	      	console.log(error)
	      }
	    )
	}
	addEmail() {
		this.err2 = null;
		var email = this.addEmailForm.controls['email'].value;
		this.http.post(
			"http://127.0.0.1:8080/utils/email-verification",
			email
		).subscribe(
			data => {
				this.status = 2;
				this.signUpForm.controls['email'].setValue(email);
			},
			err =>  {
				if(err.status == 302) this.err2 = "user already exists";
			}
		)
	}

}
