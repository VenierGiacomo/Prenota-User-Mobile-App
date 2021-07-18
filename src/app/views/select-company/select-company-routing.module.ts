import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectCompanyPage } from './select-company.page';

const routes: Routes = [
  {
    path: '',
    component: SelectCompanyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectCompanyPageRoutingModule {}
