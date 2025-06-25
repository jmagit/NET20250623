import { Routes, UrlSegment } from '@angular/router';
import { Home, PageNotFound } from './main';
import { Productos } from './productos';
import { Modelos } from './modelos';
import { Categorias } from './categorias';
import { LoginForm, RegisterUser } from './security';

export function svgFiles(url: UrlSegment[]) {
  return url.length === 1 && url[0].path.endsWith('.svg') ? ({consumed: url}) : null;
}

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home},
  { path: 'inicio', component: Home},
  { path: 'productos', children: [
    { path: '', component: Productos},
    { path: 'add', component: Productos},
    { path: ':id/edit', component: Productos},
    { path: ':id', component: Productos},
    { path: ':id/:kk', component: Productos},
  ]},
  { path: 'modelos', component: Modelos},
  { path: 'categorias', component: Categorias},
  { matcher: svgFiles, loadComponent: () => import('./ejemplos/grafico-svg/grafico-svg')},

  { path: 'login', component: LoginForm },
  { path: 'registro', component: RegisterUser },

  { path: '404.html', component: PageNotFound },
  { path: '**', redirectTo: '/inicio' },
];
