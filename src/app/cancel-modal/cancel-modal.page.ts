import { Component, OnInit, Input } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { NativeApiService } from '../services/nativeapi.service';
import { ApiService } from '../services/api.service';
import Notiflix from "notiflix";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
const { LocalNotifications } = Plugins;

@Component({
  selector: 'app-cancel-modal',
  templateUrl: './cancel-modal.page.html',
  styleUrls: ['./cancel-modal.page.scss'],
})
export class CancelModalPage implements OnInit {

  constructor(private plt: Platform,private modalController: ModalController,private apiNative:NativeApiService, private api: ApiService,) {}
  @Input() appointment
  @Input() homeref
  potions_pos='0vw'
  delete_pos='100vw'
  height
  cancel_loading=false 
  event_listener
  months_names=['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']
rows = ["06:45", "07:00", "07:15", "07:30", "07:45", "08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30", "22:45", "23:00", "23:15", "23:30", "23:45", "24:00"]
  ngOnInit() {
    
    this.height = window.innerHeight
    var x:any = document.getElementsByClassName('pay-customer-modal')[0]
    x.style.transition="400ms"        
      x.style.paddingTop =`calc(${this.height}px - 310px)`
      var y =document.getElementsByClassName("modal-shadow")
     y[y.length-1].addEventListener('click',async()=>{
       await  this.closeModal()      
      })
  }
 
  async deleteappo(){
    var appo =this.appointment
    this.cancel_loading=true
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
          await this.homeref.getClientAppointments()
          
          Notiflix.Report.Init(
            {success: 
              {svgColor:'#0061d5',
              titleColor:'#1e1e1e',
              messageColor:'#242424',
              buttonBackground:'#0061d5',
              buttonColor:'#fff'
              ,backOverlayColor:'rgba(#00479d,0.2)',},
            })
            
             await LocalNotifications.getPending().then( res => {
              var id_1 =appo.id
              var id_2 =appo.id+1000
              
              var indexes = res.notifications.filter((val,ind,arr)=>{ return val.id == id_1.toString() ||val.id == id_2.toString() })
              
              LocalNotifications.cancel({notifications: indexes});
            
              
              
              
            })
           
            this.cancel_loading=false
            await this.closeModal()
          Notiflix.Report.Success("Appuntamento cancellato", "L'appuntamento è stato cancellato con successo!", 'Continua')
        }).catch(async err=>{    
          this.cancel_loading=false    
          Notiflix.Report.Failure("Errore durante la cancellazione", "L'appuntamento non è stato cancellato. Controlla la tua connessione e riprova.", 'Annulla');
        })
       }else{
        this.api.deleteAppointment(appo.id).subscribe(async data=>{
          await this.homeref.getClientAppointments()
         
          // this.getClientAppointments()
          Notiflix.Report.Init(
            {success: 
              {svgColor:'#0061d5',
              titleColor:'#1e1e1e',
              messageColor:'#242424',
              buttonBackground:'#0061d5',
              buttonColor:'#fff'
              ,backOverlayColor:'rgba(#00479d,0.2)',},
            })
            this.cancel_loading=false
            await this.closeModal()
          Notiflix.Report.Success("Appuntamento cancellato", "L'appuntamento è stato cancellato con successo!", 'Continua')
        },async err=>{
          this.cancel_loading=false
          Notiflix.Report.Failure("Errore durante la cancellazione", "L'appuntamento non è stato cancellato. Controlla la tua connessione e riprova.", 'Annulla');
        })
       }
    }else{
    this.homeref.handelNotdelete(appo)
    this.cancel_loading=false
    await this.closeModal()
    }
   
    
  }
  async closeModal(){
    var y =document.getElementsByClassName("modal-shadow")
     y[y.length-1].removeEventListener('click',async()=>{
       await  this.closeModal()      
      })
    
    await this.modalController.dismiss();

  }
  async openMap(){
    if (this.plt.is('android')) {
      window.location.href = 'https://www.google.com/maps/search/?api=1&query=' + this.appointment.location;
    } else {
      window.location.href = 'maps://maps.apple.com/?q=' + this.appointment.location;
    }
  }
  goDelete(){ 
    var x:any = document.getElementsByClassName('pay-customer-modal')[0]
    x.style.transition="400ms"        
      x.style.paddingTop =`calc(${this.height}px - 240px)`
    this.potions_pos='-100vw'
    this.delete_pos='0vw'
  }
    
}
