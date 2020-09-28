import { Component } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { RegisterPage } from '../register/register.page';
import { StorageService } from '../services/storage.service';
import { ApiService } from '../services/api.service';
import { NativeApiService } from '../services/nativeapi.service';
import Notiflix from "notiflix";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  shops:any=[]
  spin='block'
  constructor(private storage: StorageService, public modalController: ModalController,private api:ApiService, private plt:Platform,private apiNative:NativeApiService) {
    this.plt.ready().then(
      () =>{
        if (this.plt.is('hybrid')) {
          this.apiNative.getStores().then(data=>{
            var shops:any =data
            this.storage.setShops(shops)
            this.shops = data
            this.spin='none'
                    }).catch(err=>{
                      this.spin='none'
                      Notiflix.Report.Warning("Problemi di rete", 'Verifica che la tua connessione funzioni o riprova più tardi', 'OK');
                     
                    })
                    
        }
        else{
          this.api.getStores().subscribe(data=>{
            var shops:any =data
            this.storage.setShops(shops)
          
            this.shops = data
            console.log(data)
            this.spin='none'
                    },err=>{
                      this.spin='none'
                      Notiflix.Report.Warning("Problemi di rete", 'Verifica che la tua connessione funzioni o riprova più tardi', 'OK');
                    
                    })
        }
        } ) 
  }
  async presentRegisterModal() {
    const modal = await this.modalController.create({
      component:RegisterPage,
      swipeToClose: true,
      cssClass: 'select-modal' ,
      // componentProps: {
      //   image: img,
      //   name: name,
      //   role: role,
      //   // services: type

      // }
    });
    // modal.onDidDismiss().then(() => {
    // Notiflix.Report.Success("L'appuntamento è stato prenotato", 'Controlla la tua email per ulteriori informazioni', 'OK');
    // });
    return await modal.present();
  }
}
