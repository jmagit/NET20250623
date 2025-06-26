import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./main/header/header";
import { Footer } from "./main/footer/footer";
import { AjaxWait } from "./main/ajax-wait";
import { NotificationModal } from "./main/notification-modal/notification-modal";
import { Notification } from "./main/notification/notification";
import { NavigationService } from './common-services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, AjaxWait, NotificationModal, Notification],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(_cache: NavigationService) { }
}
