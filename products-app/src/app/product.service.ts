import { DepartmentService } from './department.service';
import { BehaviorSubject, combineLatest, empty, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './product';
import { filter, map, tap } from 'rxjs/operators';
import { Department } from './department';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  readonly url = 'http://localhost:3000/products';
  private productsSubject$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  private loaded: boolean = false;

  constructor(
    private http: HttpClient,
    private departmentService: DepartmentService) { }

  get(): Observable<Product[]> {
    if (!this.loaded) {

      /* this.http.get<Product[]>(this.url)
        .pipe()
        .subscribe(this.productsSubject$); */


      combineLatest(
        this.http.get<Product[]>(this.url),
        this.departmentService.get())
        .pipe(
          filter(([products, departments]) => products.length>0 && departments.length>0),
          map(([products, departements]) => {
            for (let p of products) {
              let ids = (p.departments as string[]);
              p.departments = ids.map((id) => departements.find(dep => dep._id == id)) as Department[];
            }
            return products;
          }),
          tap((prods) => console.log(prods))
        )
        .subscribe(this.productsSubject$);

      this.loaded = true;
    }
    return this.productsSubject$.asObservable();
  }

  add(prod: Product): Observable<Product> {
    let departments = (prod.departments as Department[])
      .map(d => d._id);
    return this.http.post<Product>(this.url, { ...prod, departments })
      .pipe(
        tap((p) => {
          this.productsSubject$.getValue()
            .push({ ...prod, _id: p._id });
        })
      )
  }

  del(prod: Product): Observable<any> {
    return this.http.delete(`${this.url}/${prod._id}`)
      .pipe(
        tap(() => {
          let products = this.productsSubject$.getValue();
          let i = products.findIndex(p => p._id === prod._id);
          if (i >= 0)
            products.splice(i, 1);
        })
      )
  }

  update(prod: Product): Observable<Product> {
    let departments = (prod.departments as Department[]).map(d => d._id);
    return this.http.patch<Product>(`${this.url}/${prod._id}`, { ...prod, departments: departments })
      .pipe(
        tap((p) => {
          let products = this.productsSubject$.getValue();
          let i = products.findIndex(p => p._id == prod._id);
          if (i >= 0)
            products[i] = prod;
        })

      )
  }
}
