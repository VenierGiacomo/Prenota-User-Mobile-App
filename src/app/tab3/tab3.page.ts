import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RegisterPage } from '../register/register.page';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(public modalController: ModalController) {}
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
