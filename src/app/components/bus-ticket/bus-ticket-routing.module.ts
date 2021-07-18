import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusTicketPage } from './bus-ticket.page';

const routes: Routes = [
  {
    path: '',
    component: BusTicketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusTicketPageRoutingModule {}
