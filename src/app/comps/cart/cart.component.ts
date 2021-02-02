import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../serv/cart.service';
import { ProductService } from 'src/app/serv/product.service';
import { HttpClient } from '@angular/common/http';
import { Address, UserService } from 'src/app/serv/user.service';
import { Cart } from 'src/app/serv/cart.service';
import { MainService } from 'src/app/serv/main.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css'],

	animations: [
		trigger('fadeIn', [
		  state('void', style({
			opacity: 0
		  })),
		  state('larger', style({
			opacity: 1
		  })),
		  transition('void <=> *',animate(200))
		 ])
		]
})
export class CartComponent implements OnInit {

    payment_option: string = "CASH_ON_DELIVERY";

    newAddressForm = new FormGroup({
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

    checkOut() {
        this.serv.getUserInfo();
        var order = new Order();
        this.cartServ.cart.items.forEach(item => {
            var oitem = new OrderItem();
            oitem.order_item_id = item._id;
            oitem.quantity = item.quantity
            order.order_items.push(oitem);
        });
        order.address = this.cartServ.cart.address;
        order.payment_option = this.payment_option;
        order.payed = order.payment_option == "CASH_ON_DELIVERY" ? false : true;
        this.http.post(
            'http://127.0.0.1:8080/order',
            order,
            {
                headers: this.serv.getHeaders()
            }
        ).subscribe(data => {
            this.cartServ.emptyCart();
            this.serv.getUserInfo();
            this.router.navigate(['/user']);
        }
        );
    }
    saveCartAddress() {
        this.cartServ.cart.address = new Address();
        this.cartServ.cart.address.line_one = this.newAddressForm.controls['line_one'].value;
        this.cartServ.cart.address.line_two = this.newAddressForm.controls['line_two'].value;
        this.cartServ.cart.address.line_three = this.newAddressForm.controls['line_three'].value;
        this.cartServ.cart.address.city = this.newAddressForm.controls['city'].value;
        this.cartServ.cart.address.state = this.newAddressForm.controls['state'].value;
        this.cartServ.cart.address.pincode = this.newAddressForm.controls['pincode'].value;
    }

    asd(){
        console.log("skodk")
        console.log(this.newAddressForm.value)
    }

}


export class Order {
    order_items: OrderItem[] = [];
    address: Address;
    payed: boolean = false;
    date_created: Date;
    delivery_date: Date;
    payment_option: string;
}
export class OrderItem {
    order_item_id: string;
    quantity: number = 1;
}