import { Component } from '@angular/core';
import { LoggerService } from '@my/core';
import { NotificationService } from 'src/app/common-services';
import { Card } from "../../common-components/card";

@Component({
  selector: 'app-demos',
  imports: [Card],
  templateUrl: './demos.html',
  styleUrl: './demos.css'
})
export class Demos {
  constructor(public vm: NotificationService, public out: LoggerService) {
    out.error('Es un error')
    out.warn('Es un warn')
    out.info('Es un info')
    out.log('Es un log')
  }

}
