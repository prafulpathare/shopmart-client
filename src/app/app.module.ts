import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './comps/user/user.component';
import { HomeComponent } from './comps/home/home.component';
import { ProductComponent } from './comps/product/product.component';
import { CartComponent } from './comps/cart/cart.component';
import { HeaderComponent } from './comps/header/header.component';
import { FooterComponent } from './comps/footer/footer.component';
import { SearchComponent } from './comps/search/search.component';
import { SigninComponent } from './comps/signin/signin.component';
import { SignupComponent } from './comps/signup/signup.component';


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    HomeComponent,
    ProductComponent,
    CartComponent,
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    SigninComponent,
    SignupComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }