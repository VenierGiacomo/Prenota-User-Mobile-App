import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController, Platform, NavController, ActionSheetController, ToastController } from '@ionic/angular';
import Notiflix from "notiflix";
import { ApiService } from '../../services/api.service';
import { NativeApiService } from '../../services/nativeapi.service';
import { StorageService } from '../../services/storage.service';
import { BookModalPage } from '../../modals/book-modal/book-modal.page';
import { ActivatedRoute } from '@angular/router';
import { RegisterPage } from '../../components/register/register.page';
import { Plugins } from '@capacitor/core';
import { AddFavoritesPage } from '../add-favorites/add-favorites.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { NotModalPage } from '../../modals/not-modal/not-modal.page';

const { App } = Plugins;
const { LocalNotifications } = Plugins;
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

// spin='block'
spin='none'
fav_shops:any = []
initialoffsetTop
native_app =true
  constructor(private oneSignal: OneSignal,private barcodeScanner: BarcodeScanner, private ngZone: NgZone, private route: ActivatedRoute, private toastController: ToastController,public actionSheetController: ActionSheetController, private nav: NavController ,  private storage: StorageService, public modalController: ModalController,private api:ApiService, private plt:Platform,private apiNative:NativeApiService) {
    this.plt.ready().then(
      async () =>{
        this.fav_shops = await this.storage.getFavShops()
        if (this.plt.is('hybrid')) {
          this.native_app=true
          this.apiNative.getStores1().then(async data=>{
            var shops:any =data
            await this.storage.setShops(shops)
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
          this.native_app=false
          this.api.getStores().subscribe(async data=>{
            var shops:any =data
            await this.storage.setShops(shops)
          
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
        App.addListener('appStateChange', (state) => {
          this.ngZone.run(() => {
          
          if(state.isActive){
            if (this.plt.is('hybrid')) {
              
              this.apiNative.getStores1().then(async data=>{
                var shops:any =data
                await this.storage.setShops(shops).then(()=>{ this.reloadFav()})
              })          
            }
          }  
        });
      });
}
  async ionViewDidEnter() {
    if(this.plt.is('hybrid')){
     
      var token = await this.apiNative.isvalidToken()
      if(token){
        this.apiNative.paymentMethods().then(async (res)=>{
          await this.storage.clearPaymentMethods()
            await this.storage.setPaymentMethods(res)
        })
        LocalNotifications.areEnabled().then(async (res)=>{
          var areEnabled=res.value
          if(areEnabled){
            var self = this
            var notificationOpenedCallback =  function(jsonData) {
              self.nav.navigateRoot('/tabs/tab2')
                }  
       
            // Set your iOS Settings
            var iosSettings = {};
            iosSettings["kOSSettingsKeyAutoPrompt"] = false;
            iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
            this.oneSignal.startInit("91f9f284-1a50-44c4-8d5d-7ff9102e75a0",'51693766010')
              .handleNotificationOpened(notificationOpenedCallback) //.then(this.nav.navigateRoot("notifications"))
              .iOSSettings(iosSettings)
              .inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification)
              .endInit();
            
            // The promptForPushNotificationsWithUserResponse function will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 6)
            this.oneSignal.promptForPushNotificationsWithUserResponse().then(function(accepted) {
            });
            this.oneSignal.setSubscription(true)
            this.oneSignal.handleNotificationReceived().subscribe(() => {
             });
              this.oneSignal.getIds().then(data =>{
                this.apiNative.registerdevice(data.userId).then(data =>{
              
                })
              })
          }
     
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

  async ngOnInit() {
    
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
                  client_id : params.get('client_id'),
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
         phone : reg_data.phone,
         client_id : reg_data.client_id,
         homeref:{page:'tab1'}
      }
    });
    modal.onDidDismiss().then(()=>{
      this.nav.navigateRoot('tabs')
      this.presentNotModal()
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
  async reloadFav(){
    this.fav_shops = await this.storage.getFavShops()
    
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
    var not_social_reminder={
      title: `Ciao Giacomo, grazie da Wellens Clinic!`,
      body: `Speriamo sia andato tutto bene.\nSe ti va, ci puoi aiutare a farci conoscere. Clicca questa notifica`,
      id: 123456,
      attachments: null,
      schedule: {at: new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate(),new Date().getHours(),new Date().getUTCMinutes(),new Date().getSeconds()+5)},
      extra: {
        shop:{img: 'https://firebasestorage.googleapis.com/v0/b/prenota-d8fae.appspot.com/o/wellness_host.png?alt=media&token=03e011a5-984c-4873-b359-daa605f026fb', name: "Wellness Clinic", business_type:"Medico sportivo"},
        open:true
      }
    }
    await LocalNotifications.schedule({
      notifications: [not_social_reminder]
  
  
    
  })
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
  // } async assistenzaActionSheet() {

    // this.presentPayModal()

  async presentBusinessSheet(shop){
    const actionSheet = await this.actionSheetController.create({
      header: shop.store_name,
      
      buttons: [{
        text: 'Chiedi di diventare cliente',
        // icon: 'share',
        handler: () => {
         this.newCustomer(shop)
        }
      },{
        text: 'QR code',
        // icon: 'share',
        handler: () => {
         this.scanbarcode()
        }
      },
      
       {
        text: 'Rimuovi dai preferiti',
        role: 'destructive',
        handler:  () => {
             this.removefav(shop.id)  
        }
      }, {
        text: 'Annulla',
        // icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }
    
    
  async scanbarcode(){
    await this.barcodeScanner.scan({showTorchButton:true,disableAnimations:false}).then(async barcodeData => {
      if(!barcodeData.cancelled){
        const slug = barcodeData.text.split(".cc/").pop();
        if (slug) {
          var slug_parts =slug.split('/')
          if(slug_parts[0] == 'register'){
            var token: any = await this.apiNative.isvalidToken()
           
            if(token){
              if(slug_parts[6]){
                this.apiNative.updateStoreClientQRCode(slug_parts[6]).then(async res=>{
                  await this.presentToast('Profilo collegato')
                  setTimeout(() => {
                    this.presentNotModal()
                  },800 
                  );
                }).catch(err=>{
                  console.log(err)
                })
              }else{
                await this.presentToast('Per registrare un nuovo account devi prima effettuare il logout')
              }
             
            }else{
             var data = {
                first_name: slug_parts[1],
                last_name :  slug_parts[2],
                email : slug_parts[3],
                phone : slug_parts[4],
                client_id : slug_parts[6],
              }
              await this.presentRegisterModal(data)
            }
          } 
            
        }
        var sections_code = barcodeData.text.split('/')
  
        // this.apiNative.updateStoreClientQRCode(barcodeData.text).then(async res=>{
        //   await this.presentToast('Profilo collegato')
        // },async err=>{
        //   await this.presentToast('Problema di connessione')
        // })
      }else{
          this.presentToast("Scansione annullata") 
        }
      
     
     }).catch(err => {
      this.presentToast("Problema dutante la scansione. Inserisci il codice a mano o riprova")
         console.log('Error', err);
     });
  }
async removefav(id){
    await this.storage.removeFav(id)
    this.fav_shops = this.fav_shops.filter((val)=>{return val.id!=id})
    
}

async presentNotModal(){
  LocalNotifications.areEnabled().then(async (res)=>{
    if(!res.value){
        const modal = await this.modalController.create({
          component: NotModalPage,
          swipeToClose: true,
          cssClass: 'not-modal' ,
        
        });
        return await modal.present();

    }else{
      var self = this
            var notificationOpenedCallback =  function(jsonData) {
                }  
       
            // Set your iOS Settings
            var iosSettings = {};
            iosSettings["kOSSettingsKeyAutoPrompt"] = false;
            iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
            this.oneSignal.startInit("91f9f284-1a50-44c4-8d5d-7ff9102e75a0",'51693766010')
              .handleNotificationOpened(notificationOpenedCallback) //.then(this.nav.navigateRoot("notifications"))
              .iOSSettings(iosSettings)
              .inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification)
              .endInit();
            
            // The promptForPushNotificationsWithUserResponse function will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 6)
            this.oneSignal.promptForPushNotificationsWithUserResponse().then(function(accepted) {
            });
            this.oneSignal.setSubscription(true)
            this.oneSignal.handleNotificationReceived().subscribe(() => {
     
             });
      this.oneSignal.getIds().then(data =>{
        this.apiNative.registerdevice(data.userId).then(data =>{
      
        })
      })
    }
  })
}

  async newCustomer(shop){
    var channel = shop.store_name.replace(/ /g, '-');
  if(this.plt.is('hybrid')){
    var token = await this.apiNative.isvalidToken()
    if(token){
    this.apiNative.newCustomerSocket(channel,shop.id ).then(res=>{
      if(res.status=='failed'){
        if(res.already_exist){
          this.presentToast('Sei già un cliente di '+shop.store_name)
        }else{
          this.presentToast("C'è stato un problema.\n\nRiprova più tardi")
        }
        this.presentToast('Sei già un cliente di '+shop.store_name) 
      }else{
        this.presentToast('Richiesta di diventare cliente inviata')
      }
    })
  }else{
    this.presentToast('Devi avere un account per diventare cliente')
  }}else{
    if(this.api.isvalidToken()){
    this.api.newCustomerSocket(channel,shop.id).subscribe(res=>{
      this.presentToast('Richiesta di diventare cliente inviata')
    },err=>{
      if(err.error.already_exist){
        this.presentToast('Sei già un cliente di '+shop.store_name)
      }else{
        this.presentToast("C'è stato un problema.\n\nRiprova più tardi")
      }
    })
  }else{
    this.presentToast('Devi avere un account per diventare cliente')
  }}
    
  }
async addFavorite(){
  const modal = await this.modalController.create({
    component:AddFavoritesPage,
    swipeToClose: true,
    cssClass: 'select-modal' ,
  });
  modal.onDidDismiss().then(async ()=>{
    this.fav_shops = await this.storage.getFavShops()
  })
  return await modal.present();
  

}
async navCategory(cat){
   this.nav.navigateForward('tabs/tab1/category/'+cat,)
}
}
