import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import Notiflix from "notiflix";
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { NativeApiService } from '../services/nativeapi.service';

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
  constructor(private plt: Platform, private nativeApi: NativeApiService, private http: HTTP, public modalController: ModalController,private api: ApiService, private nav: NavController) { }
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
  ngOnInit() {
  }
  async closeModal(){
    await this.modalController.dismiss();
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
        await this.nativeApi.register(this.first_name, this.last_name, this.email, this.sex, this.phone, this.password).then(
          async data=>{
            console.log(data, 'efverfvgr')
            await this.nativeApi.storeToken(data.token)
            Notiflix.Block.Remove('.wrapper');
            await this.closeModal()
            this.homeref.user.phone = this.phone
            this.homeref.bookfromLogin(data.email, data.first_name, data.last_name)
            await this.homeref.closeModal()
          }
        ).catch(
          err => {
            Notiflix.Block.Remove('.wrapper');
            if (err.error.email != undefined){
              this.error = 'Questa email è già stata utilizzata'
            }
            if (err.error.password != undefined){
              this.error = 'Questa password è troppo semplice. Prova ad aggiungere dei numeri'
            }
            console.log(err.error.password)
            console.log(err.error,'NOOOOefverfvgr')
          }
        )
      }else{
      this.api.register(this.first_name, this.last_name, this.email, this.sex, this.phone, this.password).subscribe(
        data=>{
         this.api.storeToken(data.token)
          Notiflix.Block.Remove('.wrapper');
          this.closeModal()
          this.homeref.user.phone = this.phone
          this.homeref.bookfromLogin(data.email, data.first_name, data.last_name )
          this.homeref.closeModal()
        },
        err => {
          Notiflix.Block.Remove('.wrapper');
          if (err.error.email != undefined){
            this.error = 'Questa email è già stata utilizzata'
          }
          if (err.error.password != undefined){
            this.error = 'Questa password è troppo semplice. Prova ad aggiungere dei numeri'
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
      this.closeModal()
      this.homeref.bookfromLogin(res.email, res.first_name, res.last_name)
      this.homeref.closeModal()
    }).catch(err=>console.log(err, 'login'))
  })
  .catch((error:any) => {
    this.error = 'La password o la email che hai inserito non sono valide'
  });
      
    } else {
      this.api.login(this.email, this.password).subscribe(
        data =>{
          this.api.storeToken(data.token)
          this.api.getUser().subscribe(
            data =>{
              var res:any=data
              this.closeModal()
              this.homeref.bookfromLogin(res.email, res.first_name, res.last_name)
              this.homeref.closeModal()
              
            },err =>{
              this.error = 'La password o la email che hai inserito non sono valide'
            })
        },err =>{
          this.error = 'La password o la email che hai inserito non sono valide'
        })
    }
    
  }
}
