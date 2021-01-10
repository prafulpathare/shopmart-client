import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProductService, Product } from 'src/app/serv/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/serv/cart.service';
import { MainService } from 'src/app/serv/main.service';
import { UserService } from 'src/app/serv/user.service';

@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: [
		'../home/home.component.css',
		'./product.component.css'
	]
})
export class ProductComponent implements OnInit {

	product = new Product('product id', 'product name', [], [], 0.0);
	prd3: Product[] = [];

	bigImg: string;
	showHover: boolean = false;
	zptrX: number = 0;
	zptrY: number = 0;

	// reviews
	reviews_count: number = 0;
	reviews: Review[] = [];

  // review form 
  reviewForm = new FormGroup({
      review_txt: new FormControl('')
  });

	constructor(
		public http: HttpClient,
		private router: Router,
		public route: ActivatedRoute,
		public prdServ: ProductService,
		public mainServ: MainService,
		public serv: UserService,
		public cartServ: CartService
	) {

	}

	ngOnInit(): void {
		
		this.mainServ.showMegaMenu = false;
		this.prdServ.getProductFromId(this.route.snapshot.params.pid).subscribe(data => {
			this.product = data['product'];
			this.bigImg = data['product'].imgurl[0];
			this.cartServ.cart.productExists(this.product._id)
		});
		this.getProducts(this.prd3);
		this.getReviews();
	}
	setBigImg(imgurl: string) {
		this.bigImg = imgurl;
	}
	reload(pid: string) {
		this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
			this.router.navigate(['/product', pid]));
	}
	getReviews() {
		this.http.get(
      "http://127.0.0.1:8080/review?productid="+this.route.snapshot.params.pid,
			).subscribe(data => {
				this.reviews_count = data['count'];
				this.reviews = data['reviews'];
			});
	}
	getProducts(prd: Product[]) {
		// http://127.0.0.1:3000/products?q=
		this.http.get<Product[]>(this.mainServ.getProductApi() + "products?q=").subscribe(data => {
			for (var i = 0; i < data["products"].length; i++) {
				prd.push(new Product(
					data["products"][i]._id,
					data["products"][i].name,
					data["products"][i].imgurl,
					data["products"][i].description,
					data["products"][i].price
				));
			}
		})
	}
  addReview(){
    this.http.post("http://127.0.0.1:8080/review/add", {
      "product_id": this.product._id,
      "review_txt": this.reviewForm.controls['review_txt'].value
    },
    {
        headers:  this.serv.getHeaders()
      }
    ).subscribe(
      data => {
          if(data >= 1){
            this.getReviews();
          }
      },
      error => {
        console.log(error)
      }
    )
  }
}

export class Review {
	uid: number;
	name: string;
	review_txt: string;
	date_created: Date;
}