import { Component } from '@angular/core';
import { LoggerService } from '@my/core';
import { NotificationService } from 'src/app/common-services';

@Component({
  selector: 'app-demos',
  imports: [],
  templateUrl: './demos.html',
  styleUrl: './demos.css'
})
export class Demos {
  constructor(public vm: NotificationService, public out: LoggerService) { }

}
