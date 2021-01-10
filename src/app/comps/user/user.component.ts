import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../serv/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MainService } from 'src/app/serv/main.service';
import { ProductService } from 'src/app/serv/product.service';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

	seller: any;
	updateForm: number = 0;
	orders: any[] = [];

	infoForm = new FormGroup({
		name : new FormControl(''),
		contact : new FormControl(''),
		home_address : new FormControl(''),
		office_address : new FormControl(''),
	});

	constructor(
		private router: Router,
		private http: HttpClient,
		public serv: UserService,
		public prdServ: ProductService,
		private mainServ: MainService
	) { }

	ngOnInit(): void {
		console.log("jwt-token",localStorage.getItem("jwt"));
		if (localStorage.getItem("jwt") === null) {
			this.router.navigate(['/signin'])
		} else {
			this.getOrders();
		}
        this.mainServ.showMegaMenu = false;
	}

	getOrders() {
		this.orders = [];
		this.http.get<any[]>(
			'http://127.0.0.1:8080/order',
			{
				headers:  this.serv.getHeaders()
			}
		).subscribe(data => {
			console.log(data);
			this.orders = data;
		});
	}

	updateUserInfo() {
		this.http.post(
			'http://127.0.0.1:8080/user/update',
			{
				"name" : this.infoForm.controls['name'].value,
				"home_address" : this.infoForm.controls['home_address'].value,
				"office_address" : this.infoForm.controls['office_address'].value
			},
			{
				headers:  this.serv.getHeaders()
			}
		).subscribe(data => {
			console.log(data)
			this.serv.user.name = data['name'];
			this.serv.user.email = data['email'];
			this.serv.user.contact = data['contact'];
			this.serv.user.home_address = data['home_address'];
			this.serv.user.office_address = data['office_address'];
			this.updateForm = 0;
		}, err => {
			console.log(err)
		});
	}


	selectedFile : File = null;
	onFileSelected(event){
		this.selectedFile = event.target.files[0];

		const fd = new FormData();
		fd.append('profile_img', this.selectedFile, this.selectedFile.name);
		fd.append('uid', this.serv.user.uid.toString());
		
		this.http.post(this.mainServ.profile_upload_uri, fd)
		.subscribe(res => {
				console.log('update profile',res);
				this.serv.getUserInfo();
			},err => {
				console.log('update profile err',err)
			}
		)
	}

	delOrder(orderid: number){
		this.http.post(
			"http://127.0.0.1:8080/order/delete",
			orderid
			,
			{
				headers:  this.serv.getHeaders()
			}
		).subscribe(data => {
			this.getOrders();
		})
	}

}

export class OrderItem{
	public id: string;
	public name: string;
	public noofitems: number;
	public totalprice: number;
}
export class Order{
	public id: number;
	public deliveryaddr: string;
	public finalprice: number;
	public userid: number;
	public orderItems: OrderItem[] = [];
}