/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, effect, Injectable, input, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoggerService, NormalizePipe, ErrorMessagePipe, NotblankValidator, UppercaseValidator, TypeValidator } from '@my/core';
import { environment } from 'src/environments/environment';
import { ViewModelService } from '../code-base';
import { ProductosDAOService, NotificationService, NavigationService, ModelosDAOService, CategoriasDAOService } from '../common-services';
import { AuthService } from '../security';
import { FormButtons } from '../common-components';
import { HttpParams } from '@angular/common/http';
import { Paginator } from "../common-components/paginator";

@Component({
  selector: 'app-productos',
  imports: [],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})

@Injectable({
  providedIn: 'root'
})
export class ProductosViewModelService extends ViewModelService<any, number> {
  constructor(dao: ProductosDAOService, notify: NotificationService, out: LoggerService,
    auth: AuthService, router: Router, navigation: NavigationService,
    private daoModelos : ModelosDAOService, private daoCategorias: CategoriasDAOService
  ) {
    super(dao, {}, notify, out, auth, router, navigation)
  }

  public override view(key: any): void {
    this.dao.get(key, { params: new HttpParams().set('mode', 'detail') }).subscribe({
      next: data => {
        this.elemento = data;
        this.modo = 'view';
      },
      error: err => this.handleError(err)
    });
  }

  page = 0;
  totalPages = 0;
  totalRows = 0;
  rowsPerPage = 14;
  load(page: number = -1) {
    if (!page || page < 0) page = this.page;
    (this.dao as ProductosDAOService).page(page, this.rowsPerPage).subscribe({
      next: rslt => {
        this.page = rslt.page;
        this.totalPages = rslt.pages;
        this.totalRows = rslt.rows;
        this.listado = rslt.list;
        this.modo = 'list';
      },
      error: err => this.handleError(err)
    })
  }

  modelos: any[] = []
  subcategorias: any[] = []

  override cargaListas() {
    this.daoModelos.query().subscribe({
      next: data => this.modelos = data,
      error: err => this.handleError(err)
    })
    this.daoCategorias.subcategorias().subscribe({
      next: data => this.subcategorias = data,
      error: err => this.handleError(err)
    })
  }
}

@Component({
  selector: 'app-productos-list',
  templateUrl: './tmpl-list.html',
  styleUrls: ['./productos.css'],
  standalone: true,
  imports: [RouterLink, CommonModule, NormalizePipe, Paginator]
})
export class ProductosList implements OnDestroy {
  readonly roleMantenimiento = environment.roleMantenimiento
  readonly page = input(0);

  constructor(protected vm: ProductosViewModelService) {
    effect(() => vm.load(this.page()))
  }

  public get VM(): ProductosViewModelService { return this.vm; }

  ngOnDestroy(): void { this.vm.clear(); }
}

@Component({
  selector: 'app-productos-add',
  templateUrl: './tmpl-form.html',
  styleUrls: ['./productos.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, ErrorMessagePipe, NotblankValidator, UppercaseValidator, TypeValidator, FormButtons]
})
export class ProductosAdd implements OnInit {
  constructor(protected vm: ProductosViewModelService) { }
  public get VM(): ProductosViewModelService { return this.vm; }
  ngOnInit(): void {
    this.vm.add();
  }
}

@Component({
  selector: 'app-productos-edit',
  templateUrl: './tmpl-form.html',
  styleUrls: ['./productos.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, ErrorMessagePipe, NotblankValidator, UppercaseValidator, TypeValidator, FormButtons]
})
export class ProductosEdit implements OnChanges {
  @Input() id?: string;
  constructor(protected vm: ProductosViewModelService, protected router: Router) { }
  public get VM(): ProductosViewModelService { return this.vm; }
  ngOnChanges(_changes: SimpleChanges): void {
    if (this.id) {
      this.vm.edit(+this.id);
    } else {
      this.router.navigate(['/404.html']);
    }
  }
}

@Component({
  selector: 'app-productos-view',
  templateUrl: './tmpl-view.html',
  styleUrls: ['./productos.css'],
  standalone: true,
  imports: [FormButtons, CommonModule]
})
export class ProductosView {
  constructor(protected vm: ProductosViewModelService, protected router: Router) { }
  public get VM(): ProductosViewModelService { return this.vm; }
  @Input() set id(key: string) {
    if (+key) {
      this.vm.view(+key);
    } else {
      this.router.navigate(['/404.html']);
    }
  }
}


export const PRODUCTOS_COMPONENTES = [ProductosList, ProductosAdd, ProductosEdit, ProductosView,];
