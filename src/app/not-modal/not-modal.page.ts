import { Component, OnInit, Input } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

const { LocalNotifications } = Plugins;



@Component({
  selector: 'app-not-modal',
  templateUrl: './not-modal.page.html',
  styleUrls: ['./not-modal.page.scss'],
})
export class NotModalPage implements OnInit {
  
  @Input() notifications
  constructor(public diagnostic_var: Diagnostic, public modalController: ModalController,) { }

  ngOnInit() {
  }
  async notfications(){
    LocalNotifications.requestPermission().then(async(res)=>{
      if(res.granted){
        await LocalNotifications.schedule({
          notifications: this.notifications 
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
