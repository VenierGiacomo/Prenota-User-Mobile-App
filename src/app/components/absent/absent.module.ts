import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AbsentPageRoutingModule } from './absent-routing.module';

import { AbsentPage } from './absent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AbsentPageRoutingModule
  ],
  declarations: [AbsentPage]
})
export class AbsentPageModule {}
