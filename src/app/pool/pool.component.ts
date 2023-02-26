import { Component, Input, isDevMode, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, IonModal, ToastController } from '@ionic/angular';
import * as _ from 'lodash';
import { first, Observable, Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { AwardCategory, OscarUser, Pool } from '../models';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss'],
})
export class PoolComponent implements OnInit {
  @Input() pool: Pool;

  @ViewChild(IonModal) modal: IonModal;

  poolUsers: OscarUser[];
  currentUser: OscarUser;
  awardPicks: any[];
  awardsSub: Subscription;
  
  constructor(private afs: AngularFirestore, 
    public appService: AppService, 
    private alertController: AlertController,
    private toastController: ToastController) { }

  async ngOnInit() {
    const poolUserPromises = _.map(this.pool.users, uid =>
      this.afs.doc<OscarUser>(`users/${uid}`).valueChanges().pipe(first()).toPromise()
    );
    this.poolUsers = await Promise.all(poolUserPromises);
    this.appService.currentUser$.subscribe(x => this.currentUser = x);
    
    if(this.appService.isBeforeCeremony) {
      return;
    }

    this.appService.winners$.subscribe(async winners => {
      this._compileScores(winners);

      if(this.appService.itsOver) {
        const winners = _.filter(this.poolUsers, {points: this.poolUsers[0].points});
        const winnersString = _.reduce(winners, (wString, winner, i) => {
          wString += winner.displayName;
          if(i < winners.length-1) {
            wString += ', ';
          }

          return wString;
        }, '');

        const toast = await this.toastController.create({
          message: `Congratulations ${winnersString}! Way to know movies!`,
          duration: 3000,
          position: 'top'
        });
    
        await toast.present();
      }
    })
  }

  removeFromPool(user: OscarUser, message: string) {
    if(confirm(message)) {
      _.pull(this.pool.users, user.uid);
  
      this.afs.collection<Pool>('pools').doc(this.pool.id).set(this.pool);
    }
  }

  leavePool(): void {
    if(this.pool.creator == this.currentUser.uid) {
      if(confirm('Delete Pool? All users will be removed.')) {
        this.afs.collection<Pool>('pools').doc(this.pool.id).delete();
      }
    } else {
      this.removeFromPool(this.currentUser, 'Leave Pool?');
    }
  }

  getProgress(user: OscarUser) {
    return user.points / this.appService.totalPossiblePoints
  }

  async inviteOthers() {
    const url = isDevMode() ? 'http://localhost:8100/tabs/tab1' : 'http://oscars.firebaseapp.com';
    const linkToCopy = `${url}?poolId=${this.pool.id}`;

    const alert = await this.alertController.create({
      header: this.pool.name,
      subHeader: 'Invite others by sending them this link:',
      message: linkToCopy,
      buttons: [
        {
          text: 'Copy to Clipboard',
          role: 'confirm',
          handler: async () => {
            const selBox = document.createElement('textarea');
            selBox.style.position = 'fixed';
            selBox.style.left = '0';
            selBox.style.top = '0';
            selBox.style.opacity = '0';
            selBox.value = linkToCopy;
            document.body.appendChild(selBox);
            selBox.focus();
            selBox.select();
            document.execCommand('copy');
            document.body.removeChild(selBox);

            const toast = await this.toastController.create({
              message: 'Link Copied',
              duration: 3000,
              position: 'top'
            });
        
            await toast.present();
          },
        },
        {
          text: 'Close',
          role: 'cancel'
        }
      ],
    });

    await alert.present();
  }

  compileStats() {
    this.awardsSub = this.afs.collection<AwardCategory>('awards', ref => ref.orderBy('sequence'))
      .valueChanges().subscribe(awards => {
        this.awardPicks = _.map(awards, (award: any) => {
          award.nominees = _.chain(award.nominees)
            .map((nominee: any) => {
              nominee.users = _.filter(this.poolUsers, user => user.picks[award.id] && user.picks[award.id].id == nominee.id);
              return nominee;
            })
            .filter(nominee => nominee.users.length || nominee.id === award.winner)
            .value();

          return award;
        });
        console.log(this.awardPicks)

        // this.darkHorseWinner = this._getDarkHorse(awards);
        // this._getFanboys();
      });
  }

  closeStats() {
    this.modal.dismiss();
  }

  unsub() {
    console.log('unsub')
    this.awardsSub.unsubscribe();
  }

  private async _compileScores(winners: AwardCategory[]) {
    const latestAward: AwardCategory = _.maxBy(winners, winner => winner.winnerStamp.toMillis());

    this.poolUsers = _.chain(this.poolUsers)
      .map((user: OscarUser) => {
        user.points = _.reduce(winners, (sum, winner) => {
          if(user.picks[winner.id]?.id == winner.winner) {
            sum += winner.points;
          } 
          
          return sum;
        }, 0);

        if(latestAward) {
          user.gotLastAwardCorrect = user.picks[latestAward.id]?.id == latestAward.winner;
        } else {
          user.gotLastAwardCorrect = true;
        }

        return user;
      }) 
      .orderBy('points', 'desc')
      .value();
  }

}
