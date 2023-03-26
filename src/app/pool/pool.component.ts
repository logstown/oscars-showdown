import { Component, Input, isDevMode, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, IonModal, ToastController } from '@ionic/angular';
import * as _ from 'lodash';
import { first, Subscription } from 'rxjs';
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
  darkHorseWinner: OscarUser[];
  knowsActingWinner: {user: OscarUser, points: number}[];
  cinephileWinner: {user: OscarUser, points: number}[];
  
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
          color: 'primary',
          duration: 5000,
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
              color: 'primary',
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
        this.darkHorseWinner = this._getDarkHorse(awards);
        this.knowsActingWinner = this._getKnowsActing(awards);
        this.cinephileWinner = this._getCinephile(awards)
      });
  }

  closeStats() {
    this.modal.dismiss();
  }

  unsub() {
    console.log('unsub')
    this.awardsSub.unsubscribe();
  }

  private _getDarkHorse(awards: AwardCategory[]): OscarUser[] {
    const userPoints = {};
    _.forEach(awards, (award: AwardCategory) => {
      const correctUsers = _.filter(this.poolUsers, (user: OscarUser) => user.picks[award.id]?.id === award.winner);

      _.forEach(correctUsers, user =>{
        if(!userPoints[user.uid]) {
          userPoints[user.uid] = {
            user: user,
            points: 0
          }
        }

        userPoints[user.uid].points += (1/correctUsers.length)
      })
    });

    const userPointsArr: {user: OscarUser; points: number}[] = _.toArray(userPoints);
    const highest = _.maxBy(userPointsArr, 'points');

    console.log('darkhorse', userPointsArr)

    return _.chain(userPointsArr)
      .filter({points: highest?.points})
      .map('user')
      .value()
  }

  private _getKnowsActing(awards: AwardCategory[]): {user: OscarUser, points: number}[] {
    const actingAwards = _.filter(awards, x => _.startsWith(x.award.toLowerCase(), 'act'));

    const userPoints = _.map(this.poolUsers, user => {
      const points = _.reduce(actingAwards, (total, award) => {
        if(user.picks[award.id]?.id === award.winner) {
          total++;
        } 
        return total;
      }, 0);

      return {user, points}
    });

    console.log('acting', userPoints)

    const highest = _.maxBy(userPoints, 'points');
    return _.filter(userPoints, {points: highest.points})
  }

  private _getCinephile(awards: AwardCategory[]): {user: OscarUser, points: number}[] {
    const filmAwards = _.filter(awards, x => _.endsWith(x.award.toLowerCase(), 'film'));

    const userPoints = _.map(this.poolUsers, user => {
      const points = _.reduce(filmAwards, (total, award) => {
        if(user.picks[award.id]?.id === award.winner) {
          total++;
        } 
        return total;
      }, 0);

      return {user, points}
    });

    console.log('cini', userPoints)

    const highest = _.maxBy(userPoints, 'points');
    return _.filter(userPoints, {points: highest.points})
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
