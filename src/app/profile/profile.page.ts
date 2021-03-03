import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { NativeApiService } from '../services/nativeapi.service';
import { ApiService } from '../services/api.service';
import { Plugins } from '@capacitor/core';
import Notiflix from "notiflix";

const { Browser } = Plugins;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private toastController: ToastController  ,private plt: Platform, private modalController: ModalController,private apiNative:NativeApiService, private api:ApiService) { }
   first_name = ''
  last_name = ''
  email = ''
  sex = 'm'
  phone = ''
  first_name_err=''
  last_name_err=''
  email_err= ''
  phone_err= ''
  password_err=''
  ngOnInit() {
    if(this.plt.is("hybrid")){
      this.apiNative.getUserData().then((res)=>{
        var data:any = res
        this.first_name = data.first_name
        this.last_name = data.last_name
        this.email = data.email      
        this.phone = data.phone
      })
  
    }else{
      this.api.getUser().subscribe((res)=>{
        var data:any = res
        this.first_name = data.first_name
        this.last_name = data.last_name
        this.email = data.email      
        this.phone = data.phone
      })
    }
    
  }
  async closeModal(){
    await this.modalController.dismiss();
  }
  async openPaymentMethods(){
    if(this.plt.is("hybrid")){
      this.apiNative.stripePortalSession().then(async (res:any)=>{
        console.log(res)
        await Browser.open({ url: res.url })
        
      }).catch(err=>{Notiflix.Notify.Failure("C'è stato un problema durante il caricamento");})
    }else{
      this.api.stripePortalSession().subscribe(async (res:any)=>{
        await Browser.open({ url: res.url })
        
      },err=>{Notiflix.Notify.Failure("C'è stato un problema durante il caricamento");})
    }
   
  }


  updateUser(){
    if(this.plt.is('hybrid')){
      this.apiNative.updateUser(this.first_name, this.last_name, this.email, this.phone ).then(()=>{
        this.presentToast('Le modifiche sono state salvate')
       }).catch(err=>{
         console.log(err)
         this.presentToast("C'è stato un errore nel salvataggio")
       })
    }else{
      this.api.updateUser(this.first_name, this.last_name, this.email, this.phone ).subscribe(()=>{
        this.presentToast('Le modifiche sono state salvate')
       },err=>{
         console.log(err)
         this.presentToast("C'è stato un errore nel salvataggio")
       })
    }
    
  }
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'top',
      duration: 4000,
      cssClass:'light-toast-class',
    });
    toast.present();
  }
}
