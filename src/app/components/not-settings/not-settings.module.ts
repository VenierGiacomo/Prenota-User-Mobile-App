import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotSettingsPageRoutingModule } from './not-settings-routing.module';

import { NotSettingsPage } from './not-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotSettingsPageRoutingModule
  ],
  declarations: [NotSettingsPage]
})
export class NotSettingsPageModule {}
