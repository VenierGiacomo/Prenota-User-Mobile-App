import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, NavController, ActionSheetController, ToastController } from '@ionic/angular';
import Notiflix from "notiflix";
import { ApiService } from '../services/api.service';
import { NativeApiService } from '../services/nativeapi.service';
import { StorageService } from '../services/storage.service';
import { BookModalPage } from '../book-modal/book-modal.page';
import { ActivatedRoute } from '@angular/router';
import { RegisterPage } from '../register/register.page';
import { PayModalPage } from '../pay-modal/pay-modal.page';
import { IfStmt } from '@angular/compiler';
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
  constructor(private route: ActivatedRoute, private toastController: ToastController,public actionSheetController: ActionSheetController, private nav: NavController ,  private storage: StorageService, public modalController: ModalController,private api:ApiService, private plt:Platform,private apiNative:NativeApiService) {
    this.plt.ready().then(
      () =>{
        if (this.plt.is('hybrid')) {
          this.apiNative.getStores().then(async data=>{
            var shops:any =data
            this.storage.setShops(shops)
            this.shops = data
            this.spin='none'
            var token = await this.apiNative.isvalidToken()
            if(token){
            this.apiNative.paymentMethods().then(async (res)=>{
              await this.storage.clearPaymentMethods()
                await this.storage.setPaymentMethods(res)
            })
          }
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
            if(this.api.isvalidToken()){
            this.api.paymentMethods().subscribe(async (res)=>{
              await this.storage.clearPaymentMethods()
              await this.storage.setPaymentMethods(res)
            },(err)=>{
              console.log(err)
            })}
                    },err=>{
                      this.spin='none'
                      Notiflix.Report.Warning("Problemi di rete", 'Verifica che la tua connessione funzioni o riprova più tardi', 'OK');
                    
                    })
        }
        } ) 
        
  }
  async ionViewDidEnter() {
    if(this.plt.is('hybrid')){
      if(token){
        var token = await this.apiNative.isvalidToken()
        this.apiNative.paymentMethods().then(async (res)=>{
          await this.storage.clearPaymentMethods()
            await this.storage.setPaymentMethods(res)
        })
      }
    }else{
      if(this.api.isvalidToken()){
        this.api.paymentMethods().subscribe(async (res)=>{
          await this.storage.clearPaymentMethods()
          await this.storage.setPaymentMethods(res)
        })}
    }
  }
  ngOnInit() {

    if(!this.plt.is("hybrid")){

      this.route.paramMap.subscribe(async params => {
        if(params.get('first_name')){
          var token: any = await this.api.isvalidToken()
              if(token){
                await this.presentToast('Per registrare un nuovo account devi prima effettuare il logout')
                this.nav.navigateRoot('tabs')
              }else{
               var  data = {
                  first_name: params.get('first_name'),
                  last_name :  params.get('last_name'),
                  email : params.get('email'),
                  phone : params.get('phone'),
                }
                await this.presentRegisterModal(data)
        }

        
      }
      })
  }
}
  async presentRegisterModal(reg_data) {
    const modal = await this.modalController.create({
      component:RegisterPage,
      swipeToClose: true,
      cssClass: 'select-modal' ,
      componentProps: { 
        first_name: reg_data.first_name,
         last_name :  reg_data.last_name,
         email : reg_data.email,
         phone : reg_data.phone
      }
    });
    modal.onDidDismiss().then(()=>{
      this.nav.navigateRoot('tabs')
    })
    return await modal.present();
}  
async presentToast(text) {
  const toast = await this.toastController.create({
    message: text,
    position: 'top',
    duration: 5000,
    cssClass:'toast-class',
  });
  toast.present();
}
  async presentModal(shop) {
    if(shop.closed){
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
        }
      });
      return await modal.present();
    }
    
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

  async presentclosed(message){
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      duration: 3500,
      cssClass:'toast-closed-class',
    });
    toast.present();
  }
  async assistenzaActionSheet() {
    // this.presentPayModal()
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

  // async presentPayModal(){
  //   var modal = await this.modalController.create({
  //     component:PayModalPage,    
  //     cssClass: 'pay-customer-modal' ,
  //     backdropDismiss: false,
  //     swipeToClose: false,
  //     componentProps: {
  //       homeref: this,
  //       total_service:{name:'Campo 1 ora'},
  //       today:"Ven 19 Feb",
  //       timeslot:"10:30",
  //     }
  //   });
  //   return await modal.present();
  // }
  newCustomer(shop){
    var channel = shop.store_name.replaceAll(' ','-')
  if(this.plt.is('hybrid')){
    this.apiNative.newCustomerSocket(channel).then(res=>{
      console.log(res)
    }).catch(err=>{
      console.log(err)
    })
  }else{
    this.api.newCustomerSocket(channel).subscribe(res=>{
      
    })
  }
    
  }

}
