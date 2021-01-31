import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CancelModalPageRoutingModule } from './cancel-modal-routing.module';

import { CancelModalPage } from './cancel-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CancelModalPageRoutingModule
  ],
  declarations: [CancelModalPage]
})
export class CancelModalPageModule {}
