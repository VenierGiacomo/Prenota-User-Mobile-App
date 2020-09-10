import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Platform, ModalController, AlertController } from '@ionic/angular';
import { NativeApiService } from '../services/nativeapi.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import Notiflix from "notiflix";
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { RegisterPage } from '../register/register.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
appointments_list:any=[]
text_top_right=''
shops=[]
months_names=['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']
rows = ["06:45", "07:00", "07:15", "07:30", "07:45", "08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30", "22:45", "23:00", "23:15", "23:30", "23:45", "24:00"]
  constructor(private alertController: AlertController,public modalController: ModalController, private storage: StorageService, private plt:Platform,private apiNative:NativeApiService, private router:Router, private api: ApiService) {}

  async ionViewDidEnter() {
    if (this.plt.is('hybrid')) {
    var token: any = await this.apiNative.isvalidToken()
    if(token){
      this.text_top_right='Esci'
      // await this.getClientAppointments()
      // this.appointments_list= await this.storage.getAppoitments()
    }else{
      this.text_top_right='Accedi'
    }
    }else{
      if(this.api.isvalidToken()){
        this.text_top_right='Esci'
        // await this.getClientAppointments()
        // this.appointments_list= await this.storage.getAppoitments()
      }else{
        this.text_top_right='Accedi'
      }
    }
    
  }
  async ngOnInit() {
await this.getClientAppointments()
  }
   deletestorage(appo){
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
        this.apiNative.deleteAppointment(appo.id).then(data=>{
          this.storage.deleteappointment(appo.id)
          // this.getClientAppointments()
          Notiflix.Report.Success("Appuntamento cancellato", "L'appuntamenton è stato cancellato con successo!", 'Continua')
        }).catch(err=>{
          Notiflix.Report.Failure("Errore durante la cancellazione", "L'appuntamenton non è stato cancellato. Controlla la tua connessione e riprova.", 'Annulla');
        })
       }else{
        this.api.deleteAppointment(appo.id).subscribe(data=>{
          this.storage.deleteappointment(appo.id)
          // this.getClientAppointments()
          Notiflix.Report.Success("Appuntamento cancellato", "L'appuntamenton è stato cancellato con successo!", 'Continua')
        },err=>{
          Notiflix.Report.Failure("Errore durante la cancellazione", "L'appuntamenton non è stato cancellato. Controlla la tua connessione e riprova.", 'Annulla');
        })
       }

      setTimeout(async () => {
      this.appointments_list= await this.storage.getAppoitments()
      }, 100);
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
        }, {
          text: "Chiama e cancella ",
          handler: () => {
            this.plt.ready().then(()=>{
              // console.log('tel:+39'+appo.store_phone,"_blank")
              // window.open('tel:+39'+appo.store_phone,"_blank")
              // window.open('tel:+39'+appo.store_phone,"_self")
              // window.open('tel:+39'+appo.store_phone,"_parent")
              // window.open('tel:+39'+appo.store_phone,"_top")
              // window.open('tel:+39'+appo.store_phone)   
              // window.location.href="tel://+39"+appo.store_phone;
              // window.location.href="tel://"+appo.store_phone;
              // window.location.href="tel:"+appo.store_phone;
              window.location.href="tel:+39"+appo.store_phone;
            })
          }
        }
      ]
    });

    await alert.present();
  }
  async logout(){
    if (this.plt.is('hybrid')) {
      var token: any = await this.apiNative.isvalidToken()
      if(token){   
        this.storage.deletestorage()
        this.text_top_right='Accedi'
        Notiflix.Notify.Init({ position:"center-center", success: {background:"#fff",textColor:"#0061d5",notiflixIconColor:"#0061d5",}, }); 
        Notiflix.Notify.Success('Logout effettuato con successo')
        this.appointments_list=[]
      }else{
        this.presentRegisterModal()
      }
     
      }else{
      if(this.api.isvalidToken()){  
        this.storage.deletestorage()
        localStorage.clear()
        this.text_top_right='Accedi'
        Notiflix.Notify.Init({ position:"center-center", success: {background:"#fff",textColor:"#0061d5",notiflixIconColor:"#0061d5",}, }); 
        Notiflix.Notify.Success('Logout effettuato con successo')
        this.appointments_list=[]    
      }else{
        this.presentRegisterModal()
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
      modal.onDidDismiss().then(async () => {
       await this.getClientAppointments()
       
    });
      return await modal.present();
  }
 async getClientAppointments(){
  if (this.plt.is('hybrid')) {
    var token: any = await this.apiNative.isvalidToken()
      if(token){
        this.apiNative.getClientAppointments().then(async data=>{
          this.appointments_list = await data
          this.shops = await this.storage.getShops()
          for(let appo of this.appointments_list){
           this.storage.setAppointment(appo)
          }
          
        }).catch(err=>{
          console.log(err)
        })
        }
    }else{
      this.api.getClientAppointments().subscribe(async data=>{
        this.appointments_list = await data
        this.shops = await this.storage.getShops()
        // for(let appo of this.appointments_list){
        //   appo.store_name = await this.shops.find(x =>  x.id === appo.shop).store_name
        // }
        for(let appo of this.appointments_list){
          this.storage.setAppointment(appo)
         }
      },err=>{
        console.log(err)
      })
    }
  }
}
