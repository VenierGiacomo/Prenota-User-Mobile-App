import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { BookModalPage } from '../book-modal/book-modal.page';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  shops
  category 
  others
  native_app=true
  constructor(private plt: Platform, private routerOutlet: IonRouterOutlet, private toastController: ToastController, private modalController: ModalController,private router: Router,private storage: StorageService, private nav: NavController) { }

  async ngOnInit() {
    this.shops = await this.storage.getShops()
    const url_cat =  this.router.url.split('/')
    const category = url_cat[url_cat.length-1]
    this.category= this.shops.filter((val)=>{return val.business_type ==category})
    this.others= this.shops.filter((val)=>{return val.business_type !=category})
    if(this.plt.is('hybrid')){
this.native_app=true
    }else{
      this.native_app=false
    }
  }
  async backHome(){
    await this.nav.navigateBack('tabs/tab1')
  }
  ionViewDidEnter(){
    this.routerOutlet.swipeGesture = false;
  }
  async presentModal(shop) {
    if(shop.closed){
      this.presentclosed(shop.closed_message)
    }else{
      if(!(this.plt.is('hybrid'))&& shop.only_app){
        this.presentclosed(shop.closed_message)
      }else{
        const modal = await this.modalController.create({
          component:BookModalPage,
          swipeToClose: true,
          cssClass: 'select-modal' ,
          componentProps: {
            image:  shop.img_url,
            name: shop.store_name,
            role: shop.business_description,
            id: shop.id,
            max_spots: shop.max_spots,
            website: shop.website,
            address: shop.address,
            payable: shop.payable,
            accept_credits: shop.credits,
            must_be_payed: shop.must_pay,
            adons: shop.adons,
            available_on: shop.available_on,
            advance_day:shop.book_advance,
            has_category:shop.has_category,
          }
        });
        return await modal.present();
      }

      
    }
    
  }
  async presentclosed(message){
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      duration: 3500,
      cssClass:'toast-closed-class',
    });
    toast.present();
  }
}
