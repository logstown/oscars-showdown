import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from '../welcome/welcome.component';
import { IonicModule } from '@ionic/angular';
import { PicksStatusComponent } from '../picks.status.component';



@NgModule({
  declarations: [WelcomeComponent,PicksStatusComponent],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [WelcomeComponent, PicksStatusComponent]
})
export class HelpersModule { }
