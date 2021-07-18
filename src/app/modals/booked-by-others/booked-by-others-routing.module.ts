import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookedByOthersPage } from './booked-by-others.page';

const routes: Routes = [
  {
    path: '',
    component: BookedByOthersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookedByOthersPageRoutingModule {}
