import { Component, OnInit, Input, ContentChild } from '@angular/core';
import { ModalController, NavController, Platform, ToastController, IonInput } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import Notiflix from "notiflix";
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { NativeApiService } from '../services/nativeapi.service';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';

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
  constructor(private toastController: ToastController,private safariViewController: SafariViewController,private plt: Platform, private nativeApi: NativeApiService, private http: HTTP, public modalController: ModalController,private api: ApiService, private nav: NavController) { }
  first_name = ''
  last_name = ''
  email = ''
  sex = 'm'
  phone = ''
  password =''

  first_name_err=''
  last_name_err=''
  email_err= ''
  phone_err= ''
  password_err=''
  showPassword=false
  showPassword_reg=false
  
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
            await this.nativeApi.storeToken(data.token)
            Notiflix.Block.Remove('.wrapper');
            await this.closeModal(true)
            this.homeref.user.phone = this.phone
            this.homeref.bookfromLogin(data.email, data.first_name, data.last_name)
            // await this.homeref.closeModal()
          }
        ).catch(
          err => {
            Notiflix.Block.Remove('.wrapper');
            if (err.error.email != undefined){
              this.error = 'Questa email è invalida o è già stata utilizzata'
            }
            if (err.error.password != undefined){
              this.error = 'Questa password è troppo semplice. Prova ad aggiungere dei numeri'
            }
          }
        )
      }else{
      this.api.register(this.first_name, this.last_name, this.email, 'm', this.phone, this.password).subscribe(
        data=>{
          console.log(this.first_name, this.last_name, this.email, 'm', this.phone, this.password)
          console.log(data, 'efverfvgr')
         this.api.storeToken(data.token)
          Notiflix.Block.Remove('.wrapper');
          this.closeModal(true)
          this.homeref.user.phone = this.phone
          this.homeref.bookfromLogin(data.email, data.first_name, data.last_name )
          // this.homeref.closeModal()
        },
        err => {
      
          Notiflix.Block.Remove('.wrapper');
          if (err.error.email != undefined){
           
            this.error = 'Questa email è già stata utilizzata'
            this.presentToast(this.error)
          }
          if (err.error.password != undefined){
            this.error = 'La password deve avere più di 6 caratteri e non può essere di soli numeri'
            this.presentToast(this.error)
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
      console.log(this.email, this.password)
      let headers = { };
      this.http.setDataSerializer("json");
      this.http.setHeader("prenotaApp","Accept", "application/json");
      this.http.setHeader("prenotaApp","Content-Type", "application/json");
      this.http.post(url, params, headers)
  .then(async( response:HTTPResponse) => {
    var res = JSON.parse(response.data)
    await this.nativeApi.storeToken(res.token)
    await this.nativeApi.getUser().then(data=>{
      var res:any=data
      this.closeModal(true)
      this.homeref.bookfromLogin(res.email, res.first_name, res.last_name)
      // this.homeref.closeModal()
    }).catch(err=>console.log(err, 'login'))
  })
  .catch((error:any) => {
    Notiflix.Notify.Init({ position:"center-bottom"}); 
    
   this.presentToast('Email e Password non combaciano')
    this.error = 'La password o la email che hai inserito non sono valide'
  });
      
    } else {
      this.api.login(this.email, this.password).subscribe(
        data =>{
          console.log(data)
          this.api.storeToken(data.token)
          this.api.getUser().subscribe(
            data =>{
              var res:any=data
              this.closeModal(true)
              this.homeref.bookfromLogin(res.email, res.first_name, res.last_name)
              // this.homeref.closeModal()
              
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
  changePassword(){
    this.safariViewController.isAvailable()
  .then((available: boolean) => {
      if (available) {
        this.safariViewController.show({
          url: 'https://giacomovenier.pythonanywhere.com/api/auth/reset_password',
          hidden: false,
          animated: true,
          transition: 'curl',
          enterReaderModeIfAvailable: false,
          // tintColor: '#0061d5'
        })
        .subscribe((result: any) => {
            if(result.event === 'opened') console.log('Opened');
            else if(result.event === 'loaded') console.log('Loaded');
            else if(result.event === 'closed') console.log('Closed');
          },
          (error: any) => console.error(error)
        );

      } else {
        window.open('https://giacomovenier.pythonanywhere.com/api/auth/reset_password','_blank')
        
      }
    }
  ).catch(()=>{
    window.open('https://giacomovenier.pythonanywhere.com/api/auth/reset_password','_blank')
  }
    
  )
  }
  
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'top',
      duration: 5000,
      cssClass:'toast-class-light',
    });
    toast.present();
  }
}