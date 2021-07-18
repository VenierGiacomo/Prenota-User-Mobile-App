import { Component, OnInit, Input } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { NativeApiService } from '../../services/nativeapi.service';

const { LocalNotifications } = Plugins;



@Component({
  selector: 'app-not-modal',
  templateUrl: './not-modal.page.html',
  styleUrls: ['./not-modal.page.scss'],
})
export class NotModalPage implements OnInit {
  
  @Input() notifications
  constructor( private oneSignal: OneSignal,private apiNative: NativeApiService,public diagnostic_var: Diagnostic, public modalController: ModalController,) { }

  ngOnInit() {
  }
  async notfications(){
    LocalNotifications.requestPermission().then(async(res)=>{
      if(res.granted){
        if(this.notifications!=undefined){
          await LocalNotifications.schedule({
            notifications: this.notifications 
          })
        }
        var self = this
            var notificationOpenedCallback =  function(jsonData) {
                }  
       
            // Set your iOS Settings
            var iosSettings = {};
            iosSettings["kOSSettingsKeyAutoPrompt"] = false;
            iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
            this.oneSignal.startInit("91f9f284-1a50-44c4-8d5d-7ff9102e75a0",'51693766010')
              .handleNotificationOpened(notificationOpenedCallback) //.then(this.nav.navigateRoot("notifications"))
              .iOSSettings(iosSettings)
              .inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification)
              .endInit();
            
            // The promptForPushNotificationsWithUserResponse function will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 6)
            this.oneSignal.promptForPushNotificationsWithUserResponse().then(function(accepted) {
            });
            this.oneSignal.setSubscription(true)
            this.oneSignal.handleNotificationReceived().subscribe(() => {
     
             });
              this.oneSignal.getIds().then(data =>{
                this.apiNative.registerdevice(data.userId).then(data =>{
              
                })
              })

        await this.closeModal()
      }else{
        await this.diagnostic_var.switchToSettings()
        await this.closeModal()
      }
      // await this.closeModal()
    })
    // await this.closeModal()
  }
  async closeModal(){
    await this.modalController.dismiss();
  }

}
