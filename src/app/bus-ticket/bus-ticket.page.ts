import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, NavController, ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import Notiflix from "notiflix";
import { NativeApiService } from '../services/nativeapi.service';
import { ApiService } from '../services/api.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';


//capcitor plugins
import { Plugins } from '@capacitor/core';
import '@capacitor-community/stripe'; 
import { StripePlugin } from '@capacitor-community/stripe';
import { StorageService } from '../services/storage.service';
const StripeCap = Plugins.Stripe as StripePlugin;
const { Http } = Plugins;
const { Browser } = Plugins;

@Component({
  selector: 'app-bus-ticket',
  templateUrl: './bus-ticket.page.html',
  styleUrls: ['./bus-ticket.page.scss'],
})
export class BusTicketPage implements OnInit {
  confirm='none'
  loading='none'
  payment_loading=false
  sure_confirm='block'
  card='block'
  paymentAmount: string = '1.35';
  currency: string = 'EUR';
  currencyIcon: string = '€';
  pos_ticket="0px"
  pos_pay="100vw"
  pos_card="100vw"
  pos_ticket_top="0px"
  pos_scan_top='420px'
  disabled_btn=true
  code
  event_listener
  scroll_cont=false
  product_buying={name:"",price:0}
  listner_1
  listner_2
  fast_pay = true
  client_secret:any
  payment_methods
  ticket_type
  products_list=[{name:"Biglietto 1 ora intera rete", price:'1.35'},{name:"Biglietto giornaliero intera rete",price:'4.60'}, {name:"Abbonamento mensile intera rete", price:'35.75'}]
  constructor(private actionSheetController: ActionSheetController, private storage: StorageService, private keyboard: Keyboard,public alertController: AlertController,private toastController:ToastController,private barcodeScanner: BarcodeScanner,private nav: NavController, private modalController: ModalController, private plt:Platform,private apiNative:NativeApiService,private api: ApiService,) {
    // Render the PayPal button into #paypal-button-container
    // 
    this.plt.ready().then(async ()=>{
      // StripeCap.setPublishableKey({ key: 'pk_live_kb4i70qfPxeWXXYfjImvx64f00Et58vNmC' })
      StripeCap.setPublishableKey({ key: 'pk_test_f3m2iNJqa6UdyuD9Ey8O7ZiH00eSjJ4lEt' })
      this.event_listener =document.getElementsByClassName("modal-shadow")[0].addEventListener('click',async()=>{
       await  this.closeModal()      
      })
      StripeCap.isApplePayAvailable().then(res=>{
        StripeCap.isGooglePayAvailable().then(res1=>{
         this.fast_pay = res.available || res1.available
       })
      })
      await this.getCLientSecret('monthly')
   })
   
  }
  //  ngOnDestroy(){
  //    this.event_listener.
  //  }
  
  ngOnInit() {
    
  }
  ionViewDidEnter() {
    this.plt.ready().then(() => {    
      this.keyboard.disableScroll(true);
      this.keyboard.hideFormAccessoryBar(true)
    });
}

ionViewDillLeave() {
    this.plt.ready().then(() => {
      this.keyboard.disableScroll(false);
    });
}
 
  confirmBuy(){
    this.loading='block'
          setTimeout(async () => {
              this.card='block'
              this.confirm='none'
              this.sure_confirm='none'
              this.loading='none'
              
              this.sure_confirm='none'
              this.confirm='none'
              this.loading='none'
              await this.closeModal()
              Notiflix.Report.Init(
                {success: 
                  {svgColor:'#0061d5',
                  titleColor:'#1e1e1e',
                  messageColor:'#242424',
                  buttonBackground:'#0061d5',
                  buttonColor:'#fff'
                  ,backOverlayColor:'rgba(#00479d,0.4)',},
                })
              Notiflix.Report.Success("Biglietto acquistato", 'Il biglietto è stato acquistato con successo', 'OK');
               setTimeout(async () => {  var ok_btn = document.getElementById('NXReportButton')
              ok_btn.addEventListener("click",async ()=>{   await this.nav.navigateRoot('tabs/tab2')
               ;},false)}, 200); 
            }, 1800);
   
  }
  async buy(product){
    this.product_buying = product
    this.pos_ticket="-110vw"
    if(this.fast_pay && this.ticket_type=='monthly'){
      var x:any = document.getElementsByClassName('ticket-modal')[0]
      x.style.transition="400ms"
      x.style.paddingTop ="calc(100vh - 300px)"
      this.pos_pay="0vw"
    }else{
      var x:any = document.getElementsByClassName('ticket-modal')[0]
      x.style.transition="400ms"
      x.style.paddingTop ="calc(100vh - 220px)"
      this.pos_pay="0vw"
    }
    
    // if (this.plt.is('hybrid')) {
    //   var token: any = await this.apiNative.isvalidToken()
    //   if(token){
    //     this.confirm='block'
    //   }   
    // }else{
    //   if(this.api.isvalidToken()){
    //     this.confirm='block'
    //   }
    // }
}
async getCLientSecret(type){
  if(this.plt.is('hybrid')){
    this.apiNative.stripeBusTicket(type).then(res=>{this.client_secret = res.client_secret})
  }
}
  async  applePayment() {
    var clientSecret = this.client_secret
        var cc = await StripeCap.confirmPaymentIntent({
          clientSecret,
          applePayOptions:{
            merchantId: 'merchant.stripe.prenota.cc',
            country: 'IT',
            currency: 'EUR',
            items: [{ label: "Abbonamento mensile intera rete",
              amount: 35.75}],
          },
          // card: {
          //     number: card_number,
          //     exp_month: Number(date[0]),
          //     exp_year: 2000+ Number(date[1]),
          //     cvc: cvv,
          // },
          redirectUrl: 'https://prenota.cc/', // Required for Android
      }).then(async ()=>{
        await this.closeModal()
        Notiflix.Report.Init(
          {success: 
            {svgColor:'#0061d5',
            titleColor:'#1e1e1e',
            messageColor:'#242424',
            buttonBackground:'#0061d5',
            buttonColor:'#fff'
            ,backOverlayColor:'rgba(#00479d,0.4)',},
          })
        Notiflix.Report.Success("Biglietto acquistato", 'Il biglietto è stato acquistato con successo', 'OK');
         setTimeout(async () => {  var ok_btn = document.getElementById('NXReportButton')
        ok_btn.addEventListener("click",async ()=>{   await this.nav.navigateRoot('tabs/tab2')
         ;},false)}, 200); 
      }).catch(()=>{
        this.presentToast("C'è stato un problema durante il pagamento. La spesa non è stata addebitata.")})
      this.payment_loading=false 
    }

    

