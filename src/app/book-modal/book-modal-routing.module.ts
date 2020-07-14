import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookModalPage } from './book-modal.page';

const routes: Routes = [
  {
    path: '',
    component: BookModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookModalPageRoutingModule {}
