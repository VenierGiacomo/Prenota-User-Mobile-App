import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-company',
  templateUrl: './select-company.page.html',
  styleUrls: ['./select-company.page.scss'],
})
export class SelectCompanyPage implements OnInit {
  selected
  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }
  async closeModal(){
    await this.modalController.dismiss()
  }
}
