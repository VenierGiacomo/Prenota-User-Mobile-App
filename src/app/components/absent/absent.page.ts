import { Component, NgZone, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ActionSheetController, NavController, Platform, ToastController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { NativeApiService } from '../../services/nativeapi.service';
import { StorageService } from '../../services/storage.service';


const { Network } = Plugins;
@Component({
  selector: 'app-absent',
  templateUrl: './absent.page.html',
  styleUrls: ['./absent.page.scss'],
})
export class AbsentPage implements OnInit {

  constructor(private ngZone: NgZone, private toastController: ToastController,public actionSheetController: ActionSheetController, private nav: NavController ,  private storage: StorageService, private api:ApiService, private plt:Platform,private apiNative:NativeApiService) {}

  ngOnInit() {
  }
  reconnect(){
    Network.getStatus().then( (status) => {
      this.ngZone.run(() => {
        if(status.connected){
          this.nav.navigateRoot('/tabs/tab1')
        }else{
          this.presentToast('Connessione ancora assente')
          
        }      
      });
    });
  }
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'top',
      duration: 3000,
      cssClass:'toast-class',
    });
    toast.present();
  }

  async assistenzaActionSheet() {

    // this.presentPayModal()
    const actionSheet = await this.actionSheetController.create({
      header: 'Assistenza',
      
      buttons: [{
        text: 'Email',
        // icon: 'share',
        handler: () => {
          window.location.href="mailto:business@prenota.cc"
        }
      }, {
        text: 'Whatsapp',
        // icon: 'caret-forward-circle',
        handler: () => {
          window.location.href="https://wa.me/393404526854"
        }
      }, {
        text: 'Chiama',
        // icon: 'heart',
        handler: () => {
          window.location.href="tel:+393404526854";
        }
      }, {
        text: 'Annulla',
        // icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
    

      

  }
}
