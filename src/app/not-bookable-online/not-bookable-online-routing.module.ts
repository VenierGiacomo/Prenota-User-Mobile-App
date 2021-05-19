import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotBookableOnlinePage } from './not-bookable-online.page';

const routes: Routes = [
  {
    path: '',
    component: NotBookableOnlinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotBookableOnlinePageRoutingModule {}
