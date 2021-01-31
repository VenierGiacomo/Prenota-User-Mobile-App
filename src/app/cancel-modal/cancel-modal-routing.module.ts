import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CancelModalPage } from './cancel-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CancelModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CancelModalPageRoutingModule {}