  //  payWithPaypal() {
    // this.payPal.init({
      //   PayPalEnvironmentProduction: 'AfC-xmRHdLkkpclIkiprJHeUZTZJ20Mvl-FH1KUGfLbr-lIuOZ-d93Ft-jwIWiUbXFcEm0WWiNs17yQB',
      //   PayPalEnvironmentSandbox: 'ARp33AqrJxMTaO5owUrDqtRhqPZfbjRN0J9vI2JHr20vbhZTgS7HYQWxnBbxDsW6_85p2BoY7Xf8x6wd'
      // }).then(() => {
      //   // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      //    this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
      //     acceptCreditCards: false,
      //     merchantName: 'Prenota',
      //     merchantPrivacyPolicyURL: 'https://prenota.cc/privacy',
      //     merchantUserAgreementURL: 'https://prenota.cc/terms',
      //     presentingInPopover: true,
      //     payPalShippingAddressOption:0,
      //   }))
      // }).catch((err)=>{
      //   console.log(err)
      // })
  //       var paymentDetails = new PayPalPaymentDetails("1.35", "0.00", "0.00");
  //       let payment = new PayPalPayment(this.paymentAmount, this.currency, 'Biglietto 1 ora', 'Sale',paymentDetails);
  //        this.payPal.renderSinglePaymentUI(payment).then((res) => {
  //         console.log(res);
  //         // Successfully paid
  //       }, (err) => {
  //         console.log(err, 'iiiiiiiiiiii');
  //         // Error or render dialog closed without being successful
  //       })
  // }
  payWithBrainTree() {
    // const BRAINTREE_TOKEN = 'sandbox_8h6bnq59_3fz888h6rvxzvznd';

    // // NOTE: Do not provide this unless you have configured your Apple Developer account
    // // as well as your Braintree merchant account, otherwise the Braintree module will fail.
    // const appleOptions: ApplePayOptions = {
    //   merchantId: 'merchant.stripe.prenota.cc',
    //   currency: 'EUR',
    //   country: 'IT'
    // }
    
    // const paymentOptions: PaymentUIOptions = {
    //   amount: '1.35',
    //   primaryDescription: 'Biglietto 1 ora intera rete',
    // }
    
    // this.braintree.initialize(BRAINTREE_TOKEN)
    //   .then(() => this.braintree.presentDropInPaymentUI(paymentOptions))
    //   .then( (result: PaymentUIResult) => {
    //     if (result.userCancelled) {
    //       console.log("User cancelled payment dialog.");
    //     } else {
    //       this.closeModal()
    //       Notiflix.Report.Init(
    //         {success: 
    //           {svgColor:'#0061d5',
    //           titleColor:'#1e1e1e',
    //           messageColor:'#242424',
    //           buttonBackground:'#0061d5',
    //           buttonColor:'#fff'
    //           ,backOverlayColor:'rgba(#00479d,0.4)',},
    //         })
    // Notiflix.Report.Success("Biglietto acquistato", 'Il biglietto è stato acquistato con successo', 'OK');
    //     }
    //   })
      // .catch((error: string) => console.error(error));
}
 
  async closeModal(){
    clearInterval(this.event_listener) 
    clearInterval(this.listner_1) 
    clearInterval(this.listner_2) 
    await this.modalController.dismiss();
  }
  show_monthly(){
    this.pos_ticket_top='-400px'
    this.pos_scan_top="0px"
    var x:any = document.getElementsByClassName('ticket-modal')[0]
    x.style.transition="400ms"
    x.style.paddingTop ="calc(100vh - 480px)"
    this.ticket_type= 'monthly'
    // this.getCLientSecret('monthly')
    // setTimeout(() => {
    //   this.presentAlert()
    // }, 600);

  }
 

  roll_top(){
      var x:any = document.getElementsByClassName('ticket-modal')[0]
      x.style.transition="400ms"
      // x.style.paddingTop ="calc(100vh - 730px)"
  }
  roll_bottom(){
    var x:any = document.getElementsByClassName('ticket-modal')[0]
    x.style.transition="400ms"
    // x.style.paddingTop ="calc(100vh - 480px)"
  }
    type_num(i,ev){ 
      ev.preventDefault() 
      var key = ev.keyCode || ev.charCode;
      var ind_selected:any = document.getElementById(i)
      var pre = i-1
      var ind_prev:any = document.getElementById(pre.toString())
      var next = i+1
      var ind_next:any = document.getElementById(next)
  
      // if(ind_selected.value.toString().length>1){
      //   ind_selected.value=ind_selected.value.toString()[0]
       
      // }
      if( key == 8 || key == 46 ){
        if(i>0){
          ind_selected.value=null
          ind_prev.focus()
        }else{
          ind_selected.value=null
        }
      }else{      
        if(i<5){
          ind_selected.value=ev.key
          ind_next.focus()
        }else{
          ind_selected.value=ev.key
          ind_selected.blur()
        }
      this.code=""
      for(let ind=0; ind<6;ind++){
        var doc:any =document.getElementById(ind.toString())
  
        this.code = this.code+doc.value.toString()
      }
      if(this.code.length==6){
        this.disabled_btn=false
      }else{
        this.disabled_btn=true
      }
      }
     
      }
      confirm_code(){
        this.pos_scan_top='-520px'
        this.pos_ticket_top='0px'
        this.scroll_cont=false
        var x:any = document.getElementsByClassName('ticket-modal')[0]
        x.style.transition="400ms"
        x.style.paddingTop ="calc(100vh - 380px)"
     
        setTimeout(()=>{
          this.buy(this.products_list[2])
        },600)
      }

