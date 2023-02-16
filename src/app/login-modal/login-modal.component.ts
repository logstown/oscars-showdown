import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { Subscription } from 'rxjs';
import { OscarUser } from '../models';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit, OnDestroy {
  userSub?: Subscription;

  constructor(private modalCtrl: ModalController, private afs: AngularFirestore) { }

  ngOnInit() {}

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    const { displayName, photoURL, uid } = signInSuccessData.authResult.user
    const userRef = this.afs.doc<OscarUser>(`users/${uid}`);

    this.userSub = userRef.valueChanges().subscribe(async user => {
      if(!user) {
        await userRef.set({ uid, displayName, photoURL, points: 0, picks: {}, gotLastAwardCorrect: true });
      } else {
        await userRef.update({photoURL})
      }

      // this.modalCtrl.dismiss(true)   
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(false);
  }

}
