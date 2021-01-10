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

	status: number = 0;

	addEmailForm = new FormGroup({
		email: new FormControl('')
	});
	confirmEmailForm = new FormGroup({
		token: new FormControl('')
	});
	signUpForm = new FormGroup({
		uid: new FormControl(''),
		full_name: new FormControl(''),
		email: new FormControl(''),
		contact: new FormControl(''),
		password: new FormControl('')
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
		
		this.http.post(this.mainServ.getUserApi() + "register", {
	      "uid": this.signUpForm.controls['uid'].value,
	      "name": this.signUpForm.controls['full_name'].value,
	      "email": this.signUpForm.controls['email'].value,
	      "contact": this.signUpForm.controls['contact'].value,
	      "password": this.signUpForm.controls['password'].value,
	    }).subscribe(
	      data => {
	        this.router.navigate(['/signin']);
	      },
	      error => {
	      	console.log(error)
	      }
	    )
	}
	confirmEmail(){
		this.status = 2;
	}
	addEmail(){
		this.err2 = null;
		var email = this.addEmailForm.controls['email'].value;
		this.http.post(
			"http://127.0.0.1:8080/user/add-email",
			email
		).subscribe(data => {
			if(data['status'] == 500){
				this.err2 = "User already exists"
			}
			if(data['status'] == 200){
				this.status = 1;
				this.signUpForm.get('email').setValue(this.addEmailForm.controls['email'].value);
			}
		})
	}

}
