import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookModalPageRoutingModule } from './book-modal-routing.module';

import { BookModalPage } from './book-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookModalPageRoutingModule
  ],
  declarations: [BookModalPage]
})
export class BookModalPageModule {}
