import { NgModule, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { AppCenterAnalytics } from '@ionic-native/app-center-analytics/ngx';
// import { Stripe } from '@ionic-native/stripe/ngx';
import { PopoverComponent } from './popover/popover.component';
// import { ApplePay } from '@ionic-native/apple-pay/ngx';
// import { PayPal } from '@ionic-native/paypal/ngx';
// import { Braintree} from '@ionic-native/braintree/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import 'hammerjs'
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { HammerModule } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';
import { OneSignal } from '@ionic-native/onesignal/ngx';
@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
    buildHammer(element: HTMLElement): any {
      return new Hammer(element, {
        swipe: { direction: Hammer.DIRECTION_ALL }
      });
   }
}
@NgModule({
  declarations: [AppComponent,PopoverComponent,],
  entryComponents: [],
  imports: [
    BrowserModule,
    CommonModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot({
      mode: 'ios'}),
    AppRoutingModule,
    HammerModule,
    HttpClientModule],
  providers: [
    StatusBar,
    SocialSharing,
    Diagnostic,
    AppCenterAnalytics,
    // ApplePay,
    OneSignal,
    // Stripe,  
    Keyboard,
    BarcodeScanner,
    {provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