      async CardorNopay(){
        this.payment_methods = await this.storage.getPaymentMethods()
        if(this.payment_methods == undefined || this.payment_methods.data == undefined || this.payment_methods.data[0] == undefined || this.payment_methods.data[0].card ==undefined || this.payment_methods.data[0].card.brand.length<2){
          await this.goCard()
        }else{
          await this.cardsActionSheet()
        }
        
    
      }
      async cardsActionSheet() {
        var buttons=[]
        this.payment_loading=true
        for (let el of this.payment_methods.data){
         var button= {
                      text: `${el.card.brand.toUpperCase()} ···· ···· ···· ${el.card.last4}`,
                      icon: 'card-outline',
                      handler: () => {
                        this.payment_loading=true 
                        var clientSecret = this.client_secret
                        StripeCap.confirmPaymentIntent({
                          clientSecret,
                          saveMethod: true,
                          paymentMethodId: el.id,
                      }).then(async ()=>{
                        await this.closeModal()
                        Notiflix.Report.Init(
                          {success: 
                            {svgColor:'#0061d5',
                            titleColor:'#1e1e1e',
                            messageColor:'#242424',
                            buttonBackground:'#0061d5',
                            buttonColor:'#fff'
                            ,backOverlayColor:'rgba(#00479d,0.4)',},
                          })
                        Notiflix.Report.Success("Biglietto acquistato", 'Il biglietto è stato acquistato con successo', 'OK');
                         setTimeout(async () => {  var ok_btn = document.getElementById('NXReportButton')
                        ok_btn.addEventListener("click",async ()=>{   await this.nav.navigateRoot('tabs/tab2')
                         ;},false)}, 200); 
                      }).catch(()=>{
                        this.payment_loading=false
                        this.presentToast("C'è stato un problema durante il pagamento. La spesa non è stata addebitata.")})
                      }
                    }
            buttons.push(button)
        }
        buttons.push({
          text: 'Nuova carta',
          icon: 'add-outline',
          handler: async () => {
            this.payment_loading=false
            await this.goCard()
          }
        })
        buttons.push({
          text: 'Indietro',
          // icon: 'close',
          role: 'cancel',
        })
        const actionSheet = await this.actionSheetController.create({
          header: 'Seleziona metodo di pagamento',
          cssClass:'card-action-class',
          buttons: buttons
        });
        await actionSheet.present();
      }
      
