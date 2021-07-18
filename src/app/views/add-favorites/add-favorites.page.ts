import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-favorites',
  templateUrl: './add-favorites.page.html',
  styleUrls: ['./add-favorites.page.scss'],
})
export class AddFavoritesPage implements OnInit {

  constructor(private modalController: ModalController,private storage:StorageService) { }
  shops
  business_name
  shops_to_display=[]
  async ngOnInit() {
    this.shops = await this.storage.getShops()
    var fav_shop = await this.storage.getFavShops()
    var fav_id= fav_shop.map((val)=> {return val.id})
    this.shops_to_display = this.shops.filter((val)=>{ return fav_id.indexOf(val.id)==-1})
    // this.shops_to_display=this.shops
  }
  async addfavorite(shop){

   await this.storage.setFavShops(shop)
   this.closeModal()
  }
  async closeModal(){
    await this.modalController.dismiss();
  }
  async filterBusiness(){
   
    var x = this.business_name.toLowerCase()
    this.shops_to_display = this.shops.filter((val)=>{
      if(val.keywords.includes(x)){
        return val
      }
    })
  }
}
