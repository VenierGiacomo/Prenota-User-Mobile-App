import { Component, OnInit, Input  } from '@angular/core';
import { ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import Notiflix from "notiflix";
import { NativeApiService } from '../services/nativeapi.service';
import { Plugins } from '@capacitor/core';

import { StorageService } from '../services/storage.service';

const { Browser } = Plugins;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @Input() homeref
  error
BASE_URL = 'https://giacomovenier.pythonanywhere.com/api/'
  registerpage =true
  constructor(private storage: StorageService, private toastController: ToastController,private plt: Platform, private nativeApi: NativeApiService,  public modalController: ModalController,private api: ApiService, private nav: NavController) { }
  
  @Input()  first_name = ''
  @Input() last_name = ''
  @Input() email = ''
  sex = 'm'
  @Input() phone = ''
  @Input() client_id 
password =''

  first_name_err=''
  last_name_err=''
  email_err= ''
  phone_err= ''
  password_err=''
  showPassword=true
  showPassword_reg=true
  
  ngOnInit() {
  }
  toggleShow() {
    var password_input:any = document.getElementById('input')
    password_input.type = password_input.type === 'password' ?  'text' : 'password';
    this.showPassword = !this.showPassword;


  }
  toggleShowReg() {
    var password_input_reg:any = document.getElementById('input_reg')
    password_input_reg.type = password_input_reg.type === 'password' ?  'text' : 'password';
    this.showPassword_reg = !this.showPassword_reg;
  
  }

  async closeModal(bool){
    await this.modalController.dismiss(bool);
  }
  async register(){
    Notiflix.Block.Standard('.wrapper', 'Salvando dati...');     
    this.first_name_err = ''
    this.last_name_err = ''
    this.email_err = ''
    this.phone_err = ''
    this.password_err = ''

    if(this.first_name== ''){
      this.first_name_err = 'Inserisci il tuo nome'
    }
    if(this.last_name== ''){
      this.last_name_err = 'Inserisci il tuo cognome'
    }
    if(this.email== ''){
      this.email_err = 'Inserisci la tua email'
    }
    if(this.phone== ''){
      this.phone_err = 'Inserisci il tuo numero di telefono'
    }
    if(this.password== ''){
      this.password_err = 'Inserisci una password'
    }
    if(this.first_name_err == '' && this.last_name_err == '' && this.email_err == '' && this.phone_err == '' && this.password_err == ''){
      if (this.plt.is('hybrid')) {
        await this.nativeApi.register(this.first_name, this.last_name, this.email, 'm', this.phone, this.password).then(
          async data=>{
            
           
            // await this.nativeApi.storeToken(data.token)
            if(await data.token){
              await this.closeModal(true)   
              if(this.homeref.page != 'tab2'){
                this.homeref.user.phone = this.phone
                await this.homeref.bookfromLogin(data.email, data.first_name, data.last_name)
                await this.closeModal(true)
              }
             
                        
              setTimeout(()=>{
                if(this.client_id){
                  
                  this.nativeApi.updateStoreClientQRCode(this.client_id).then(async res=>{
                    this.presentToast('Account collegato')
                    
                  }).catch(async err=>{
                    this.presentToast("Non siamo riusciti a collegare l'account. Puoi sempre riutilizzare il link")
                  })
                }else{
                  // this.presentToast('Salve  '+ data.first_name)
                }
              },100)
              this.presentToast('Salve  '+ data.first_name)
              await this.closeModal(true)
              
            }else{
              if (data.email != undefined){
                this.error = 'Questa email è invalida o è già stata utilizzata'
                this.presentToasterr(this.error)
              }
              if (data.password != undefined){
                this.error = 'Questa password è troppo semplice. Prova ad aggiungere dei numeri'
                this.presentToasterr(this.error)
              }
            }
           
            // await this.homeref.closeModal()
          }
        ).catch(
          err => {
            if (err.email != undefined){
              this.error = 'Questa email è invalida o è già stata utilizzata'
              this.presentToasterr(this.error)
            }
            if (err.password != undefined){
              this.error = 'Questa password è troppo semplice. Prova ad aggiungere dei numeri'
              this.presentToasterr(this.error)
            }
          }
        )
      }else{
      this.api.register(this.first_name, this.last_name, this.email, 'm', this.phone, this.password).subscribe(
       async  data=>{
         await this.api.storeToken(data.token)
          Notiflix.Block.Remove('.wrapper');
          
          if(this.homeref.page != 'tab2'){
            this.homeref.user.phone = this.phone
            await this.homeref.bookfromLogin(data.email, data.first_name, data.last_name )
          }
          this.presentToast('Salve '+this.first_name)
          this.closeModal(true)
        
        
          // this.homeref.closeModal()
        },
        err => {
      
          Notiflix.Block.Remove('.wrapper');
          if (err.error.email != undefined){
           
            this.error = 'Questa email è già stata utilizzata'
            this.presentToasterr(this.error)
          }
          if (err.error.password != undefined){
            this.error = 'La password deve avere più di 6 caratteri e non può essere di soli numeri'
            this.presentToasterr(this.error)
          }
          console.log(err.error.password)
          console.log(err.error,'err')
        }
      )}
    }
  }
  switchSex(){
    if(this.sex=='m'){
      this.sex='w'
    }else{
      this.sex='m'
    }
  }
  goLogin(){
    this.registerpage=false
  }
  goRegister(){
    this.registerpage=true
  }
  async login(){
    if (this.plt.is('hybrid')) {
      let url = this.BASE_URL+'auth/';
      let params = {
        "email": this.email,
        "password": this.password,
      }
      this.nativeApi.login(params).then(async (res)=>{
        await this.nativeApi.getUser().then(async (data)=>{
          var res:any=data
          await this.closeModal(true)
          if(this.homeref.page != 'tab2'){
            await this.homeref.bookfromLogin(res.email, res.first_name, res.last_name)
          }
          this.presentToast('Che bello riverderti  '+ data.first_name)
          this.nativeApi.paymentMethods().then(async (res)=>{
            await this.storage.clearPaymentMethods()
              await this.storage.setPaymentMethods(res)
           
          })
      }).catch(err=>{
        this.presentToast('Email e Password non combaciano')
        this.error = 'La password o la email che hai inserito non sono valide'

      })
  }).catch((error:any) => {
    this.presentToast('Email e Password non combaciano ')
    this.error = 'La password o la email che hai inserito non sono valide'
  
  });
      
    } else {
      this.api.login(this.email, this.password).subscribe(
        data =>{
          this.api.storeToken(data.token)
          this.api.getUser().subscribe(
           async  data =>{
              var res:any= await data
              await this.closeModal(true)
              if(this.homeref.page != 'tab2'){
                await this.homeref.bookfromLogin(res.email, res.first_name, res.last_name)
              }
             
              // this.homeref.closeModal()
              this.presentToast('Che bello riverderti  '+ res.first_name)
              this.api.paymentMethods().subscribe(async (res)=>{
                await this.storage.clearPaymentMethods()
                await this.storage.setPaymentMethods(res)
              },(err)=>{
                console.log(err)
              })
              
            },err =>{
              console.log(err)
              Notiflix.Notify.Init({ position:"center-bottom"}); 
             this.presentToast('Email e Password non combaciano')
              this.error = 'La password o la email che hai inserito non sono valide'
            })
        },err =>{
          console.log(err)
          Notiflix.Notify.Init({ position:"center-bottom"}); 
         this.presentToast('Email e Password non combaciano')
          this.error = 'La password o la email che hai inserito non sono valide'
        })
    }
    
  }
  async changePassword(){
    await Browser.open({ url: 'https://giacomovenier.pythonanywhere.com/api/auth/reset_password' })
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
  async presentToasterr(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'top',
      duration: 5000,
      cssClass:'light-toast-class',
    });
    toast.present();
  }
}