import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.page.html',
  styleUrls: ['./payment-success.page.scss'],
})
export class PaymentSuccessPage implements OnInit {

  constructor(private nav: NavController) { }

  ngOnInit() {
  }
  async goBookings(){
    await this.nav.navigateRoot('tabs/tab2')
  }
}
