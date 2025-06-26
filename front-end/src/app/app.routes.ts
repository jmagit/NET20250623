import { Routes, UrlSegment } from '@angular/router';
import { Home, PageNotFound } from './main';
import { Modelos } from './modelos';
import { Categorias } from './categorias';
import { AuthCanActivateFn, AuthWithRedirectCanActivate, LoginForm, RegisterUser } from './security';
import { Demos } from './ejemplos';

export function svgFiles(url: UrlSegment[]) {
  return url.length === 1 && url[0].path.endsWith('.svg') ? ({consumed: url}) : null;
}

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home},
  { path: 'inicio', component: Home},
  { path: 'productos', loadChildren: () => import('./productos/modulo'), title: 'Productos'},
  // { path: 'productos', children: [
  //   { path: '', component: Productos},
  //   { path: 'add', component: Productos},
  //   { path: ':id/edit', component: Productos},
  //   { path: ':id', component: Productos},
  //   { path: ':id/:kk', component: Productos},
  // ]},
  { path: 'modelos', component: Modelos},
  { path: 'categorias', component: Categorias, canActivate: [AuthCanActivateFn]},
  { matcher: svgFiles, loadComponent: () => import('./ejemplos/grafico-svg/grafico-svg')},
  { path: 'demos', component: Demos , canActivate: [AuthWithRedirectCanActivate('/login')]},

  { path: 'login', component: LoginForm },
  { path: 'registro', component: RegisterUser },

  { path: '404.html', component: PageNotFound },
  { path: '**', component: PageNotFound /*, redirectTo: '/inicio'*/ },
];
