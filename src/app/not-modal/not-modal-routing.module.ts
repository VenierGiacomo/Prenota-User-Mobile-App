import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotModalPage } from './not-modal.page';

const routes: Routes = [
  {
    path: '',
    component: NotModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotModalPageRoutingModule {}
