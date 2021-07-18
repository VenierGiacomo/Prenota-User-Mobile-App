import { Component, OnInit, ViewChild} from '@angular/core';
import { NavController, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  @ViewChild('slides', { read: IonSlides,static: false }) slides: IonSlides;
  check1=false
  check2=false
  check3=false
  disabled=true
  constructor(  private nav: NavController,) { }

  ngOnInit() {
  }
  home(){
    this.nav.navigateRoot("/tabs/tab1");
  }
  next() {
    this.slides.slideNext(500);
  }
}
