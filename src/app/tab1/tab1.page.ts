import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { BookModalPage } from '../book-modal/book-modal.page';
import Notiflix from "notiflix";
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NgControlStatus } from '@angular/forms';
import { NativeApiService } from '../services/nativeapi.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
shops:any=[]
salute:any=[]
capelli:any=[]
grouped:any=[]
spin='block'
doctor = ['ECG', 'Visita agonistica', 'Visita non agonistica', 'Nutrizione e dieta', 'Visista sotto sforzo']
barber = [ 'Taglio uomo', 'Taglio donna', 'Shampoo', 'Barba', 'Tinta', 'Manicure', 'Meches']
dentist =[ 'Controlli di routine', 'Visita odontoiatrica',"Estrazioni", ' Otturazioni e terapie canalari', 'Apparecchio','Applicazione di protesi'  ]
  constructor(public modalController: ModalController,private api:ApiService, private plt:Platform,private apiNative:NativeApiService) {
    this.plt.ready().then(
      () =>{
        if (this.plt.is('hybrid')) {
          this.apiNative.getStores().then(data=>{
            var shops:any =data
            var items = shops,
            grouped = [];
            items.forEach(function (a) {
                this[a.business_type] || grouped.push(this[a.business_type] = []);
                this[a.business_type].push(a);
            }, Object.create(null));
            this.shops = grouped
            this.spin='none'
                    }).catch(err=>{
                      this.spin='none'
                      Notiflix.Report.Warning("Problemi di rete", 'Verifica che la tua connessione funzioni o riprova più tardi', 'OK');
                      console.log(err,'1ui')
                    })
        }
        else{
          this.api.getStores().subscribe(data=>{
            var shops:any =data
            var items = shops,
            grouped = [];
            items.forEach(function (a) {
                this[a.business_type] || grouped.push(this[a.business_type] = []);
                this[a.business_type].push(a);
            }, Object.create(null));
            this.shops = grouped
            this.spin='none'
                    },err=>{
                      this.spin='none'
                      Notiflix.Report.Warning("Problemi di rete", 'Verifica che la tua connessione funzioni o riprova più tardi', 'OK');
                      console.log(err,'qua')
                    })
        }
        } ) 
        
  }

  ngOnInit() {

  }
  async presentModal(img, name, role,id ) {
    const modal = await this.modalController.create({
      component:BookModalPage,
      swipeToClose: true,
      cssClass: 'select-modal' ,
      componentProps: {
        image: img,
        name: name,
        role: role,
        id: id

      }
    });
    return await modal.present();
  }
}
