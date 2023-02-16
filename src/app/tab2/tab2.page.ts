import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as _ from 'lodash';
import { AppService } from '../app.service';
import { AwardCategory, Nominee, OscarUser } from '../models';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  awards?: AwardCategory[];
  currentUser: OscarUser;

  constructor(private afs: AngularFirestore, public appService: AppService) {}

  ngOnInit() {
    // console.log(this.currentUser)
    this.appService.awards$.subscribe(x => {
      this.awards = x;
    });

    this.appService.currentUser$.subscribe(x => this.currentUser = x)
  }

  getAwardColor(award: AwardCategory): string {
    if(this.appService.isBeforeCeremony) {
      return 'primary';
    }

    if(this.currentUser.picks[award.id]?.id === award.winner) {
      return 'success';
    } else {
      return 'danger';
    }

  }

  async nomineePicked(e, award: AwardCategory) {
    this.currentUser.picks[award.id] = _.find(award.nominees, {id: e.detail.value});
    
    await this.afs.doc<OscarUser>(`users/${this.currentUser.uid}`).update(this.currentUser);
  }

  setWinner(award: AwardCategory, nominee: Nominee) {
    award.winner = nominee.id;
    // award.winnerStamp = firebase.default.firestore.FieldValue.serverTimestamp();
    
    this.afs.doc<AwardCategory>(`awards/${award.id}`).update(award);
  }

}
