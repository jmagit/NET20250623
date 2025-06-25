import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [ RouterLink ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  menu = [
      { path: '/inicio', texto: 'Home'},
      { path: '/productos', texto: 'Productos'},
      { path: '/modelos', texto: 'Modelos'},
      { path: '/categorias', texto: 'Categorias'},
      { path: '/algo.svg', texto: 'Grafica'},
      { path: '/falsa', texto: 'Error'},
  ]
}
