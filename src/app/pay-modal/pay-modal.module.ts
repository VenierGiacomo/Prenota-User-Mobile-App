import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayModalPageRoutingModule } from './pay-modal-routing.module';

import { PayModalPage } from './pay-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayModalPageRoutingModule
  ],
  declarations: [PayModalPage]
})
export class PayModalPageModule {}
