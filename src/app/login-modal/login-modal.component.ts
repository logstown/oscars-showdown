import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { lastValueFrom, Subscription } from 'rxjs';
import { OscarUser } from '../models';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit {
  userSub?: Subscription;

  constructor(private modalCtrl: ModalController, private afs: AngularFirestore) { }

  ngOnInit() {}

  async successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    console.log('sucess')


    // const { displayName, photoURL, uid } = signInSuccessData.authResult.user
    // const userRef = this.afs.doc<OscarUser>(`users/${uid}`);


    // const user$ = userRef.valueChanges();
    // const user = await lastValueFrom(user$);

    // if(!user) {
    //   await userRef.set({ uid, displayName, photoURL, points: 0, picks: {}, gotLastAwardCorrect: true });
    // } else {
    //   await userRef.update({photoURL})
    // }

      this.modalCtrl.dismiss(true) 
  }

  cancel() {
    return this.modalCtrl.dismiss(false);
  }

}
