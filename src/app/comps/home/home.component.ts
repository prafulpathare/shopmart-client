import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router} from '@angular/router';
import { CartService } from '../../serv/cart.service';
import { UserService } from '../../serv/user.service';
import { HttpClient } from '@angular/common/http';
import { ProductService, Product } from 'src/app/serv/product.service';
import { MainService } from 'src/app/serv/main.service';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	
	tt: string;
  prd: Product[] = [];
  prd2: Product[] = [];
  prd3: Product[] = [];

  constructor(
    private router: Router,
    public serv: MainService,
    public cartServ: CartService,
    public prdServ: ProductService,
    public usrServ: UserService,
    public mainServ: MainService,
    public http: HttpClient
  ) { }

  ngOnInit(): void {
    this.mainServ.showMegaMenu = true;
    this.getProducts(this.prd);
    this.getProducts(this.prd2);
    this.getProducts(this.prd3);
  }

  getProducts(prd: Product[]){
    // http://127.0.0.1:3000/products?q=
   this.http.get<Product[]>(this.mainServ.getProductApi()+"/search?q=").subscribe(data => {
     for(var i = 0; i < data["products"].length; i++ ){     
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

  openProduct(pid: string){
      this.router.navigate(['product']);
  }
}