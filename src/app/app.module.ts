import { NgModule } from '@angular/core';
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
import { Stripe } from '@ionic-native/stripe/ngx';
import { PopoverComponent } from './popover/popover.component';
// import { ApplePay } from '@ionic-native/apple-pay/ngx';
import { PayPal } from '@ionic-native/paypal/ngx';
import { Braintree} from '@ionic-native/braintree/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@NgModule({
  declarations: [AppComponent,PopoverComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    CommonModule,
   
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule],
  providers: [
    StatusBar,
    Diagnostic,
    AppCenterAnalytics,
    // ApplePay,
    PayPal,
    Stripe,
    Braintree,    
    Keyboard,
    BarcodeScanner,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
