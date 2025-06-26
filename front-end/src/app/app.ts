import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./main/header/header";
import { Footer } from "./main/footer/footer";
import { AjaxWait } from "./main/ajax-wait";
import { NotificationModal } from "./main/notification-modal/notification-modal";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, AjaxWait, NotificationModal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
