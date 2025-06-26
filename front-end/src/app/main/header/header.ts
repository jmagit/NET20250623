import { Component } from '@angular/core';
import { Login } from "../../security/login/login";
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [Login, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  menu = [
    { path: '/inicio', texto: 'Inicio' },
    { path: '/productos', texto: 'Productos' },
    { path: '/categorias', texto: 'Categorias' },
    { path: '/modelos', texto: 'Modelos' },
    { path: '/algo.svg', texto: 'Grafica'},
    { path: '/demos', texto: 'Demos' },
    { path: '/falsa', texto: 'Error' },
  ]
}
