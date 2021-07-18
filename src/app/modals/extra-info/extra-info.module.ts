import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExtraInfoPageRoutingModule } from './extra-info-routing.module';

import { ExtraInfoPage } from './extra-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExtraInfoPageRoutingModule
  ],
  declarations: [ExtraInfoPage]
})
export class ExtraInfoPageModule {}
