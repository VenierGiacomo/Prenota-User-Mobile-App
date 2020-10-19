import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentSuccessPage } from './payment-success.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentSuccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentSuccessPageRoutingModule {}
