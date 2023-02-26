import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from '../welcome/welcome.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [WelcomeComponent],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [WelcomeComponent]
})
export class HelpersModule { }
