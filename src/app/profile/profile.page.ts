import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { NativeApiService } from '../services/nativeapi.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private plt: Platform, private modalController: ModalController,private apiNative:NativeApiService) { }
   first_name = ''
  last_name = ''
  email = ''
  sex = 'm'
  phone = ''
  ngOnInit() {
    if(this.plt.is("hybrid")){
      this.apiNative.getUserData().then((res)=>{
        var data:any = res
        this.first_name = data.first_name
        this.last_name = data.last_name
        this.email = data.email      
        this.phone = data.phone
      })
  
    }
    
  }
  async closeModal(){
    await this.modalController.dismiss();
  }

}
