import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { combineLatest, Observable, take } from 'rxjs';
import { AppService } from '../app.service';
import { OscarUser, Pool } from '../models';
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
            "award": "Best Picture",
            "nominees": [
                {
                    "film": "All Quiet on the Western Front",
                    "nominee": ""
                },
                {
                    "film": "Avatar: The Way of Water",
                    "nominee": ""
                },
                {
                    "film": "The Banshees of Inisherin",
                    "nominee": ""
                },
                {
                    "film": "Elvis",
                    "nominee": ""
                },
                {
                    "film": "Everything Everywhere All at Once",
                    "nominee": ""
                },
                {
                    "film": "The Fabelmans",
                    "nominee": ""
                },
                {
                    "film": "T\u00e1r",
                    "nominee": ""
                },
                {
                    "film": "Top Gun: Maverick",
                    "nominee": ""
                },
                {
                    "film": "Triangle of Sadness",
                    "nominee": ""
                },
                {
                    "film": "Women Talking",
                    "nominee": ""
                }
            ],
            "points": 5
        },
        {
            "award": "Actor in a Leading Role",
            "nominees": [
                {
                    "film": "Elvis",
                    "nominee": "Austin Butler"
                },
                {
                    "film": "The Banshees of Inisherin",
                    "nominee": "Colin Farrell"
                },
                {
                    "film": "The Whale",
                    "nominee": "Brendan Fraser"
                },
                {
                    "film": "Aftersun",
                    "nominee": "Paul Mescal"
                },
                {
                    "film": "Living (Sony Pictures Classics)",
                    "nominee": "Bill Nighy"
                }
            ],
            "points": 3
        },
        {
            "award": "Actress in a Leading Role",
            "nominees": [
                {
                    "film": "T\u00e1r",
                    "nominee": "Cate Blanchett"
                },
                {
                    "film": "Blonde",
                    "nominee": "Ana de Armas"
                },
                {
                    "film": "To Leslie (Momentum Pictures)",
                    "nominee": "Andrea Riseborough"
                },
                {
                    "film": "The Fabelmans",
                    "nominee": "Michelle Williams"
                },
                {
                    "film": "Everything Everywhere All at Once",
                    "nominee": "Michelle Yeoh"
                }
            ],
            "points": 3
        },
        {
            "award": "Directing",
            "nominees": [
                {
                    "film": "The Banshees of Inisherin",
                    "nominee": "Martin McDonagh"
                },
                {
                    "film": "Everything Everywhere All at Once",
                    "nominee": "Daniel Kwan & Daniel Scheinert"
                },
                {
                    "film": "The Fabelmans",
                    "nominee": "Steven Spielberg"
                },
                {
                    "film": "T\u00e1r",
                    "nominee": "Todd Field"
                },
                {
                    "film": "Triangle of Sadness",
                    "nominee": "Ruben \u00d6stlund"
                }
            ],
            "points": 3
        },
        {
            "award": "Actor in a Supporting Role",
            "nominees": [
                {
                    "film": "The Banshees of Inisherin",
                    "nominee": "Brendan Gleeson"
                },
                {
                    "film": "Causeway (Apple)",
                    "nominee": "Brian Tyree Henry"
                },
                {
                    "film": "The Fabelmans",
                    "nominee": "Judd Hirsch"
                },
                {
                    "film": "The Banshees of Inisherin",
                    "nominee": "Barry Keoghan"
                },
                {
                    "film": "Everything Everywhere All at Once",
                    "nominee": "Ke Huy Quan"
                }
            ],
            "points": 3
        },
        {
            "award": "Actress in a Supporting Role",
            "nominees": [
                {
                    "film": "Black Panther: Wakanda Forever",
                    "nominee": "Angela Bassett"
                },
                {
                    "film": "The Whale",
                    "nominee": "Hong Chau"
                },
                {
                    "film": "The Banshees of Inisherin",
                    "nominee": "Kerry Condon"
                },
                {
                    "film": "Everything Everywhere All at Once",
                    "nominee": "Jamie Lee Curtis"
                },
                {
                    "film": "Everything Everywhere All at Once",
                    "nominee": "Stephanie Hsu"
                }
            ],
            "points": 3
        },
        {
            "award": "Animated Feature Film",
            "nominees": [
                {
                    "film": "Guillermo del Toro\u2019s Pinocchio",
                    "nominee": ""
                },
                {
                    "film": "Marcel the Shell with Shoes On",
                    "nominee": ""
                },
                {
                    "film": "Puss in Boots: The Last Wish",
                    "nominee": ""
                },
                {
                    "film": "The Sea Beast",
                    "nominee": ""
                },
                {
                    "film": "Turning Red",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Documentary Feature Film",
            "nominees": [
                {
                    "film": "All That Breathes",
                    "nominee": ""
                },
                {
                    "film": "All the Beauty and the Bloodshed",
                    "nominee": ""
                },
                {
                    "film": "Fire of Love",
                    "nominee": ""
                },
                {
                    "film": "A House Made of Splinters",
                    "nominee": ""
                },
                {
                    "film": "Navalny",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "International Feature Film",
            "nominees": [
                {
                    "film": "All Quiet on the Western Front (Germany)",
                    "nominee": ""
                },
                {
                    "film": "Argentina, 1985 (Argentina)",
                    "nominee": ""
                },
                {
                    "film": "Close (Belgium)",
                    "nominee": ""
                },
                {
                    "film": "EO (Poland)",
                    "nominee": ""
                },
                {
                    "film": "The Quiet Girl (Ireland)",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Writing (Adapted Screenplay)",
            "nominees": [
                {
                    "film": "All Quiet on the Western Front",
                    "nominee": ""
                },
                {
                    "film": "Glass Onion: A Knives Out Mystery",
                    "nominee": ""
                },
                {
                    "film": "Living",
                    "nominee": ""
                },
                {
                    "film": "Top Gun: Maverick",
                    "nominee": ""
                },
                {
                    "film": "Women Talking",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Writing (Original Screenplay)",
            "nominees": [
                {
                    "film": "The Banshees of Inisherin",
                    "nominee": ""
                },
                {
                    "film": "Everything Everywhere All at Once",
                    "nominee": ""
                },
                {
                    "film": "The Fabelmans",
                    "nominee": ""
                },
                {
                    "film": "T\u00e1r",
                    "nominee": ""
                },
                {
                    "film": "Triangle of Sadness",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Cinematography",
            "nominees": [
                {
                    "film": "All Quiet on the Western Front",
                    "nominee": ""
                },
                {
                    "film": "Bardo",
                    "nominee": ""
                },
                {
                    "film": "Elvis",
                    "nominee": ""
                },
                {
                    "film": "Empire of Light",
                    "nominee": ""
                },
                {
                    "film": "T\u00e1r",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Film Editing",
            "nominees": [
                {
                    "film": "The Banshees of Inisherin",
                    "nominee": ""
                },
                {
                    "film": "Elvis",
                    "nominee": ""
                },
                {
                    "film": "Everything Everywhere All at Once",
                    "nominee": ""
                },
                {
                    "film": "T\u00e1r",
                    "nominee": ""
                },
                {
                    "film": "Top Gun: Maverick",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Music (Original Score)",
            "nominees": [
                {
                    "film": "All Quiet on the Western Front",
                    "nominee": ""
                },
                {
                    "film": "Babylon",
                    "nominee": ""
                },
                {
                    "film": "The Banshees of Inisherin",
                    "nominee": ""
                },
                {
                    "film": "Everything Everywhere All at Once",
                    "nominee": ""
                },
                {
                    "film": "The Fabelmans",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Music (Original Song)",
            "nominees": [
                {
                    "film": "Tell It like a Woman",
                    "nominee": "\u201cApplause\u201d"
                },
                {
                    "film": "Top Gun: Maverick",
                    "nominee": "\u201cHold My Hand\u201d"
                },
                {
                    "film": "Black Panther: Wakanda Forever",
                    "nominee": "\u201cLift Me Up\u201d"
                },
                {
                    "film": "RRR",
                    "nominee": "\u201cNaatu Naatu\u201d"
                },
                {
                    "film": "Everything Everywhere All at Once",
                    "nominee": "\u201cThis Is A Life\u201d"
                }
            ],
            "points": 1
        },
        {
            "award": "Production Design",
            "nominees": [
                {
                    "film": "All Quiet on the Western Front",
                    "nominee": ""
                },
                {
                    "film": "Avatar: The Way of Water",
                    "nominee": ""
                },
                {
                    "film": "Babylon",
                    "nominee": ""
                },
                {
                    "film": "Elvis",
                    "nominee": ""
                },
                {
                    "film": "The Fabelmans",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Costume Design",
            "nominees": [
                {
                    "film": "Babylon",
                    "nominee": ""
                },
                {
                    "film": "Black Panther: Wakanda Forever",
                    "nominee": ""
                },
                {
                    "film": "Elvis",
                    "nominee": ""
                },
                {
                    "film": "Everything Everywhere All at Once",
                    "nominee": ""
                },
                {
                    "film": "Mrs. Harris Goes to Paris",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Makeup and Hairstyling",
            "nominees": [
                {
                    "film": "All Quiet",
                    "nominee": ""
                },
                {
                    "film": "The Batman",
                    "nominee": ""
                },
                {
                    "film": "Black Panther",
                    "nominee": ""
                },
                {
                    "film": "Elvis",
                    "nominee": ""
                },
                {
                    "film": "The Whale",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Live Action Short Film",
            "nominees": [
                {
                    "film": "An Irish Goodbye",
                    "nominee": ""
                },
                {
                    "film": "Ivalu",
                    "nominee": ""
                },
                {
                    "film": "Le Pupille",
                    "nominee": ""
                },
                {
                    "film": "Night Ride",
                    "nominee": ""
                },
                {
                    "film": "The Red Suitcase",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Documentary Short Film",
            "nominees": [
                {
                    "film": "The Elephant Whisperers",
                    "nominee": ""
                },
                {
                    "film": "Haulout",
                    "nominee": ""
                },
                {
                    "film": "How Do You Measure a Year",
                    "nominee": ""
                },
                {
                    "film": "The Martha Mitchell Effect",
                    "nominee": ""
                },
                {
                    "film": "Stranger at the Gate",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Animated Short Film",
            "nominees": [
                {
                    "film": "The Boy, The Mole, The Fox and the Horse",
                    "nominee": ""
                },
                {
                    "film": "The Flying Sailor",
                    "nominee": ""
                },
                {
                    "film": "Ice Merchants",
                    "nominee": ""
                },
                {
                    "film": "My Year of Dicks",
                    "nominee": ""
                },
                {
                    "film": "An Ostrich Told Me the World is Fake and I Think I Believe It",
                    "nominee": ""
                }
            ],
            "points": 1
        },
        {
            "award": "Sound",
            "nominees": [
                {
                    "film": "All Quiet on the Western Front",
                    "nominee": ""
                },
                {
                    "film": "Avatar: The Way of Water",
                    "nominee": ""
                },
                {
                    "film": "The Batman",
                    "nominee": ""
                },
                {
                    "film": "Elvis",
                    "nominee": ""
                },
                {
                    "film": "Top Gun: Maverick",
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
