import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, NavController } from '@ionic/angular';
import { BookModalPage } from '../book-modal/book-modal.page';
import Notiflix from "notiflix";
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NgControlStatus } from '@angular/forms';
import { NativeApiService } from '../services/nativeapi.service';
import { StorageService } from '../services/storage.service';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { CodePush, InstallMode, SyncStatus } from '@ionic-native/code-push/ngx';
import { AppCenterAnalytics } from '@ionic-native/app-center-analytics/ngx';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
shops:any=[]
salute:any=[]
capelli:any=[]
grouped:any=[]
spin='block'
  constructor( private nav: NavController ,private appCenterAnalytics:AppCenterAnalytics, private codePush: CodePush, private safariViewController: SafariViewController, private storage: StorageService, public modalController: ModalController,private api:ApiService, private plt:Platform,private apiNative:NativeApiService) {
    this.plt.ready().then(
      () =>{
        if (this.plt.is('hybrid')) {
          this.apiNative.getStores1().then(data=>{
            var shops:any =data
            this.storage.setShops(shops)
            this.shops = data
            this.spin='none'
                    }).catch(err=>{
                      this.spin='none'
                      Notiflix.Report.Warning("Problemi di rete", 'Verifica che la tua connessione funzioni o riprova più tardi', 'OK');
                     
                    })
                    
        }
        else{
          this.api.getStores1().subscribe(data=>{
            var shops:any =data
            this.storage.setShops(shops)
          
            this.shops = data
            this.spin='none'
                    },err=>{
                      this.spin='none'
                      Notiflix.Report.Warning("Problemi di rete", 'Verifica che la tua connessione funzioni o riprova più tardi', 'OK');
                    
                    })
        }
        } ) 
        
  }
 
  ngOnInit() {

  }
  // safari(){
  //   this.safariViewController.isAvailable()
  // .then((available: boolean) => {
  //     if (available) {

  //       this.safariViewController.show({
  //         url: 'http://ionic.io',
  //         hidden: false,
  //         animated: false,
  //         transition: 'curl',
  //         enterReaderModeIfAvailable: true,
  //         tintColor: '#ff0000'
  //       })
  //       .subscribe((result: any) => {
  //           if(result.event === 'opened') console.log('Opened');
  //           else if(result.event === 'loaded') console.log('Loaded');
  //           else if(result.event === 'closed') console.log('Closed');
  //         },
  //         (error: any) => console.error(error)
  //       );

  //     } else {
  //       console.log('no available')
  //     }
  //   }
  // );
  // }
  async presentModal(shop) {
    this.appCenterAnalytics.setEnabled(true).then(() => {
      this.appCenterAnalytics.trackEvent("shop_app_open", { TEST: shop.store_name }).then(() => {
          console.log('Custom event tracked');
      });
   });
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
        website: shop.website
      }
    });
    return await modal.present();
  }
  gopay(){
    this.nav.navigateRoot('/payments') 
  }
}
