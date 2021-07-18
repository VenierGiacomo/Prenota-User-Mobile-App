import { Component, OnInit, Input } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ModalController, Platform } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { NativeApiService } from '../../services/nativeapi.service';

const { LocalNotifications } = Plugins;


@Component({
  selector: 'app-not-settings',
  templateUrl: './not-settings.page.html',
  styleUrls: ['./not-settings.page.scss'],
})
export class NotSettingsPage implements OnInit {

  constructor(private plt: Platform, private oneSignal: OneSignal,private apiNative: NativeApiService,public diagnostic_var: Diagnostic, public modalController: ModalController,) { }
  areEnabled=false
  ngOnInit() {
    LocalNotifications.areEnabled().then(async (res)=>{
      // this.areEnabled=res.value
      if(this.areEnabled){
        await this.connectOnesignal()
      }
    })
  }
  
  async notfications(){
    LocalNotifications.requestPermission().then(async(res)=>{
      if(res.granted){
        this.areEnabled=true
     await this.connectOnesignal()

      }else{
        await this.diagnostic_var.switchToSettings()
      }
      // await this.closeModal()
    })
    
}
async closeModal(){
  await this.modalController.dismiss();
}
async connectOnesignal(){

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
}
async testNotfication(){
  this.connectOnesignal().then(res=>{
      this.apiNative.testNotifications().then(res=>{
        if(!true){
          console.log("C'è stato un problema")
        }
      }).catch(err=>{
        console.log("C'è stato un problema")
      })
  })
  
}
}
