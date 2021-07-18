import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotBookableOnlinePageRoutingModule } from './not-bookable-online-routing.module';

import { NotBookableOnlinePage } from './not-bookable-online.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotBookableOnlinePageRoutingModule
  ],
  declarations: [NotBookableOnlinePage]
})
export class NotBookableOnlinePageModule {}
