import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AbsentPage } from './absent.page';

const routes: Routes = [
  {
    path: '',
    component: AbsentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbsentPageRoutingModule {}
