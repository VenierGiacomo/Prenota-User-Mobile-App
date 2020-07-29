import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Platform } from '@ionic/angular';
import { NativeApiService } from '../services/nativeapi.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import Notiflix from "notiflix";
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
appointments_list:any=[]

  constructor(private localNotifications: LocalNotifications, private storage: StorageService, private plt:Platform,private apiNative:NativeApiService, private router:Router, private api: ApiService) {}

  async ionViewDidEnter() {
    this.appointments_list= await this.storage.getAppoitments()
  }
   deletestorage(id){
    console.log(this.appointments_list, id)
    // this.storage.deleteappointments()
    this.storage.deleteappointment(id)
    setTimeout(async () => {
      this.appointments_list= await this.storage.getAppoitments()
    }, 100);
    
  }
  logout(){
    if (this.plt.is('hybrid')) {
      this.storage.deletestorage()
      Notiflix.Notify.Init({ position:"center-center", success: {background:"#fff",textColor:"#0061d5",notiflixIconColor:"#0061d5",}, }); 
      Notiflix.Notify.Success('Logout effettuato con successo')
      this.appointments_list=[]    
      }else{
      this.storage.deletestorage()
      Notiflix.Notify.Init({ position:"center-center", success: {background:"#fff",textColor:"#0061d5",notiflixIconColor:"#0061d5",}, }); 
      Notiflix.Notify.Success('Logout effettuato con successo')
      this.appointments_list=[]    
      }
  }
}
