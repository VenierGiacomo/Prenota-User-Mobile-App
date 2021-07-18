import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-booked-by-others',
  templateUrl: './booked-by-others.page.html',
  styleUrls: ['./booked-by-others.page.scss'],
})
export class BookedByOthersPage implements OnInit {

  constructor(private modalController: ModalController,) { }

  ngOnInit() {
  }

  async closeModal(){
    await this.modalController.dismiss();
  
  }
}
