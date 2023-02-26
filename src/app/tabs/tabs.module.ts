import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { PicksStatusComponent } from '../picks.status.component';
import { HelpersModule } from '../helpers/helpers.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    HelpersModule
  ],
  exports: [],
  declarations: [TabsPage]
})
export class TabsPageModule {}
