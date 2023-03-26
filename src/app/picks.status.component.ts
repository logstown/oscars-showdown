import { Component, Input } from '@angular/core';
import { OscarUser } from './models';
import { AppService } from './app.service';

@Component({
  selector: 'app-picks-status',
  template: `
    <span>
      <ng-container *ngIf="!isFinishedPicks">
        <ion-icon *ngIf="!isDayOf" color="warning" name="alert-circle"></ion-icon>
        <ion-icon *ngIf="isDayOf" color="danger" name="alert-circle"></ion-icon>
      </ng-container>
      <ion-icon *ngIf="isFinishedPicks" color="success" name="checkmark"></ion-icon>
    </span>
  `
})
export class PicksStatusComponent {
  @Input() user: OscarUser;

  constructor(private appService: AppService) {}

  get isFinishedPicks(): boolean {    
    return Object.keys(this.user.picks).length == this.appService.awardsLength;
  }

  get isDayOf() {
    return this.appService.isDayOf;
  }
}