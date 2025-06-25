import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./main/header/header";
import { Footer } from "./main/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
