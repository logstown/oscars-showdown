import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { combineLatest, Observable } from 'rxjs';
import { AppService } from '../app.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { OscarUser, Pool } from '../models';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  currentUser?: OscarUser = null;
  pools: Observable<Pool[]>;

  constructor(private modalCtrl: ModalController, 
    private afAuth: AngularFireAuth, 
    private route: ActivatedRoute, 
    private appService: AppService,
    private toastController: ToastController,
    private afs: AngularFirestore) { }

  async ngOnInit() {
    // this.doADeal();
    // this.doADeal2();

    combineLatest(this.route.queryParams, this.appService.currentUser$)
        .subscribe(([params, currentUser]) => {
            if (params['poolId'] && this.appService.isBeforeCeremony) {
                // this._joinPool(params['poolId'], currentUser);
            } else {
              this.currentUser = currentUser;

                if (!currentUser) {
                    return;
                }

                this._initPools();

                // if (this.appService.isAfterCeremonyStart) {
                //     this.appService.winners$
                //         .subscribe(() => {
                //             if (this.appService.itsOver) {
                //                 var confettiSettings = { "target": "my-canvas", "clock": "30", max: 94, "rotate": true, "start_from_edge": true, "respawn": true };
                //                 var confetti = new ConfettiGenerator(confettiSettings);
                //                 confetti.render();
                //             }
                //         });
                // }
            }

        });

    if (this.appService.isBeforeCeremony) {
        // this._snackBar.open(`Ceremony starts ${this.appService.timeUntilCeremony}!`, 'Ok');
          const toast = await this.toastController.create({
            message: `Ceremony starts ${this.appService.timeUntilCeremony}!`,
            duration: 3000,
            position: 'bottom'
          });
      
          await toast.present();
    }
}

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

  logout() {
    this.afAuth.signOut();
  }

  private _initPools() {
    this.pools = this.afs.collection<Pool>('pools', ref =>
        ref.where('users', 'array-contains', this.currentUser.uid)
    ).valueChanges()
  }

}
