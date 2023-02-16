import { Component, Input } from '@angular/core';
import { OscarUser } from './models';
import { AppService } from './app.service';

@Component({
  selector: 'app-picks-status',
  template: `
    <ng-container *ngIf="user">
        <ion-icon *ngIf="!isFinishedPicks" color="danger" name="alert-circle"></ion-icon>
        <ion-icon *ngIf="isFinishedPicks" color="success" name="checkmark"></ion-icon>
    </ng-container>
  `
})
export class PicksStatusComponent {
  @Input() user: OscarUser;

  constructor(private appService: AppService) {}

  get isFinishedPicks(): boolean {
    return Object.keys(this.user.picks).length == this.appService.awardsLength;
  }
}