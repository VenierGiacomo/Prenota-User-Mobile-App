import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotModalPageRoutingModule } from './not-modal-routing.module';

import { NotModalPage } from './not-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotModalPageRoutingModule
  ],
  declarations: [NotModalPage]
})
export class NotModalPageModule {}
