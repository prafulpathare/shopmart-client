import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../serv/cart.service';
import { ProductService } from 'src/app/serv/product.service';
import { HttpClient } from '@angular/common/http';
import { Address, UserService } from 'src/app/serv/user.service';
import { Cart } from 'src/app/serv/cart.service';
import { MainService } from 'src/app/serv/main.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

    cart: Cart;
    itemQty: number[] = [1,2,3,4,5,6,7,8,9];

    showCustomAddressBox: boolean = false;

  customAddrForm = new FormGroup({
      line_one: new FormControl(''),
      line_two: new FormControl(''),
      line_three: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      pincode: new FormControl('')
  });

    constructor(
        public router: Router,
        public cartServ: CartService,
        public serv: UserService,
        public prdServ: ProductService,
        public mainServ: MainService,
        public http: HttpClient
        ) {
    }

    ngOnInit(): void {
        this.mainServ.showMegaMenu = false;
    }

    getUserInfo() {
        this.http.post(
            this.mainServ.getUserApi()+'user',
            {},
            {
                headers:  this.serv.getHeaders()
            }
            ).subscribe(data => {
                console.log(data)
            }
        );
    }

    checkOut(){
        var checkOut = new CheckOut();
        this.cartServ.cart.items.forEach(item => {
            var checkoutItem = new CheckOutItem();
            checkoutItem.productId = item._id;
            checkoutItem.quantity = item.noofitems;
            checkOut.items.push(checkoutItem);
        });
        checkOut.delivery_address = 
            this.cartServ.cart.deliveryaddr.line_one+", "+
            this.cartServ.cart.deliveryaddr.line_two+", "+
            this.cartServ.cart.deliveryaddr.line_three+", "+
            this.cartServ.cart.deliveryaddr.city+", "+
            this.cartServ.cart.deliveryaddr.state+", "+
            this.cartServ.cart.deliveryaddr.pincode+".";
        this.http.post(
            'http://127.0.0.1:8080/order/checkout', 
            checkOut,
            {
                headers:  this.serv.getHeaders()
            }
            ).subscribe(data => {
                console.log(data);
                this.cartServ.emptyCart();
                this.router.navigate(['/user']);
            }
        );
    }
    saveDelvAddress(){
        this.cartServ.cart.deliveryaddr = new Address();
        this.cartServ.cart.deliveryaddr.line_one = this.customAddrForm.controls['line_one'].value;
        this.cartServ.cart.deliveryaddr.line_two = this.customAddrForm.controls['line_two'].value;
        this.cartServ.cart.deliveryaddr.line_three = this.customAddrForm.controls['line_three'].value;
        this.cartServ.cart.deliveryaddr.city = this.customAddrForm.controls['city'].value;
        this.cartServ.cart.deliveryaddr.state = this.customAddrForm.controls['state'].value;
        this.cartServ.cart.deliveryaddr.pincode = this.customAddrForm.controls['pincode'].value;
    }

}


export class CheckOut{
    items: CheckOutItem[] = [];
    delivery_address: string;
}
export class CheckOutItem{
    productId: string;
    quantity: number = 0;
}