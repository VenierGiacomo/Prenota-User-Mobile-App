import { Component, NgZone } from '@angular/core';
import { Platform, NavController, ModalController, ToastController } from '@ionic/angular';
import { Plugins, StatusBarStyle } from '@capacitor/core';
import { RegisterPage } from './components/register/register.page';
import { NativeApiService } from './services/nativeapi.service';
import { ShareAppoSocialPage } from './modals/share-appo-social/share-appo-social.page';


const { Network } = Plugins;
const { SplashScreen } = Plugins;
const { StatusBar } = Plugins;

const { App } = Plugins;
const { LocalNotifications } = Plugins;
// import { CodePush, InstallMode } from '@ionic-native/code-push/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
        
    private nav: NavController,
    private modalController: ModalController,
    private zone: NgZone,
    private toastController: ToastController,
    private apiNative: NativeApiService,
    private ngZone: NgZone
  ) {
    this.initializeApp();
  }

initializeApp() {
    this.platform.ready().then(async () => {
      if(this.platform.is('hybrid')){
      
        await StatusBar.setStyle({ style: StatusBarStyle.Light });
        setTimeout(() => {
          SplashScreen.hide();
        }, 1000);
        await LocalNotifications.addListener( 'localNotificationActionPerformed',    (not) => {
          this.ngZone.run( () => {
            const res = not
            this.presentSharemodal(res)
          })
        })
        await App.addListener('appUrlOpen', (data: any) => {
          this.zone.run(async () => {
              const slug = data.url.split(".cc/").pop();
              
              if (slug) {
                var slug_parts =slug.split('/')
                
                if(slug_parts[0] == 'register'){
                  var token: any = await this.apiNative.isvalidToken()
                  if(token){
                    if(slug_parts[6]){
                      this.apiNative.updateStoreClientQRCode(slug_parts[6]).then(async res=>{
                        await this.presentToast('Profilo collegato')
                      }).catch(err=>{
                        console.log(err)
                      })
                    }else{
                      await this.presentToast('Per registrare un nuovo account devi prima effettuare il logout')
                    }
                   
                  }else{
                    data = {
                      first_name: slug_parts[1],
                      last_name :  slug_parts[2],
                      email : slug_parts[3],
                      phone : slug_parts[4],
                      client_id : slug_parts[6],
                    }
                    await this.presentRegisterModal(data)
                  }
                } 
                  
              }
    
          });
        });
       


        await Network.addListener("networkStatusChange", (status) => {
          this.ngZone.run(() => {
            if(!status.connected){
              this.nav.navigateRoot('/noconnection')
            }else{
              this.nav.navigateRoot('/tabs/tab1')
            }
          });
        });
      }
    })
}

async presentSharemodal(not){
  if(not.notification.extra.open){
    const modal = await this.modalController.create({
      component: ShareAppoSocialPage,
      swipeToClose: false,
      cssClass: 'not-modal' ,
      componentProps:{
        img: not.notification.extra.shop.img,
        name: not.notification.extra.shop.name,
        business_type: not.notification.extra.shop.business_type,
      }
    });
    return await modal.present();
  }
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
        phone : reg_data.phone,
        client_id:reg_data.client_id
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
