import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayModalPage } from './pay-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PayModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayModalPageRoutingModule {}
