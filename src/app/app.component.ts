import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AppService } from './app.service';
import { OscarUser } from './models';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private appService: AppService) {
    this.afAuth.authState.subscribe(authUser => {
      let userRef = this.afs.doc<OscarUser>(`users/${authUser.uid}`)

      userRef.valueChanges()
        .subscribe(user => {
          if (!user) {
            const { uid, displayName, photoURL } = authUser;
            userRef.set({ uid, displayName, photoURL, picks: {}, points: 0, gotLastAwardCorrect: true })
          } else {
            console.log(user)
            this.appService.currentUser$.next(user);
          }
        })
    })
  }


}
