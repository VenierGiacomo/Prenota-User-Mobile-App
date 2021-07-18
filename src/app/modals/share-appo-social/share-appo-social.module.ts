import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShareAppoSocialPageRoutingModule } from './share-appo-social-routing.module';

import { ShareAppoSocialPage } from './share-appo-social.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShareAppoSocialPageRoutingModule
  ],
  declarations: [ShareAppoSocialPage]
})
export class ShareAppoSocialPageModule {}
