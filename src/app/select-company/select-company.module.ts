import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectCompanyPageRoutingModule } from './select-company-routing.module';

import { SelectCompanyPage } from './select-company.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectCompanyPageRoutingModule
  ],
  declarations: [SelectCompanyPage]
})
export class SelectCompanyPageModule {}