      goCard(){
        var x:any = document.getElementsByClassName('ticket-modal')[0]
        x.style.transition="400ms"
        x.style.paddingTop ="calc(100vh - 440px)"
        this.pos_pay="-100vw"
        this.pos_card="0vw"
        setTimeout(()=>{
          this.listner_1= document.getElementById('card_number').addEventListener('input', function (e:any) {
            e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
            var key = e.keyCode || e.charCode;
            if( key!= 8 || key != 46 ){
              if(e.target.value.length==19){
                document.getElementById('expiry').focus()
              }
            }
           
          });
          this.listner_2 =document.getElementById('expiry').addEventListener('keyup', function (e:any) {
            var key = e.keyCode || e.charCode;
            if( key == 8 || key == 46 ){
            }else{
              if(e.target.value.length==5){
                document.getElementById('cvv').focus()
              }
              e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{2})/g, '$1/').trim();
              e.target.value = e.target.value.substring(0,5)
            }
          });
        },600)
      }
     
      async presentAlert() {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Attenzione',
          subHeader: 'Regolamento Trieste Trasporti',
          message: '<p>Secondo il regolamento di Trieste Trasporti, non è possibile acquistare un abbonamento senza possedere un tesserino identificativo.<br><br><b>Se ne sei in possesso, inserisci il numero a 6 cifre in alto a destra</b>. <br><br>Altrimenti puoi richiederlo presso i tabacchini o sul sito di Trieste Trasporti<p>',
          buttons: ['OK']
        });
    
        await alert.present();
      }
      async scanbarcode(){
        await this.barcodeScanner.scan({showTorchButton:true,disableAnimations:false}).then(barcodeData => {
          if(!barcodeData.cancelled && barcodeData.text.length==6){
            this.code =barcodeData.text
            for(let ind=0; ind< barcodeData.text.length; ind++){
                var doc:any =document.getElementById(ind.toString())
                doc.value=barcodeData.text[ind]
                
              }
              this.disabled_btn=false
          }else{
            if(!barcodeData.cancelled){
              this.presentToast(barcodeData.text+" non è un codice a barre valido! ")
              this.code=''
              for(let ind=0; ind<6;ind++){
                var doc:any =document.getElementById(ind.toString())
          
                this.code = this.code+doc.value.toString()
              }
              if(this.code.length==6){
                this.disabled_btn=false
              }else{
                this.disabled_btn=true
              }
            }else{
              this.code=''
              this.presentToast("Scansione annullata")
              for(let ind=0; ind<6;ind++){
                var doc:any =document.getElementById(ind.toString())
          
                this.code = this.code+doc.value.toString()
              }
              if(this.code.length==6){
                this.disabled_btn=false
              }else{
                this.disabled_btn=true
              }
            }
          
          }
         
         }).catch(err => {
          this.presentToast("Problema dutante la scansione. Inserisci il codice a mano o riprova")
             console.log('Error', err);
         });
      }
    
      async presentToast(text) {
        const toast = await this.toastController.create({
          message: text,
          cssClass:'toast-class',
          position: 'top',
          duration: 5000,
        });
        toast.present();
      }

  async buywithCard(){
    this.payment_loading=true
  var card_number:any = document.getElementById('card_number')
  card_number = card_number.value.replaceAll(' ','')
  var date:any = document.getElementById('expiry')
  date = date.value.split('/')
  var cvv:any = document.getElementById('cvv')
  cvv = cvv.value
  var clientSecret = this.client_secret
      var cc = await StripeCap.confirmPaymentIntent({
        clientSecret,
        card: {
            number: card_number,
            exp_month: Number(date[0]),
            exp_year: 2000+ Number(date[1]),
            cvc: cvv,
        },
        redirectUrl: 'https://prenota.cc/', // Required for Android
    }).then(async ()=>{
      await this.closeModal()
      Notiflix.Report.Init(
        {success: 
          {svgColor:'#0061d5',
          titleColor:'#1e1e1e',
          messageColor:'#242424',
          buttonBackground:'#0061d5',
          buttonColor:'#fff'
          ,backOverlayColor:'rgba(#00479d,0.4)',},
        })
      Notiflix.Report.Success("Biglietto acquistato", 'Il biglietto è stato acquistato con successo', 'OK');
       setTimeout(async () => {  var ok_btn = document.getElementById('NXReportButton')
      ok_btn.addEventListener("click",async ()=>{   await this.nav.navigateRoot('tabs/tab2')
       ;},false)}, 200); 
    }).catch(()=>{
      this.presentToast("C'è stato un problema durante il pagamento. La spesa non è stata addebitata.")})
    this.payment_loading=false 
  }
  async paySingleCorse(){
    this.ticket_type='hourly'
    this.buy(this.products_list[0])
    // await Browser.open({ url: "https://pay.sumup.io/b2c/QNA1F93X" })
  }
  async payDailyCorse(){
    this.ticket_type='daily'
    this.buy(this.products_list[1])
    
    // await Browser.open({ url: "https://pay.sumup.io/b2c/QCXCI205" })
  }
 
}
