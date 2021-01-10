import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './comps/signin/signin.component';
import { SignupComponent } from './comps/signup/signup.component';
import { UserComponent } from './comps/user/user.component';
import { CartComponent } from './comps/cart/cart.component';
import { ProductComponent } from './comps/product/product.component';
import { SearchComponent } from './comps/search/search.component';
import { HomeComponent } from './comps/home/home.component';


const routes: Routes = [
	{ path:  'signin', component:  SigninComponent},
	{ path:  'signup', component:  SignupComponent},
	{ path:  'user', component:  UserComponent},
	{ path:  'cart', component:  CartComponent},
	{ path:  'product/:pid', component:  ProductComponent},
	{ path:  'search/:q', component:  SearchComponent},
	{ path:  '', component:  HomeComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes,
  				{
  					onSameUrlNavigation: 'reload',
  					scrollPositionRestoration: 'enabled'
  				}
  			)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
