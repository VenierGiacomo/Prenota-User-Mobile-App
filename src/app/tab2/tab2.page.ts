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
times =["06:00", "06:05", "06:10", "06:15", "06:20", "06:25", "06:30", "06:35", "06:40","06:45", "06:50", "06:55", "07:00", "07:05", "07:10", "07:15", "07:20", "07:25", "07:30", "07:35", "07:40", "07:45", "07:50", "07:55", "08:00", "08:05", "08:10", "08:15", "08:20", "08:25", "08:30", "08:35", "08:40", "08:45", "08:50", "08:55", "09:00", "09:05", "09:10", "09:15", "09:20", "09:25", "09:30", "09:35", "09:40", "09:45", "09:50", "09:55", "10:00", "10:05", "10:10", "10:15", "10:20", "10:25", "10:30", "10:35", "10:40", "10:45", "10:50", "10:55", "11:00", "11:05", "11:10", "11:15", "11:20", "11:25", "11:30", "11:35", "11:40", "11:45", "11:50", "11:55", "12:00", "12:05", "12:10", "12:15", "12:20", "12:25", "12:30", "12:35", "12:40", "12:45", "12:50", "12:55", "13:00", "13:05", "13:10", "13:15", "13:20", "13:25", "13:30", "13:35", "13:40", "13:45", "13:50", "13:55","14:00", "14:05", "14:10", "14:15", "14:20", "14:25", "14:30", "14:35", "14:40", "14:45", "14:50", "14:55", "15:00", "15:05", "15:10", "15:15", "15:20", "15:25", "15:30", "15:35", "15:40", "15:45", "15:50", "15:55", "16:00", "16:05", "16:10", "16:15", "16:20", "16:25", "16:30", "16:35", "16:40", "16:45", "16:50", "16:55", "17:00", "17:05", "17:10", "17:15", "17:20", "17:25", "17:30", "17:35", "17:40", "17:45", "17:50", "17:55", "18:00", "18:05", "18:10", "18:15", "18:20", "18:25", "18:30", "18:35", "18:40", "18:45", "18:50", "18:55", "19:00", "19:05", "19:10", "19:15", "19:20", "19:25", "19:30", "19:35", "19:40", "19:45", "19:50", "19:55", "20:00", "20:05", "20:10", "20:15", "20:20", "20:25", "20:30", "20:35", "20:40", "20:45", "20:50", "20:55", "21:00", "21:05", "21:10", "21:15", "21:20", "21:25", "21:30", "21:35", "21:40", "21:45", "21:50", "21:55", "22:00", "22:05", "22:10", "22:15","22:20", "22:25", "22:30", "22:35", "22:40", "22:45", "22:50", "22:55", "23:00", "23:05", "23:10", "23:15", "23:20", "23:25", "23:30", "23:35", "23:40", "23:45", "23:50", "23:55" ]
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
          var not = await  LocalNotifications.getPending()
            if(not.notifications!=undefined && not.notifications.length>0){
              await LocalNotifications.cancel(not)
            }
          if(this.appointments_list.length>0){
            this.setNotifications()
            
          }
          
          
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

  async setNotifications(){
    var areEnabled
    var notifications_to_set =[]
    var day_before_date
    var day_after_date
    var stores = await this.storage.getShops()
    LocalNotifications.areEnabled().then(async (res)=>{
      areEnabled=res.value
      for (let appo of this.appointments_list){
        day_before_date = new Date( +new Date( appo.year, appo.month, appo.day, +this.times[appo.start_t].split(':')[0], +this.times[appo.start_t].split(':')[1]) - 1 * 24 * 60 * 60 * 1000) 
        day_after_date = new Date( +new Date( appo.year, appo.month, appo.day, +this.times[appo.start_t].split(':')[0], +this.times[appo.start_t].split(':')[1]) + 1 * 24 * 60 * 60 * 1000) 
        var not_day_before = {
          title: `Ciao ${appo.client_name.split(' ')[0]}, hai un appuntamento per domani`,
          body: `Ricordati del tuo appuntamento domani alle ${this.times[appo.start_t]}\n${appo.details} presso ${appo.store_name}.`,
          id: appo.id,
          schedule: {at: new Date(day_before_date.getFullYear(), day_before_date.getMonth(), day_before_date.getDate(), 11)},
          sound: null,
          attachments: null,
          actionTypeId: "",
          extra: null
        }
        if(+not_day_before.schedule.at>+new Date()){
          notifications_to_set.push(not_day_before)
        }
       

        var not_2_hour_before = {
          title: `Ciao ${appo.client_name.split(' ')[0]}, mancano 2 ore!`,
          body: `Ricordati del tuo appuntamento oggi alle ${this.times[appo.start_t]}.\n${appo.details} presso ${appo.store_name}.`,
          id: appo.id+1000,
          schedule: {at: new Date(appo.year, appo.month, appo.day, +this.times[appo.start_t].split(':')[0]-2,+this.times[appo.start_t].split(':')[1])},
          sound: null,
          attachments: null,
          actionTypeId: "",
          extra: null
        }
        if(+not_2_hour_before.schedule.at>+new Date()){
          notifications_to_set.push(not_2_hour_before)
        }

        var emoji = String.fromCodePoint(0x1F60A)
        var store = await stores.filter(val=>{return val.id == appo.shop})
        var not_social_reminder={
          title: `Ciao ${appo.client_name.split(' ')[0]}, grazie da ${appo.store_name}! ${emoji}`,
          body: `Speriamo sia andato tutto bene.\nSe ti va, ci puoi aiutare a farci conoscere. Clicca questa notifica`,
          id: appo.id+2000,
          attachments: null,
          schedule: {at: new Date(day_after_date.getFullYear(), day_after_date.getMonth(), day_after_date.getDate(), 11,45)},
          extra: {
            shop:{img: store[0].img_url, name: appo.store_name, business_type:store[0].business_description},
            open:true
          }
        }
        if(+not_social_reminder.schedule.at>+new Date()){
          notifications_to_set.push(not_social_reminder)
        }
        
      }
      console.log(notifications_to_set)
      if(areEnabled){
        await LocalNotifications.schedule({
          notifications: notifications_to_set
        });
     
        
      }
    })
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
