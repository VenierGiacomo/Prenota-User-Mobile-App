import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookedByOthersPageRoutingModule } from './booked-by-others-routing.module';

import { BookedByOthersPage } from './booked-by-others.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookedByOthersPageRoutingModule
  ],
  declarations: [BookedByOthersPage]
})
export class BookedByOthersPageModule {}
