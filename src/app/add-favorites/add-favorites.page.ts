import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-favorites',
  templateUrl: './add-favorites.page.html',
  styleUrls: ['./add-favorites.page.scss'],
})
export class AddFavoritesPage implements OnInit {

  constructor(private modalController: ModalController,private storage:StorageService) { }
  shops
  async ngOnInit() {
    this.shops = await this.storage.getShops()
  }
  addfavorite(shop){
    console.log(shop)
  }
  async closeModal(){
    await this.modalController.dismiss();
  }
}
