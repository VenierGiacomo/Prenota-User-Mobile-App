import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Platform, ModalController, AlertController, PopoverController, ToastController } from '@ionic/angular';
import { NativeApiService } from '../services/nativeapi.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import Notiflix from "notiflix";
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { RegisterPage } from '../register/register.page';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { PopoverComponent } from '../popover/popover.component';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
appointments_list:any=[]
text_top_right=''
shops=[]
currentPopover
confirm='none'
date = 1600955674970
to_delete_appo
actionSheet:any
months_names=['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']
rows = ["06:45", "07:00", "07:15", "07:30", "07:45", "08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30", "22:45", "23:00", "23:15", "23:30", "23:45", "24:00"]
  constructor(private toastController: ToastController, private localNotifications: LocalNotifications,public actionSheetController: ActionSheetController, private popoverController: PopoverController, private alertController: AlertController,public modalController: ModalController, private storage: StorageService, private plt:Platform,private apiNative:NativeApiService, private router:Router, private api: ApiService,private safariViewController: SafariViewController,) {}

  async ionViewDidEnter() {
    if (this.plt.is('hybrid')) {
    var token: any = await this.apiNative.isvalidToken()
    if(token){
      this.text_top_right='Esci'
    }else{
      this.text_top_right='Accedi'
    }
    }else{
      if(this.api.isvalidToken()){
        this.text_top_right='Esci'
      }else{
        this.text_top_right='Accedi'
      }
    }
      await this.getClientAppointments()    
  }
  async ngOnInit() {
  }

  // async not_test(){ 
  //  var nots = await  this.localNotifications.getAll()
  //  console.log(nots)
  // }
  wanttodelete(appo){
    this.to_delete_appo= appo
    this.confirm='block'
  }
   deletestorage(){
    Notiflix.Block.Standard('.cont', "Stiamo cancellando l'appuntamento...");
    var appo =this.to_delete_appo
    var date = new Date()
    var day = date.getDate()
    var month = date.getMonth()
    var year = date.getFullYear()
    const date1:any = new Date(year,month,day,0,0,0,0);
    const date2:any = new Date(appo.year, appo.month, appo.day,0,0,0,0);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    if(diffDays>=3){
      if (this.plt.is('hybrid')) {
        this.apiNative.deleteAppointment(appo.id).then(async data=>{
          await this.getClientAppointments()
          this.confirm='none'
          await Notiflix.Block.Remove('.cont')
          Notiflix.Report.Init(
            {success: 
              {svgColor:'#0061d5',
              titleColor:'#1e1e1e',
              messageColor:'#242424',
              buttonBackground:'#0061d5',
              buttonColor:'#fff'
              ,backOverlayColor:'rgba(#00479d,0.2)',},
            })
            var nots =await this.localNotifications.getAll()
            console.log(nots)
            var to_be_deleted = nots.filter((val,ind,arr)=>{ return val.id == appo.id ||val.id == appo.id+1000 })
            console.log(to_be_deleted)
            for(let el of to_be_deleted){
              await this.localNotifications.cancel(el.id)
            }
            nots =await this.localNotifications.getAll()
            console.log("new",nots)
          Notiflix.Report.Success("Appuntamento cancellato", "L'appuntamenton è stato cancellato con successo!", 'Continua')
        }).catch(async err=>{
          await Notiflix.Block.Remove('.cont')
          Notiflix.Report.Failure("Errore durante la cancellazione", "L'appuntamenton non è stato cancellato. Controlla la tua connessione e riprova.", 'Annulla');
        })
       }else{
        this.api.deleteAppointment(appo.id).subscribe(async data=>{
          await this.getClientAppointments()
          this.confirm='none'
          // this.getClientAppointments()
          await Notiflix.Block.Remove('.cont')
          Notiflix.Report.Init(
            {success: 
              {svgColor:'#0061d5',
              titleColor:'#1e1e1e',
              messageColor:'#242424',
              buttonBackground:'#0061d5',
              buttonColor:'#fff'
              ,backOverlayColor:'rgba(#00479d,0.2)',},
            })
          Notiflix.Report.Success("Appuntamento cancellato", "L'appuntamenton è stato cancellato con successo!", 'Continua')
        },async err=>{
          await Notiflix.Block.Remove('.cont')
          Notiflix.Report.Failure("Errore durante la cancellazione", "L'appuntamenton non è stato cancellato. Controlla la tua connessione e riprova.", 'Annulla');
        })
       }
    }else{
    this.handelNotdelete(appo)
    }
   
    
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
          homeref: this
        }
      });
      modal.onDidDismiss().then(async data => {
       if(data.data){
         this.presentToast("Benvenuto su Prenota")
        await this.getClientAppointments()
        this.text_top_right='Esci'
       }else{
        this.text_top_right='Accedi'
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
          this.text_top_right='Esci'
        }).catch(err=>{
          console.log(err)
        })
        }
    }else{
      this.api.getClientAppointmentsweek(week,year).subscribe(async data=>{
        this.appointments_list = await data
        // await this.storage.deleteappointments()
        this.text_top_right='Esci'
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
    this.safariViewController.isAvailable()
    .then((available: boolean) => {
        if (available) {
  
          this.safariViewController.show({
            url: site,
            hidden: false,
            animated: true,
            transition: 'curl',
            enterReaderModeIfAvailable: false,
            // tintColor: '#0061d5'
          })
          .subscribe((result: any) => {
            },
            (error: any) => console.error(error)
          );
  
        } else {
          console.log('no available')
        }
      }
    );
  }
  async presentPopover(ev: any,appointment) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      componentProps: {homeref:this,appo: appointment},
    });
    return await popover.present();
  }
  async logout(){
    if (this.plt.is('hybrid')) {
      await this.localNotifications.clearAll()
      await this.apiNative.deleteStorage()
      this.text_top_right='Accedi'
      this.presentToast('Logout effettuato con successo')
      this.appointments_list=[]
    }else{
      await this.api.deleteStorage()
      localStorage.clear()
      this.text_top_right='Accedi'
      this.presentToast('Logout effettuato con successo')
      this.appointments_list=[]   
    }
   
  }
  async presentActionSheet() {
    this.actionSheet = await this.actionSheetController.create({
      header: 'Impostazioni',
      buttons: [{
        text: 'Logout',
        role: 'destructive',
        // icon: 'trash',
        handler: () => {
        this.logout()
        }
      }, {
        text: 'Assistenza',
        // icon: 'share',
        handler: () => {
          this.closeActionsheet()
          this.assistenzaActionSheet()
        }
      },{
        text: 'Annulla',
        // icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
   
    await this.actionSheet.present();
  }
  async closeActionsheet(){
    await this.actionSheet.dismiss()
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
}
