/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RESTDAOService } from '../code-base';
import { AUTH_REQUIRED } from '../security';

@Injectable({
  providedIn: 'root'
})
export class ProductosDAOService extends RESTDAOService<any, number> {
  constructor() {
    super('Products', { context: new HttpContext().set(AUTH_REQUIRED, true) });
  }
  override query(extras = {}): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?modo=short`, Object.assign({}, this.option, extras));
  }
  page(page: number, rows: number = 20): Observable<{ page: number, pages: number, rows: number, list: any[] }> {
    return new Observable(subscriber => {
      const url = `${this.baseUrl}?page=${page}&size=${rows}&sort=name`
      this.http.get<any>(url, this.option).subscribe({
        next: data => subscriber.next({ page: data.number, pages: data.totalPages, rows: data.totalElements, list: data.content }),
        error: err => subscriber.error(err)
      })
    })
  }
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasDAOService extends RESTDAOService<any, number> {
  constructor() {
    super('categorias', { context: new HttpContext().set(AUTH_REQUIRED, true) });
  }
  subcategorias(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/subcategorias`, this.option);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ModelosDAOService extends RESTDAOService<any, number> {
  constructor() {
    super('modelos', { context: new HttpContext().set(AUTH_REQUIRED, true) });
  }
}
