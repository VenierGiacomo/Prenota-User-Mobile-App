import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HTTP } from '@ionic-native/http/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { CodePush } from '@ionic-native/code-push/ngx';
import { AppCenterAnalytics } from '@ionic-native/app-center-analytics/ngx';
import { Stripe } from '@ionic-native/stripe/ngx';
@NgModule({
  declarations: [AppComponent],
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
    CodePush,
    AppCenterAnalytics,
    SafariViewController,
    LocalNotifications,
    HTTP,
    Stripe,
    Deeplinks,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
