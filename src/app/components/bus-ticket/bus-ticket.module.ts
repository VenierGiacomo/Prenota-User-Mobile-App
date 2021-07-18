import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusTicketPageRoutingModule } from './bus-ticket-routing.module';

import { BusTicketPage } from './bus-ticket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusTicketPageRoutingModule
  ],
  declarations: [BusTicketPage]
})
export class BusTicketPageModule {}
