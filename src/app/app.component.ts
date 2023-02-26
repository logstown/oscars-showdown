import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import * as _ from 'lodash';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { AppService } from './app.service';
import { AwardCategory, OscarUser } from './models';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private appService: AppService, private toastController: ToastController) {
    this.afAuth.authState.subscribe(async authUser => {
      console.log('authUser', authUser)
      if (!authUser) {
        this.appService.currentUser$.next(null);
        return;
      }

      const { uid, displayName, photoURL } = authUser;
      const userRef = this.afs.doc<OscarUser>(`users/${authUser.uid}`);
      const user$ = userRef.valueChanges();
      let user = await firstValueFrom(user$);

      console.log(user)

      if (!user) {
        user = { uid, displayName, photoURL, picks: {}, points: 0, gotLastAwardCorrect: true }
        await userRef.set(user)
      } else {
        userRef.update({photoURL})
      }

      this.appService.currentUser$.next(user);
    });

    if(this.appService.isAfterCeremonyStart) {
      this.appService.winners$.subscribe(async winners => {
        const latestAward: AwardCategory = _.maxBy(winners, winner => winner.winnerStamp.toMillis());
      
        if(latestAward) {
          const winningNominee = _.find(latestAward.nominees, {id: latestAward.winner});
          const winnerString = winningNominee.nominee ? winningNominee.nominee : winningNominee.film;
  
          const toast = await this.toastController.create({
            message: `${winnerString} has won for ${latestAward.award}`,
            position: 'top',
            icon: 'trophy',
            buttons: [
              {
                text: 'Ok',
                role: 'info'
              }
            ]
          });
      
          await toast.present();
        }
      })
    }
  }


}
