import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { OscarUser } from '../models';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  currentUser: OscarUser;

  constructor(public appService: AppService) {
    this.appService.currentUser$.subscribe(x => this.currentUser =x)
  }

}
