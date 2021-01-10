import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainService } from "./main.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient,
    private mainServ : MainService
  ) { }

  cnt: number = 0;
  getProductFromId(pid: string) {
      return this.http.get<Product>(this.mainServ.getProductApi()+"product?pid="+pid);
  }
  getProductNameFromId(pid: string){
    console.log(this.cnt);
    this.cnt = this.cnt + 1;
    return "Product name "+this.cnt;
  }
}

export class Product{
  _id: string;
  name: string;
  company: string;
  price: number;
  imgurl: string [] = [];
  description: string [] = [];

  constructor(id, name, imgurl, descs, price){
      this._id = id;
      this.name = name;
      this.imgurl = imgurl;
      this.description = descs;
      this.price = price;
  }
}
