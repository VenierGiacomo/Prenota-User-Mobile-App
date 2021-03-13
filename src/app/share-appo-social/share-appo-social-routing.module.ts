import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShareAppoSocialPage } from './share-appo-social.page';

const routes: Routes = [
  {
    path: '',
    component: ShareAppoSocialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShareAppoSocialPageRoutingModule {}
