import { Component, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, NavController, ModalController, ToastController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';


import { Plugins } from '@capacitor/core';
import { RegisterPage } from './register/register.page';
import { NativeApiService } from './services/nativeapi.service';
const { SplashScreen } = Plugins;
const { App } = Plugins;
// import { CodePush, InstallMode } from '@ionic-native/code-push/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,    
    private nav: NavController,
    private modalController: ModalController,
    private zone: NgZone,
    private toastController: ToastController,
    private apiNative: NativeApiService
    // private codePush: CodePush
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      setTimeout(() => {
        SplashScreen.hide();
      }, 800);
    });
    App.addListener('appUrlOpen', (data: any) => {
      this.zone.run(async () => {
          const slug = data.url.split(".cc/").pop();
          console.log(slug)
          if (slug) {
            var slug_parts =slug.split('/')
            console.log(slug_parts)
            if(slug_parts[0] == 'register'){
              var token: any = await this.apiNative.isvalidToken()
              if(token){
                await this.presentToast('Per registrare un nuovo account devi prima effetuare il logout')
              }else{
                data = {
                  first_name: slug_parts[1],
                  last_name :  slug_parts[2],
                  email : slug_parts[3],
                  phone : slug_parts[4],
                }
                await this.presentRegisterModal(data)
              }
            } 
              
          }
          // If no match, do nothing - let regular routing
          // logic take over
      });
  });
  }
async presentRegisterModal(reg_data) {
      const modal = await this.modalController.create({
        component:RegisterPage,
        swipeToClose: true,
        cssClass: 'select-modal' ,
        componentProps: { 
          first_name: reg_data.first_name,
           last_name :  reg_data.last_name,
           email : reg_data.email,
           phone : reg_data.phone
        }
      });
      return await modal.present();
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
}
