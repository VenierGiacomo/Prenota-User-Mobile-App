import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddFavoritesPageRoutingModule } from './add-favorites-routing.module';

import { AddFavoritesPage } from './add-favorites.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddFavoritesPageRoutingModule
  ],
  declarations: [AddFavoritesPage]
})
export class AddFavoritesPageModule {}
