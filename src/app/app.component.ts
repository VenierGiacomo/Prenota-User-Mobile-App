import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private nav: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.get('introShown').then((result) => 
    {
        // If it is set, then skip that page
        if(result){
          this.nav.navigateRoot('tabs/tab1');
        }
        // Otherwise if property is not set, then show that page for once and then set property to true
        else {
          this.nav.navigateRoot('onboarding');
          this.storage.set('introShown', true);
        }

      });
    });
  }
}
