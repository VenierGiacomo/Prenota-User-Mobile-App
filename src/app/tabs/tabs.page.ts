import { Component, ViewChild } from '@angular/core';
import { IonTabs, ModalController } from '@ionic/angular';
import { BusTicketPage } from '../bus-ticket/bus-ticket.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild('tabs', { static: false }) tabs: IonTabs;
  tab1_icon='home'
  tab2_icon='today-outline'
  constructor( public modalController: ModalController) {}
  setCurrentTab() {
    var selectedTab = this.tabs.getSelected();
    if(selectedTab=='tab1'){
      this. tab1_icon='home'
      this.tab2_icon='albums-outline'
    }else{
      this. tab1_icon='home-outline'
      this.tab2_icon='albums'
    }
  }

  async buyTicket() {
    const modal = await this.modalController.create({
      component: BusTicketPage,
      swipeToClose: true,
      cssClass: 'ticket-modal' ,
    });
    return await modal.present();
  }
}
