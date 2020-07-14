import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.page.html',
  styleUrls: ['./more-info.page.scss'],
})
export class MoreInfoPage implements OnInit {
  @ViewChild('topcont') pageTop: IonContent;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }
  async closeModal(){
    await this.modalController.dismiss();
  }
 scrollToTop() {
  let that = this;
  const yOffset = -140; 
  const element = document.getElementById('page-1');
  const y = element.getBoundingClientRect().top + yOffset;
  console.log(y)
  setTimeout(()=>{that.pageTop.scrollByPoint(0,y,700);},200);
  }

}
