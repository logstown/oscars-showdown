import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { serverTimestamp } from 'firebase/firestore';
import * as _ from 'lodash';
import { first, Observable } from 'rxjs';
import { AppService } from '../app.service';
import { AwardCategory, Nominee, OscarUser, Pool } from '../models';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  awards$: Observable<AwardCategory[]>;
  currentUser: OscarUser;
  userPools: Pool[];
  chosenPool: Pool;
  poolUsers: OscarUser[];

  constructor(private afs: AngularFirestore, public appService: AppService, private afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.awards$ = this.afs.collection<AwardCategory>('awards', ref => ref.orderBy('sequence')).valueChanges();

    this.appService.currentUser$.subscribe(x => {
      this.currentUser = x;

      if(this.appService.isAfterCeremonyStart) {
        this.afs.collection<Pool>('pools', ref =>
          ref.where('users', 'array-contains', this.currentUser.uid)
        ).valueChanges().subscribe(pools => {
          this.userPools = pools;
          this.chosenPool = this.userPools[0];
          this.poolChosen();
        })
      }
    });

  }

  async poolChosen() {
    const poolUserPromises = _.map(this.chosenPool.users, uid =>
      this.afs.doc<OscarUser>(`users/${uid}`).valueChanges().pipe(first()).toPromise()
    );
    this.poolUsers = await Promise.all(poolUserPromises);
  }

  getAwardColor(award: AwardCategory): string {
    if(this.appService.isBeforeCeremony || !award.winner) {
      return 'tertiary';
    }

    if(this.currentUser.picks[award.id]?.id === award.winner) {
      return 'success';
    } else {
      return 'danger';
    }
  }

  async nomineePicked(e, award: AwardCategory) {
    console.log('nom')
    this.currentUser.picks[award.id] = _.find(award.nominees, {id: e.detail.value});
    
    await this.afs.doc<OscarUser>(`users/${this.currentUser.uid}`).update(this.currentUser);
  }

  setWinner(award: AwardCategory, nominee: Nominee) {
    award.winner = nominee.id;
    award.winnerStamp = serverTimestamp();
    
    this.afs.doc<AwardCategory>(`awards/${award.id}`).update(award);
  }

  logout() {
    this.afAuth.signOut();
  }

  identify(index, award:AwardCategory) {
    return award.id;
  }

}
