import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService, Product } from './product.service';
import { Address } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart: Cart;

  constructor(private router: Router) {
      this.cart = new Cart();
  }

  emptyCart(){
      this.cart.items = [];
      this.cart.cart_price = 0;
      this.cart.ship_price = 0;
      this.cart.final_price = 0;
  }
}

export class Cartitem {
  public _id: string;
  public name: string;
  public imgurl: string;
  public descs: string;
  public quantity: number;
  public price: number;
  public total: number;

  constructor(){
    this.quantity = 1;
    this.total = this.price * this.quantity;
  }
  updateCartItemTotalPrice(){
    this.total = this.price * this.quantity;
  }
}

export class Cart {
  public address: Address;
  public cart_price: number;
  public ship_price: number;
  public final_price: number;
  public items: Cartitem[];

  constructor() {
	  this.address = new Address();
	  this.cart_price = 0;
	  this.ship_price = 0;
	  this.final_price = this.ship_price + this.cart_price;
	  this.items = [];
  }

  addToCart(prd: Product) {

    let found = 0;
    this.items.forEach(item => {
      if (item._id === prd._id) {
        found = 1; item.quantity += 1; item.updateCartItemTotalPrice();
      }
    })
    if (found == 0) {
      let newItem = new Cartitem();
      newItem._id = prd._id;
      newItem.name = prd.name;
      newItem.imgurl = prd.imgurl[0];
      newItem.descs = prd.description[0];
      newItem.price = prd.price;
      newItem.quantity = 1;
      newItem.updateCartItemTotalPrice();
      this.items.push(newItem);
	}
	
    	this.updatePrices();
  } 

  removeFromCart(pid: string){
	  console.log("removing ", pid)
	  this.items.forEach(item => {
		  if(item._id == pid){
			  const index = this.items.indexOf(item)
			  if(index > -1) this.items.splice(index, 1)
		  }
    })

    this.updatePrices()
    
  }

  productExists(pid: string) : boolean {
    var chc = false;
      this.items.forEach(item => {
             if(item._id === pid){
               chc = true;
             }
       })
     return chc;
  }

  setAddress(addr: Address){
		this.address = addr;
  }

  updatePrices(){
    this.cart_price = 0;
    this.items.forEach(item => {
		    this.cart_price += item.price * item.quantity;
    })

    if(this.cart_price >= 10000){
        this.ship_price = 0;
    }else{
      this.ship_price = this.cart_price * 0.05 
    }

    this.final_price = this.cart_price + this.ship_price;
    return this.final_price;
  }


  getCartCount() {
    let count = 0;
    this.items.forEach(item => {
      console.log(item.quantity);
      count = Number(count) + Number(item.quantity);
    });
     return Number(count);
  }

}
