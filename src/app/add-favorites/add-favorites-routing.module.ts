import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddFavoritesPage } from './add-favorites.page';

const routes: Routes = [
  {
    path: '',
    component: AddFavoritesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddFavoritesPageRoutingModule {}
