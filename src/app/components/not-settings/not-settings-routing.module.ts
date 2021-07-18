import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotSettingsPage } from './not-settings.page';

const routes: Routes = [
  {
    path: '',
    component: NotSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotSettingsPageRoutingModule {}
