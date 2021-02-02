import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../serv/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MainService } from 'src/app/serv/main.service';
import { ProductService } from 'src/app/serv/product.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css'],
	animations: [
		trigger('fadeInForm', [
			state('void', style({
				opacity: 0,
				transform: 'rotate(135deg) scale(0)'
			})),
			state('*', style({
				opacity: 1, 'box-shadow': '0 0 1px 1px #ccc',
				transform: 'rotate(0deg) scale(1)'
			})),
			transition('void <=> *', animate(400))
		]),
		trigger('fadeInCover', [
			state('void', style({
				opacity: 0,	transform: 'scale(0)'
			})),
			state('*', style({
				opacity: 0.7, transform: 'scale(1)'
			})),
			transition('void <=> *', animate(250))
		]),
		
	]

})
export class UserComponent implements OnInit {

	seller: any;
	updateForm: number = 0;
	address_type = "UNKNOWN";
	openFormTitle = "Add";

	addressForm = new FormGroup({
		line_one: new FormControl(''),
		line_two: new FormControl(''),
		line_three: new FormControl(''),
		state: new FormControl(''),
		pincode: new FormControl(''),
		city: new FormControl('')
	});

	constructor(
		private router: Router,
		private http: HttpClient,
		public serv: UserService,
		public prdServ: ProductService,
		private mainServ: MainService
	) { }

	ngOnInit(): void {
		console.log("jwt-token", localStorage.getItem("jwt"));
		if (localStorage.getItem("jwt") === null) {
			this.router.navigate(['/signin'])
		}
		this.mainServ.showMegaMenu = false;
	}


	addAddress() {

		this.http.post(
			'http://127.0.0.1:8080/address',
			{
				"line_one": this.addressForm.controls['line_one'].value,
				"line_two": this.addressForm.controls['line_two'].value,
				"line_three": this.addressForm.controls['line_three'].value,
				"state": this.addressForm.controls['state'].value,
				"pincode": this.addressForm.controls['pincode'].value,
				"city": this.addressForm.controls['city'].value,
				"address_type": this.address_type
			},
			{
				headers: this.serv.getHeaders()
			}
		).subscribe(data => {
			console.log(data)
			this.updateForm = 0;
			this.serv.getUserInfo();
		}, err => {
			console.log(err)
		});
	}

	selectedFile: File = null;
	onFileSelected(event) {
		this.selectedFile = event.target.files[0];

		const fd = new FormData();
		fd.append('profile_img', this.selectedFile, this.selectedFile.name);
		fd.append('uid', this.serv.user.user_id.toString());

		this.http.post(this.mainServ.profile_upload_uri, fd)
			.subscribe(res => {
				console.log('update profile', res);
				this.serv.getUserInfo();
			}, err => {
				console.log('update profile err', err)
			}
			)
	}

	delOrder(orderid: number) {
		this.http.delete(
			"http://127.0.0.1:8080/order/" + orderid,
			{
				headers: this.serv.getHeaders()
			}
		).subscribe(
			data => {
				this.serv.getUserInfo()
			},
			err => console.log(err)
		)
	}

}

