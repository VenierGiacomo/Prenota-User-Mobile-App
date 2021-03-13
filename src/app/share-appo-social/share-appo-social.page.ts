import { Component, OnInit, Input } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
const { Share } = Plugins;
import { SocialSharing } from '@ionic-native/social-sharing/ngx';



@Component({
  selector: 'app-share-appo-social',
  templateUrl: './share-appo-social.page.html',
  styleUrls: ['./share-appo-social.page.scss'],
})
export class ShareAppoSocialPage implements OnInit {

  constructor(private socialSharing: SocialSharing ,private modalController: ModalController) { }
  @Input() img
  @Input() name
  @Input() business_type
  ngOnInit() {
  }
  async shareFB(){
    var emoji = String.fromCodePoint(0x1F60A)
    this.socialSharing.shareViaFacebook(`Hey! Sono andato da ${this.name}. Ho prenotato online ed è stato facilissimo. Te lo consiglio ${emoji}!. `, null, 'https://prenota.cc/').then((res) => {
      // Sharing via email is possible
      console.log(res)
    }).catch((err) => {
      console.log(err)
      // Sharing via email is not possible
    });
  }
  async share(){
    var emoji = String.fromCodePoint(0x1F60A)
    var text = `Hey! Sono andato da ${this.name} (${this.business_type}). Ho prenotato online ed è stato facilissimo. Te lo consiglio ${emoji}!`
    let shareRet = await Share.share({
      title: 'Fantastico prenotare così',
      text: text,
      url: 'https://prenota.cc/',
      dialogTitle: 'Supporta un business locale'
    });
  }
  async closeModal(){
    await this.modalController.dismiss();
  }
}
