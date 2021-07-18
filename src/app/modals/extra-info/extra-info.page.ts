import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { NativeApiService } from '../../services/nativeapi.service';

@Component({
  selector: 'app-extra-info',
  templateUrl: './extra-info.page.html',
  styleUrls: ['./extra-info.page.scss'],
})
export class ExtraInfoPage implements OnInit {
  born_city ='Trieste'
  live_city ='Trieste'
  live_street
  croatia=false
  cap
  @Input() homeref
  @Input() appointment
  @Input() client_name 
  @Input() email 
  @Input() phone 
  by_emial = false
  fiscal_code
  extra_data='none'
  res_book:any
  fiscal_code_err=''
  born_city_err=''
  live_city_err=''
  live_street_err=''
  cap_err=''
  constructor(private modalController: ModalController,private plt: Platform, private api: ApiService, private apiNative: NativeApiService) { }

  ngOnInit() {
  console.log(this.phone,this.email,this.client_name)
  }

update_extra_data(){

  var extra_data =
  `- Nome e cognome:
  ${this.client_name}
  - Cellulare:
  ${this.phone}
  - Email:
  ${this.email}
  - Comune di residenza:
  ${this.live_city}
  - Indirizzo:
  ${this.live_street}
  - CAP:
  ${this.cap}
  - Codice Fiscale:
  ${this.fiscal_code}
  - Risposta via email:
  ${this.by_emial}
  - Crozia:
  ${this.croatia}`

  if(this.fiscal_code==undefined || this.fiscal_code==null|| this.fiscal_code==''){
    this.fiscal_code_err='Devi inserire il codice fiscale'
  }else{
    this.fiscal_code_err=''
  }
  // if(this.born_city==undefined || this.born_city==null|| this.born_city==''){
  //   this.born_city_err='Devi inserire il comune di nasicta'
  // }else{
  //   this.born_city_err=''
  // }
  if(this.live_city==undefined || this.live_city==null || this.live_city==''){
    this.live_city_err='Devi inserire il comune di residenza'
  }else{
    this.live_city_err=''
  }
  if(this.live_street==undefined || this.live_street==null|| this.live_street==''){
    this.live_street_err="Devi inserire l'indirizzo'"
  }else{
    this.live_street_err=''
  }
  if(this.cap==undefined || this.cap==null || this.cap==''){
    this.cap_err='Devi inserire il CAP'
  }else{
    this.cap_err=''
  }
  console.log(extra_data)
  // setTimeout(() => {
  //   if(this.cap_err==''&& this.live_street_err==''&& this.live_city_err==''&& this.fiscal_code_err==''){
  //     if(this.plt.is('hybrid')){
  //       this.apiNative.updateAppointment(this.appointment.id, this.appointment.start, this.appointment.end, this.appointment.day, this.appointment.month, this.appointment.year, this.appointment.client_name, this.appointment.phone, this.appointment.details, this.appointment.employee, this.appointment.service_n, extra_data).then(async res =>{
    
  //          await this.closeModal()
    
  //           await this.homeref.closeModal();  await this.homeref.nav.navigateRoot('/tabs/tab2'); await this.homeref.presentNotModal()
    
  //        }).catch(err=>{
  //          console.log(err)
    
  //        })
  //     }else{
  //       this.api.updateAppointment(this.appointment.id, this.appointment.start, this.appointment.end, this.appointment.day, this.appointment.month, this.appointment.year, this.appointment.client_name, this.appointment.phone, this.appointment.details, this.appointment.employee, this.appointment.service_n, extra_data).subscribe(async res =>{
    
    
    
    
    
  //           await this.closeModal()
  //           await this.homeref.closeModal();  await this.homeref.nav.navigateRoot('/tabs/tab2'); await this.homeref.presentNotModal()
     
          
          
         
  //        },err=>{
           
  //          console.log(err)
  //        })
  //     }
  //   }
  // }, 100);
  
  
}

async closeModal(){
  await this.modalController.dismiss();
}

}
