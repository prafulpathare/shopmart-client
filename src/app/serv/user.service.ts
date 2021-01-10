import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService } from './cart.service';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  cntr:number = 0;
  user: User = new User();
  profile_loc: string = 'http://127.0.0.1/cdn.shopmart/profiles/';

  constructor(
    private http: HttpClient,
    private router: Router,
    private mainServ: MainService,
    private cartServ: CartService
  ) {
    this.getUserInfo();
  }

  getUserInfo() {
    this.cntr = this.cntr + 1;
    this.http.get(
      this.mainServ.getUserApi(),
      {
        headers: this.getHeaders()
      }
    ).subscribe(data => {
      this.user.isAuthenticated = true;
      this.user.uid = data['user']['uid'];
      this.user.profile = data['user']['isprofile'] == 1 ? this.profile_loc+data['user']['uid']+'.png?mode='+this.cntr : this.profile_loc+'default.png';
      this.user.name = data['user']['name'];
      this.user.email = data['user']['email'];
      this.user.contact = data['user']['contact'];
      this.user.home_address = data['addresses'][1] ? data['addresses'][1] : null;
      this.user.office_address = data['addresses'][0] ? data['addresses'][0] : null;
      this.cartServ.cart.deliveryaddr = data['addresses'][1] ?  data['addresses'][1] : null;
    }
    );
  }
  logout() {
    localStorage.clear();
    this.user.isAuthenticated = false;
    this.router.navigate(['signin'])
  }

  checkAuth() {
    return (localStorage.getItem("jwt") === null) ? false : true;
  }
  getHomeAddr() {
    return this.user.isAuthenticated ? this.user.home_address : "Log in to set Home address";
  }
  getOfficeAddr() {
    return this.user.isAuthenticated ? this.user.office_address : "Log in to set Office address";
  }
  getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("jwt")
    });
  }
}

export class User {
  public uid: number;
  public name: string;
  public isAuthenticated: boolean = false;
  public email: string;
  public contact: string;
  public isSeller: boolean = false;
  public profile: string;
  public home_address: Address;
  public office_address: Address;
  public delivery_address: Address;

  constructor(){
    this.home_address = new Address();
    this.office_address = new Address();
    this.delivery_address = new Address();
  }

}

export class Address{
  public addrid: number = 0;
  public uid: number = 0;
  public line_one: string = "";
  public line_two: string = "";
  public line_three: string = "";
  public city:  string = "";
  public state: string = "";
  public pincode: number = null;

  toStr(){
    return "["+this.addrid+"] "+this.line_one+", "+this.line_two+", "+this.line_three+", "+this.city+", "+this.state+" - "+this.pincode+".";
  }
}