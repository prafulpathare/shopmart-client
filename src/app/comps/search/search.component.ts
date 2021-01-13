import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from 'src/app/serv/cart.service';
import { MainService } from 'src/app/serv/main.service';
import { Product } from 'src/app/serv/product.service';
import { UserService } from 'src/app/serv/user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: [
    './search.component.css',
    '../home/home.component.css'
  ]
})
export class SearchComponent implements OnInit {

  q: string;
  products: Product[] = new Array();
  sort: string;
  noOfProducts: number;
  totalPages: number;
  pageNumber: number = 0;
  isFirst: boolean;
  isLast: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public mainServ: MainService,
    public cartServ: CartService,
    public serv: UserService,
    private http: HttpClient) {
      this.sort = "id";
    }

  ngOnInit(): void {
    this.q = this.route.snapshot.paramMap.get('q');
    console.log(this.q)
    this.loadSearchResult();
  }

  loadSearchResult(){
    this.http.get(this.mainServ.getProductApi()+"/search?page="+this.pageNumber+"&sort="+this.sort+"&q="+this.q.toLocaleLowerCase())
        .subscribe(data => {
          console.log(data)
          this.products = <Product[]>data['products'];
          this.totalPages = data['totalPages'];
          this.noOfProducts = data['total'];
          this.pageNumber = data['pageNumber'];
          this.isFirst = data['first'];
          this.isLast = data['last'];
        } );
  }
  reload(){
     this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
     this.router.navigate(['/search', this.q]));
  }
  setSortBy(sort: string){
      this.sort = sort;
      this.loadSearchResult();
  }

  updatePageNumber(pgno: number){
      this.pageNumber = pgno;
      this.loadSearchResult();
  }
}

