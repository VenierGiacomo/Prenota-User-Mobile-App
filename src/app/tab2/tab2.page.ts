import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Platform, ModalController, AlertController, ToastController } from '@ionic/angular';
import { NativeApiService } from '../services/nativeapi.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

import { RegisterPage } from '../register/register.page';
import { ActionSheetController } from '@ionic/angular';
import QRCode from 'qrcode';
import { Plugins } from '@capacitor/core';
import { NotModalPage } from '../not-modal/not-modal.page';
import { CancelModalPage } from '../cancel-modal/cancel-modal.page';
import { ProfilePage } from '../profile/profile.page';
import { SelectCompanyPage } from '../select-company/select-company.page';
const { Browser } = Plugins;
const { LocalNotifications } = Plugins;
const { Share } = Plugins;


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
appointments_list:any=[]
page ='tab2'
shops=[]
currentPopover
confirm='none'
date = 1600955674970
actionSheet:any
code = 'A456d0of'
generated = '';
backdrop_active =false
activated_ticket =false
today_ticket
ticket_list=[,] ////// da modificare quando downloaderà veramente i biglietti ==> è analogo ad appoinment list ma per i bus
displayQrCode() {
  return this.generated !== '';
}
active_time=''
load_width='0vw'
months_names=['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']
rows = ["06:45", "07:00", "07:15", "07:30", "07:45", "08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30", "22:45", "23:00", "23:15", "23:30", "23:45", "24:00"]
  constructor(private toastController: ToastController, public actionSheetController: ActionSheetController,  private alertController: AlertController,public modalController: ModalController, private storage: StorageService, private plt:Platform,private apiNative:NativeApiService, private router:Router, private api: ApiService,) {}

  async ionViewDidEnter() {
    this.load_width='0vw'
    this.activated_ticket=false
    await this.getClientAppointments()    
  }
  async ngOnInit() {
  }

 
  async  handelNotdelete(appo) {
    // console.log(this.shops)
    const alert = await this.alertController.create({
      header: "Impossibile annullare l'appuntamento",
      message: 'Mancano meno di 2 giorni al tuo appuntamento, non è più possibile cancellarlo automaticamente. \nPuoi sempre chiamare lo studio',
      buttons: [
        {
          text: "Mantieni l'appuntamento",
          role: 'cancel',
          handler: () => {
            this.plt.ready().then(()=>{
              this.confirm='none'
            })
          }
        }, {
          text: "Chiama e cancella ",
          handler: () => {
            this.plt.ready().then(()=>{
              this.confirm='none'
              window.location.href="tel:+39"+appo.store_phone;
            })
          }
        }
      ]
    });

    await alert.present();
  }
  async settings(){
    if (this.plt.is('hybrid')) {
      var token: any = await this.apiNative.isvalidToken()
      if(token){
       await this.presentActionSheet()
      }else{
        await this.presentRegisterModal()
      }
     
      }else{
      if(this.api.isvalidToken()){  
        await this.presentActionSheet()
      }else{
        await this.presentRegisterModal()
      }
      
    }
  }
  async presentRegisterModal() {
      const modal = await this.modalController.create({
        component:RegisterPage,
        swipeToClose: true,
        cssClass: 'select-modal' ,
        componentProps: { 
          homeref: this,
        }
      });
      modal.onDidDismiss().then(async data => {
       if(data.data){
        //  this.presentToast("Benvenuto su Prenota")
        await this.getClientAppointments()
       }
      
       
    });
      return await modal.present();
  }
 async getClientAppointments(){
   var now = new Date()
   var week = await this.getWeekNumber(now)
   var year = await now.getUTCFullYear()
  if (this.plt.is('hybrid')) {
    var token: any = await this.apiNative.isvalidToken()
      if(token){
        this.apiNative.getClientAppointmentsweek(week,year).then(async data=>{
          this.appointments_list = await data
          // await this.storage.deleteappointments()
          // for(let appo of this.appointments_list ){
          //   await this.storage.setAppointment(appo)
          // }
          
        }).catch(err=>{
          console.log(err)
        })
        }
    }else{
      this.api.getClientAppointmentsweek(week,year).subscribe(async data=>{
        this.appointments_list = await data
        // await this.storage.deleteappointments()
      
        // for(let appo of this.appointments_list ){
        //   await this.storage.setAppointment(appo)
        // }
       
        this.shops = await this.storage.getShops()
      },err=>{
        console.log(err)
      })
    }
  }
  getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = +(new Date(Date.UTC(d.getUTCFullYear(),0,1)));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return  weekNo
  }

  async infoModal(site) {
    await Browser.open({ url: site })
 
  }
  async presentPopover(ev: any,appointment) {
    var modal = await this.modalController.create({
      component:CancelModalPage,    
      cssClass: 'pay-customer-modal' ,
      backdropDismiss: true,
      swipeToClose: true,
      componentProps: {
        homeref: this,
        appointment:appointment
      }
    });
    return await  modal.present();
    // const popover = await this.popoverController.create({
    //   component: PopoverComponent,
    //   event: ev,
    //   translucent: true,
    //   componentProps: {homeref:this,appo: appointment},
    // });
    // return await popover.present();
  }
  async logout(){
    if (this.plt.is('hybrid')) {
      var not = await  LocalNotifications.getPending()
      if(not.notifications!=undefined && not.notifications.length>0){
        await LocalNotifications.cancel(not)
      }
     
      await this.apiNative.deleteStorage()
      this.presentToast('Arrivederci')
      this.appointments_list=[]
    }else{
      await this.api.deleteStorage()
      await this.apiNative.deleteStorage()
      localStorage.clear()
      this.presentToast('Arrivederci')
      this.appointments_list=[]   
    }
   
  }
  async presentActionSheet() {
    this.actionSheet = await this.actionSheetController.create({
      header: 'Impostazioni',
      buttons: [ 
      {
        text: 'Profilo',
        // icon: 'share',
        handler: () => {
          this.closeActionsheet()
          this.presentProfileData()
        }
      },{
        text: 'Condividi',
        // icon: 'share',
        handler: async () => {
          var emoji = String.fromCodePoint(0x1F60A)
          var text = `Hey! Ho utilizzato questa app per prenotare ed è stato facilissimo. Te la consiglio ${emoji}!`
          let shareRet = await Share.share({
            title: 'Fantastico prenotare così',
            text: text,
            url: 'https://prenota.cc/',
            dialogTitle: 'Condivi prenota con i tuoi amici'
          });
        }
      }, {
        text: 'Assistenza',
        // icon: 'share',
        handler: () => {
          this.closeActionsheet()
          this.assistenzaActionSheet()
        }
      },{
        text: 'Logout',
        role: 'destructive',
        // icon: 'trash',
        handler: () => {
        this.logout()
        }
      },
     
     
      
      {
        text: 'Annulla',
        // icon: 'close',
        role: 'cancel',
 
      }]
    });
   
    await this.actionSheet.present();
  }
  async closeActionsheet(){
    await this.actionSheet.dismiss()
  }
  async presentProfileData(){

      const modal = await this.modalController.create({
        component:ProfilePage,
        swipeToClose: true,
        cssClass: 'select-modal' ,
    });
      return await modal.present();
  
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
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'top',
      duration: 2500,
      cssClass:'toast-class',
    });
    toast.present();
  }

  
  async activate_ticket() {
    var date = new Date() 
    var min:any = date.getMinutes()
    var hour:any = date.getHours()
    var hour_plus:any = hour+1
    if(min<10){
      min= '0'+min.toString()
    }
    if(hour<10){
      hour= '0'+hour.toString()
    }
    if(hour_plus<10){
      hour_plus= '0'+hour_plus.toString()
    }
    const alert = await this.alertController.create({
      header: 'Attiva il biglietto',
      subHeader: 'Stai per attivere il biglietto',
      message: `Cliccando su Attiva, attiverai il bilietto. Una volta attivato, non sarà più possibile tornare indietro. <br><br><b>Validità<br>${hour}:${min} - ${hour_plus}:${min}</b>.<br><br> Per tornare indietro senza attivare il biglietto clicca su Annulla` ,
      buttons: [{
        text: 'Annulla',
        role: 'cancel',
      },{
        text: 'Attiva',
        handler: ()=>{
          this.load_width ='100vw'
          this.active_time=`${hour_plus}:${min}`
          setTimeout(() => {
           this.presetCompaniesSelection()
          }, 900);
         
         
        },
      }]
    });
    await alert.present();
  }
  process() {
    const qrcode = QRCode;
    const self = this;
    qrcode.toString(self.code, { errorCorrectionLevel: 'H' }, function (err, url) {
      self.generated = url;
    })
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    this.today_ticket = dd + '/' + mm + '/' + yyyy;
    this.backdrop_active =true
    setTimeout(() => {
      var qr:any =document.getElementById('qr-card')
      var sm_data:any =document.getElementById('sm_data')
      var parser = new DOMParser();
      var doc = parser.parseFromString(this.generated, "image/svg+xml");
      document.getElementById('qr-card').appendChild(doc.documentElement)
      qr.style.top = 'calc(50vh - 40vw - 50px)'
      sm_data.style.top = 'calc(50vh + 50vw - 50px )'
   
  },100);
}
  closeQR(){
    var qr:any =document.getElementById('qr-card')
    var sm_data:any =document.getElementById('sm_data')
      sm_data.style.top = '120vh'
      qr.style.top = '110vh'
      setTimeout(() => {
      this.backdrop_active =false
    }, 500);
  }
 async presetCompaniesSelection(){  
   const modal = await this.modalController.create({
  component:SelectCompanyPage,
  swipeToClose: true,
  cssClass: 'select-modal' ,
  componentProps: { 
    homeref: this,
  }
});
modal.onDidDismiss().then(async data => {
  this.activated_ticket=true
 
});
return await modal.present();
}
}
