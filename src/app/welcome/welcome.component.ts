import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  async launchLogin() {
    const modal = await this.modalCtrl.create({
      component: LoginModalComponent,
    });
    modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      console.log('logged in!')
    }
  }

}
