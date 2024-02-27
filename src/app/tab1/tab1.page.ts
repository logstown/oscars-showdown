import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { combineLatest, Observable, take } from 'rxjs';
import { AppService } from '../app.service';
import { AwardCategory, OscarUser, Pool } from '../models';
import { serverTimestamp } from "firebase/firestore";
import { LoginModalComponent } from '../login-modal/login-modal.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  currentUser?: OscarUser = null;
  pools: Observable<Pool[]>;

  constructor(
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    public appService: AppService,
    private alertController: AlertController,
    private modalController: ModalController,
    private afs: AngularFirestore) { }

  async ngOnInit() {
    // this.doADeal();
    // this.doADeal2();

    combineLatest(this.route.queryParams, this.appService.currentUser$)
      .subscribe(([params, currentUser]) => {
        this.currentUser = currentUser;

        if (params['poolId'] && this.appService.isBeforeCeremony) {
          this._joinPool(params['poolId']);
        } else {
          if (!this.currentUser) {
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
  }

  async addPool() {
    console.log('addpool')
    const alert = await this.alertController.create({
      header: 'Create Pool',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: async (data) => {
            const id = this.afs.createId();
            
            const pool = {
              name: data.name,
              creator: this.currentUser.uid,
              dateCreated: serverTimestamp(),
              users: [this.currentUser.uid],
              id
            } 
            
            await this.afs.collection<Pool>('pools').doc(id).set(pool);
          },
        },
      ],
      inputs: [
        {
          placeholder: 'Name',
          name: 'name'
        }
      ],
    });

    await alert.present();
  }

  logout() {
    this.afAuth.signOut();
  }

  identify(index, item: Pool) {
    return item.id;
  }

  doADeal() {
    let awards2 = [
        {
            "award": "Best picture",
            "nominees": [
                {
                    "film": "American Fiction",
                    "nominee": ""
                },
                {
                    "film": "Anatomy of a Fall",
                    "nominee": ""
                },
                {
                    "film": "Barbie",
                    "nominee": ""
                },
                {
                    "film": "The Holdovers",
                    "nominee": ""
                },
                {
                    "film": "Killers of the Flower Moon",
                    "nominee": ""
                },
                {
                    "film": "Maestro",
                    "nominee": ""
                },
                {
                    "film": "Oppenheimer",
                    "nominee": ""
                },
                {
                    "film": "Past Lives",
                    "nominee": ""
                },
                {
                    "film": "Poor Things",
                    "nominee": ""
                },
                {
                    "film": "The Zone of Interest",
                    "nominee": ""
                }
            ],
            "points": 5
        },
        {
            "award": "Best actor",
            "nominees": [
                {
                    "film": "Maestro",
                    "nominee": "Bradley Cooper"
                },
                {
                    "film": "Rustin",
                    "nominee": "Colman Domingo"
                },
                {
                    "film": "The Holdovers",
                    "nominee": "Paul Giamatti"
                },
                {
                    "film": "Oppenheimer",
                    "nominee": "Cillian Murphy"
                },
                {
                    "film": "American Fiction",
                    "nominee": "Jeffrey Wright"
                }
            ],
            "points": 3
        },
        {
            "award": "Best actress",
            "nominees": [
                {
                    "film": "Nyad",
                    "nominee": "Annette Bening"
                },
                {
                    "film": "Killers of the Flower Moon",
                    "nominee": "Lily Gladstone"
                },
                {
                    "film": "Anatomy of a Fall",
                    "nominee": "Sandra H\u00fcller"
                },
                {
                    "film": "Maestro",
                    "nominee": "Carey Mulligan"
                },
                {
                    "film": "Poor Things",
                    "nominee": "Emma Stone"
                }
            ],
            "points": 3
        },
        {
            "award": "Best supporting actor",
            "nominees": [
                {
                    "film": "American Fiction",
                    "nominee": "Sterling K. Brown"
                },
                {
                    "film": "Killers of the Flower Moon",
                    "nominee": "Robert De Niro"
                },
                {
                    "film": "Oppenheimer",
                    "nominee": "Robert Downey Jr."
                },
                {
                    "film": "Barbie",
                    "nominee": "Ryan Gosling"
                },
                {
                    "film": "Poor Things",
                    "nominee": "Mark Ruffalo"
                }
            ],
            "points": 3
        },
        {
            "award": "Best supporting actress",
            "nominees": [
                {
                    "film": "Oppenheimer",
                    "nominee": "Emily Blunt"
                },
                {
                    "film": "The Color Purple",
                    "nominee": "Danielle Brooks"
                },
                {
                    "film": "Barbie",
                    "nominee": "America Ferrera"
                },
                {
                    "film": "Nyad",
                    "nominee": "Jodie Foster"
                },
                {
                    "film": "The Holdovers",
                    "nominee": "Da'Vine Joy Randolph"
                }
            ],
            "points": 3
        },
        {
            "award": "Best director",
            "nominees": [
                {
                    "film": "The Zone of Interest",
                    "nominee": "Jonathan Glazer"
                },
                {
                    "film": "Poor Things",
                    "nominee": "Yorgos Lanthimos"
                },
                {
                    "film": "Oppenheimer",
                    "nominee": "Christopher Nolan"
                },
                {
                    "film": "Killers of the Flower Moon",
                    "nominee": "Martin Scorsese"
                },
                {
                    "film": "Anatomy of a Fall",
                    "nominee": "Justine Triet"
                }
            ],
            "points": 3
        },
        {
            "award": "International feature film",
            "nominees": [
                {
                    "film": "Io Capitano (Italy)",
                    "nominee": ""
                },
                {
                    "film": "Perfect Days (Japan)",
                    "nominee": ""
                },
                {
                    "film": "Society of the Snow (Spain)",
                    "nominee": ""
                },
                {
                    "film": "The Teachers' Lounge (Germany)",
                    "nominee": ""
                },
                {
                    "film": "The Zone of Interest (United Kingdom)",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Animated feature film",
            "nominees": [
                {
                    "film": "The Boy and the Heron",
                    "nominee": ""
                },
                {
                    "film": "Elemental",
                    "nominee": ""
                },
                {
                    "film": "Nimona",
                    "nominee": ""
                },
                {
                    "film": "Robot Dreams",
                    "nominee": ""
                },
                {
                    "film": "Spider-Man: Across the Spider-Verse",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Adapted screenplay",
            "nominees": [
                {
                    "film": "American Fiction",
                    "nominee": ""
                },
                {
                    "film": "Barbie",
                    "nominee": ""
                },
                {
                    "film": "Oppenheimer",
                    "nominee": ""
                },
                {
                    "film": "Poor Things",
                    "nominee": ""
                },
                {
                    "film": "The Zone of Interest",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Original screenplay",
            "nominees": [
                {
                    "film": "Anatomy of a Fall",
                    "nominee": ""
                },
                {
                    "film": "The Holdovers",
                    "nominee": ""
                },
                {
                    "film": "Maestro",
                    "nominee": ""
                },
                {
                    "film": "May December",
                    "nominee": ""
                },
                {
                    "film": "Past Lives",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Visual effects",
            "nominees": [
                {
                    "film": "The Creator",
                    "nominee": ""
                },
                {
                    "film": "Godzilla Minus One",
                    "nominee": ""
                },
                {
                    "film": "Guardians of the Galaxy Vol. 3",
                    "nominee": ""
                },
                {
                    "film": "Mission: Impossible - Dead Reckoning Part One",
                    "nominee": ""
                },
                {
                    "film": "Napoleon",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Original score",
            "nominees": [
                {
                    "film": "American Fiction",
                    "nominee": ""
                },
                {
                    "film": "Indiana Jones and the Dial of Destiny",
                    "nominee": ""
                },
                {
                    "film": "Killers of the Flower Moon",
                    "nominee": ""
                },
                {
                    "film": "Oppenheimer",
                    "nominee": ""
                },
                {
                    "film": "Poor Things",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Original song",
            "nominees": [
                {
                    "film": "American Symphony",
                    "nominee": "It Never Went Away"
                },
                {
                    "film": "Barbie",
                    "nominee": "I'm Just Ken"
                },
                {
                    "film": "Barbie",
                    "nominee": "What Was I Made For?"
                },
                {
                    "film": "Flamin' Hot",
                    "nominee": "The Fire Inside"
                },
                {
                    "film": "Killers of the Flower Moon",
                    "nominee": "Wahzhazhe (A Song For My People)"
                }
            ],
            "points": 1
        },
        {
            "award": "Documentary feature film",
            "nominees": [
                {
                    "film": "20 Days in Mariupol",
                    "nominee": ""
                },
                {
                    "film": "Bobi Wine: The People's President",
                    "nominee": ""
                },
                {
                    "film": "The Eternal Memory",
                    "nominee": ""
                },
                {
                    "film": "Four Daughters",
                    "nominee": ""
                },
                {
                    "film": "To Kill a Tiger",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Cinematography",
            "nominees": [
                {
                    "film": "El Conde",
                    "nominee": ""
                },
                {
                    "film": "Killers of the Flower Moon",
                    "nominee": ""
                },
                {
                    "film": "Maestro",
                    "nominee": ""
                },
                {
                    "film": "Oppenheimer",
                    "nominee": ""
                },
                {
                    "film": "Poor Things",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Costume design",
            "nominees": [
                {
                    "film": "Barbie",
                    "nominee": ""
                },
                {
                    "film": "Killers of the Flower Moon",
                    "nominee": ""
                },
                {
                    "film": "Napoleon",
                    "nominee": ""
                },
                {
                    "film": "Oppenheimer",
                    "nominee": ""
                },
                {
                    "film": "Poor Things",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Animated short film",
            "nominees": [
                {
                    "film": "Letter to a Pig",
                    "nominee": ""
                },
                {
                    "film": "Ninety-Five Senses",
                    "nominee": ""
                },
                {
                    "film": "Our Uniform",
                    "nominee": ""
                },
                {
                    "film": "Pachyderme",
                    "nominee": ""
                },
                {
                    "film": "War Is Over! Inspired by the Music of John & Yoko",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Live action short film",
            "nominees": [
                {
                    "film": "The After",
                    "nominee": ""
                },
                {
                    "film": "Invincible",
                    "nominee": ""
                },
                {
                    "film": "Knight of Fortune",
                    "nominee": ""
                },
                {
                    "film": "Red, White and Blue",
                    "nominee": ""
                },
                {
                    "film": "The Wonderful Story of Henry Sugar",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Documentary short film",
            "nominees": [
                {
                    "film": "The ABCs of Book Banning",
                    "nominee": ""
                },
                {
                    "film": "The Barber of Little Rock",
                    "nominee": ""
                },
                {
                    "film": "Island in Between",
                    "nominee": ""
                },
                {
                    "film": "The Last Repair Shop",
                    "nominee": ""
                },
                {
                    "film": "N\u01cei Nai & W\u00e0i P\u00f3",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Film editing",
            "nominees": [
                {
                    "film": "Anatomy of a Fall",
                    "nominee": ""
                },
                {
                    "film": "The Holdovers",
                    "nominee": ""
                },
                {
                    "film": "Killers of the Flower Moon",
                    "nominee": ""
                },
                {
                    "film": "Oppenheimer",
                    "nominee": ""
                },
                {
                    "film": "Poor Things",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Sound",
            "nominees": [
                {
                    "film": "The Creator",
                    "nominee": ""
                },
                {
                    "film": "Maestro",
                    "nominee": ""
                },
                {
                    "film": "Mission: Impossible - Dead Reckoning Part One",
                    "nominee": ""
                },
                {
                    "film": "Oppenheimer",
                    "nominee": ""
                },
                {
                    "film": "The Zone of Interest",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Production design",
            "nominees": [
                {
                    "film": "Barbie",
                    "nominee": ""
                },
                {
                    "film": "Killers of the Flower Moon",
                    "nominee": ""
                },
                {
                    "film": "Napoleon",
                    "nominee": ""
                },
                {
                    "film": "Oppenheimer",
                    "nominee": ""
                },
                {
                    "film": "Poor Things",
                    "nominee": ""
                }
            ],
            "points": 1
        }
    ]

    awards2 = _.reverse(awards2)
    console.log(awards2)
    awards2 = _.map(awards2, (award: any, i: number) => {
        award.id = this.afs.createId();
        award.sequence = i;
        award.nominees = _.map(award.nominees, (nominee: any) => {
            nominee.id = this.afs.createId();

            return nominee;
        });
        award.winner = '';
        award.winnerStamp = null;

        return award;
    });

    _.forEach(awards2, (award: any) => this.afs.collection('awards').doc(award.id).set(award))
}

doADeal2() {
    this.afs.collection<AwardCategory>('awards', ref => ref.orderBy('sequence')).valueChanges()
    .subscribe((awards: AwardCategory[]) => {
            _.forEach(awards, award => {
                award.winner = '';
                award.winnerStamp = null;

                this.afs.collection('awards').doc(award.id).update(award);
            })
        })
}

  private _initPools() {
    this.pools = this.afs.collection<Pool>('pools', ref =>
      ref.where('users', 'array-contains', this.currentUser.uid)
    ).valueChanges()
  }

  private async _joinPool(poolId: string): Promise<void> {
    if (this.currentUser) {
        const poolToJoin = await this.afs.collection<Pool>('pools').doc(poolId)
            .valueChanges()
            .pipe(take(1))
            .toPromise() as Pool;

        if (!_.includes(poolToJoin.users, this.currentUser.uid)) {
            poolToJoin.users.push(this.currentUser.uid);
            await this.afs.collection<Pool>('pools').doc(poolId).set(poolToJoin);

            const alert = await this.alertController.create({
              header: 'Hi!',
              message: `You have joined "${poolToJoin.name}"`,
              buttons: ['OK'],
            });
        
            await alert.present();
        }

        this._initPools();
    } else {
      const modal = await this.modalController.create({
        component: LoginModalComponent,
      });
      modal.present();
    }
}

}
