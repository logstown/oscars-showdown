import { Injectable } from '@angular/core';
import * as moment from 'moment';
// import { AngularFirestore } from '@angular/fire/firestore';
import { AwardCategory, OscarUser } from './models';
import { ReplaySubject, Subject } from 'rxjs';
import * as _ from 'lodash';
import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable()
export class AppService {
    private _winnersSubject: ReplaySubject<AwardCategory[]> = new ReplaySubject();
    private _currentTime: moment.Moment =  moment();
    private _ceremonyStart: moment.Moment = moment.utc({years: 2023, months: 2, days: 13, hours: 0});
    private _totalPossiblePoints: number = 0;
    private _awardsLength: number = 0;
    private _winnersLength: number = 0;
    private _currentUserSubject: ReplaySubject<OscarUser> = new ReplaySubject();
    
    constructor(private afs: AngularFirestore) {
        this.afs.collection<AwardCategory>('awards', ref => ref.orderBy('sequence')).valueChanges()
            .subscribe(awards => {
                console.log('awards fired')
                this._awardsLength = awards.length;
                this._totalPossiblePoints = _.reduce(awards, (sum, award) => sum + award.points, 0)

                const winners = _.filter(awards, 'winner');
                if(_.every(winners, 'winnerStamp')) {
                    this._winnersLength = winners.length;
                    this._winnersSubject.next(winners)
                }
            });

        setInterval(() => this._currentTime = moment(), 1000)
    }

    get isBeforeCeremony() {
        return this._currentTime.isBefore(this._ceremonyStart);
    }

    get isAfterCeremonyStart() {
        return this._currentTime.isAfter(this._ceremonyStart);
    }

    get timeUntilCeremony() {
        return this._currentTime.to(this._ceremonyStart);
    }

    get isDayOf() {
        return this._currentTime.isAfter(_.cloneDeep(this._ceremonyStart).subtract(1,'day'));
    }

    get winners$() {
        return this._winnersSubject;
    }

    get totalPossiblePoints() {
        return this._totalPossiblePoints;
    }

    get awardsLength() {
        return this._awardsLength;
    }

    get itsOver() {
        return this._winnersLength == this._awardsLength;
    }

    get currentUser$() {
        return this._currentUserSubject;
    }
}