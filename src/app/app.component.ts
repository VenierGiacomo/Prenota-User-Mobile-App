import { Component, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { CodePush, InstallMode, SyncStatus } from '@ionic-native/code-push/ngx';

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
    private nav: NavController,
    public deeplinks: Deeplinks,
    private zone: NgZone,
    private codePush: CodePush
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
    
       
    this.codePush.sync({ installMode: InstallMode.ON_NEXT_RESUME, mandatoryInstallMode: InstallMode.IMMEDIATE}).subscribe((syncStatus) => {
      })

      // document.addEventListener("resume", function () {
        // this.codePush.sync({ updateDialog: {
        //   appendReleaseDescription: true,
        //   descriptionPrefix: "\n\nChange log:\n"   
        //  },
        //  installMode: InstallMode.IMMEDIATE}).subscribe(
        //   (data) => {
        //    console.log('CODE PUSH SUCCESSFUL: ' + data);
           
        //   },
        //   (err) => {
        //    console.log('CODE PUSH ERROR: ' + err);
           
        //   }
        // );
     
 
    });
  }
  setUpDeepLinks(){
    this.deeplinks.route({
      '': 'home',
    }).subscribe(match => {
      this.zone.run(()=>{
        this.nav.navigateRoot("")
      })
      console.log('Successfully matched route', match);
    }, nomatch => {
      this.zone.run(()=>{
        this.nav.navigateRoot("")
      })
      console.error('Got a deeplink that didn\'t match', nomatch);
    });
  }
}
