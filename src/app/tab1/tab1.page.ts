import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, NavController, ActionSheetController } from '@ionic/angular';
import { BookModalPage } from '../book-modal/book-modal.page';
import Notiflix from "notiflix";
import { ApiService } from '../services/api.service';
import { NativeApiService } from '../services/nativeapi.service';
import { StorageService } from '../services/storage.service';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { CodePush} from '@ionic-native/code-push/ngx';
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
initialoffsetTop
  constructor(public actionSheetController: ActionSheetController, private nav: NavController , private codePush: CodePush, private safariViewController: SafariViewController, private storage: StorageService, public modalController: ModalController,private api:ApiService, private plt:Platform,private apiNative:NativeApiService) {
    this.plt.ready().then(
      () =>{
        if (this.plt.is('hybrid')) {
          this.apiNative.getStores().then(data=>{
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
          this.api.getStores().subscribe(data=>{
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
        address: shop.address
      }
    });
    return await modal.present();
  }
  gopay(){
    this.nav.navigateRoot('/payments') 
  }
  openList(){
  var list = document.getElementById('multi-profile')
  window.scrollTo(0, 0);
  if(list.style.top == '0px'){
    list.style.top = '-'+list.offsetTop +'px'
    list.style.left = '0px'
    list.style.width = '100vw'
    list.style.height = '100vh'    
  }else{
    list.style.top = '0px'
    list.style.left = '0px'
    list.style.width = '86vw'
    list.style.height = 'min-content'
  }
 

  }
 async  navBusiness(store){
    await this.nav.navigateForward('business/'+store.id)
  }
  async assistenzaActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Assistenza',
      buttons: [{
        text: 'Email',
        // icon: 'share',
        handler: () => {
          window.location.href="mailto:business@prenota.cc"
        }
      }, {
        text: 'Whatsapp',
        // icon: 'caret-forward-circle',
        handler: () => {
          window.location.href="https://wa.me/393404526854"
        }
      }, {
        text: 'Chiama',
        // icon: 'heart',
        handler: () => {
          window.location.href="tel:+393404526854";
        }
      }, {
        text: 'Annulla',
        // icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }
}
