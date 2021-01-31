import { Component, OnInit, Input } from '@angular/core';
import { ModalController, Platform, NavController, ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import '@capacitor-community/stripe'; 
import { StripePlugin, GooglePayPriceStatus, GooglePayAuthMethod } from '@capacitor-community/stripe';
const StripeCap = Plugins.Stripe as StripePlugin;
import Notiflix from "notiflix";
import { NativeApiService } from '../services/nativeapi.service';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-pay-modal',
  templateUrl: './pay-modal.page.html',
  styleUrls: ['./pay-modal.page.scss'],
})
export class PayModalPage implements OnInit {

  event_listener
  event_listener1
  client_secret
  opacity_scroll=1
  payment_loading=false
  applePay_top = '0px'
  pos_pay='100vw'
  pos_book='0vw'
  listner_1
  listner_2
  applePay_available=false
  googlePay_available=false
  disabled_back=false
  fast_pay=false
  book_load=false
  @Input() total_service
  @Input() today
  @Input() timeslot
  @Input() homeref
payment_methods
  constructor(private storage: StorageService ,public actionSheetController: ActionSheetController, private apiNative:NativeApiService,private api: ApiService,private nav: NavController,private plt: Platform, private modalController: ModalController,private toastController:ToastController,) {
    this.plt.ready().then(async  ()=>{
      if(this.plt.is('hybrid')){
        StripeCap.setPublishableKey({ key: 'pk_live_kb4i70qfPxeWXXYfjImvx64f00Et58vNmC' })
        StripeCap.isApplePayAvailable().then(res=>{
         if(res.available){
           this.applePay_available=true
           this.fast_pay=true
         }  
       })
        StripeCap.isGooglePayAvailable().then(res=>{
         if(res.available){
           this.googlePay_available=true
           this.fast_pay=true
         }
      })
      }else{  
      var height = window.innerHeight
      var x:any = document.getElementsByClassName('pay-customer-modal')[0]
      x.style.transition="400ms"        
        x.style.paddingTop =`calc(${height}px - 320px)`
      

      }
     
    await this.getCLientSecret()
   })
   }

  ngOnInit() {
  }
  async getCLientSecret(){
    var x =document.getElementsByClassName("modal-shadow")
    this.event_listener =x[x.length-1].addEventListener('click',async()=>{
     await  this.backModal()      
    })
    var y =document.getElementsByClassName("backdrop-no-tappable")
    this.event_listener1 =y[y.length-1].addEventListener('click',async()=>{
     await  this.backModal()      
    })
  }
  async  applePayment() {
    var clientSecret = this.homeref.secret
      StripeCap.confirmPaymentIntent({
          clientSecret,
          saveMethod: true,
          applePayOptions:{
            merchantId: 'merchant.stripe.prenota.cc',
            country: 'IT',
            currency: 'EUR',
            items: [{ label: this.total_service.name,
              amount: Number(this.homeref.to_pay)}],
          },
      }).then(()=>{
        this.book(true) 
      }).catch(()=>{
        // await this.book(false) 
        this.presentToast("C'è stato un problema durante il pagamento. La spesa non è stata addebitata. Puoi sempre pagare sul posto")})
       
      this.payment_loading=false 
      
    }

    async closeModal(){
      var x =document.getElementsByClassName("modal-shadow")
      this.event_listener =x[x.length-1].removeEventListener('click',async()=>{
       await  this.backModal()      
      })
      var y =document.getElementsByClassName("backdrop-no-tappable")
      this.event_listener1 =y[y.length-1].removeEventListener('click',async()=>{
       await  this.backModal()      
      })
      document.getElementById('card_number').removeEventListener('input', function (e:any) {
        e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
        var key = e.keyCode || e.charCode;
        if( key!= 8 || key != 46 ){
          if(e.target.value.length==19){
            document.getElementById('expiry').focus()
          }
        }
       
      });
      document.getElementById('expiry').removeEventListener('keyup', function (e:any) {
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
      await this.modalController.dismiss('not_keep');
      
    }
    async closeModal1(){
      var x =document.getElementsByClassName("modal-shadow")
      this.event_listener =x[x.length-1].removeEventListener('click',async()=>{
       await  this.backModal()      
      })
      var y =document.getElementsByClassName("backdrop-no-tappable")
      this.event_listener1 =y[y.length-1].removeEventListener('click',async()=>{
       await  this.backModal()      
      })
      document.getElementById('card_number').removeEventListener('input', function (e:any) {
        e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
        var key = e.keyCode || e.charCode;
        if( key!= 8 || key != 46 ){
          if(e.target.value.length==19){
            document.getElementById('expiry').focus()
          }
        }
       
      });
      document.getElementById('expiry').removeEventListener('keyup', function (e:any) {
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
      await this.modalController.dismiss();
      
    }
    async presentToast(text) {
      const toast = await this.toastController.create({
        message: text,
        position: 'top',
        duration: 5000,
        cssClass:'toast-class',
      });
      toast.present();
    }

    async CardorNopay(){
      this.payment_methods = await this.storage.getPaymentMethods()
      if(this.payment_methods == undefined || this.payment_methods.data == undefined || this.payment_methods.data[0] == undefined || this.payment_methods.data[0].card ==undefined || this.payment_methods.data[0].card.brand.length<2){
       
        await this.goCardPayment()
      }else{
        await this.cardsActionSheet()
      }
      
  
    }
    goCardPayment(){
      this.opacity_scroll=0
      var x:any = document.getElementsByClassName('pay-customer-modal')[0]
      x.style.transition="400ms"
      if(!this.fast_pay){
        this.applePay_top = "-159px"
        x.style.paddingTop ="calc(100vh - 430px)"
      }else{
        this.applePay_top = "-209px"
        x.style.paddingTop ="calc(100vh - 530px)"
      }
    }

   async  goPay(){
    this.book_load =true
      this.homeref.book()
      setTimeout(async () => {
        if(this.homeref.payable){

    
        if(this.plt.is('hybrid')){
          var token = await this.apiNative.isvalidToken()
          if(token){
            this.disabled_back=true      
            
            if(!this.fast_pay){
              var x:any = document.getElementsByClassName('pay-customer-modal')[0]
              x.style.transition="400ms"
              x.style.paddingTop ="calc(100vh - 240px)"
            }else{
              this.pos_book='-100vw'
              this.pos_pay='0vw'
            }
            setTimeout(()=>{
              this.pos_book='-100vw'
              this.pos_pay='0vw'
              this.book_load =false
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
          } }else{
            var token = await this.api.isvalidToken()
            if(token){
              this.disabled_back=true      
             
              if(!this.fast_pay){
                var x:any = document.getElementsByClassName('pay-customer-modal')[0]
                x.style.transition="400ms"
                x.style.paddingTop ="calc(100vh - 240px)"
              }else{
                this.pos_book='-100vw'
                this.pos_pay='0vw'
              }
              setTimeout(()=>{
                this.pos_book='-100vw'
                this.pos_pay='0vw'
                this.book_load =false
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
          }
      
         var interval = setInterval(async ()=>{
           if(this.plt.is('hybrid')){
            var token = await this.apiNative.isvalidToken()
            if(token){
              this.disabled_back=true      
              if(!this.fast_pay){
                var x:any = document.getElementsByClassName('pay-customer-modal')[0]
                x.style.transition="400ms"
                x.style.paddingTop ="calc(100vh - 240px)"
              }else{
                this.pos_book='-100vw'
                this.pos_pay='0vw'
              }
              setTimeout(()=>{
                this.pos_book='-100vw'
                this.pos_pay='0vw'
                this.book_load =false
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
                clearInterval(interval)
              },600)
            }
           }else{
            var token = await this.api.isvalidToken()
            if(token){
              this.disabled_back=true      
              if(!this.fast_pay){
                var x:any = document.getElementsByClassName('pay-customer-modal')[0]
                x.style.transition="400ms"
                x.style.paddingTop ="calc(100vh - 240px)"
              }else{
                this.pos_book='-100vw'
                this.pos_pay='0vw'
              }
              setTimeout(()=>{
                this.pos_book='-100vw'
                this.pos_pay='0vw'
                this.book_load =false
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
                clearInterval(interval)
              },600)
            }
          }
        },500)
      }
      }, 1500);
      
        
   
      
    }
    async backModal(){
      if(!this.disabled_back){
        this.homeref.confirm='none'
        await this.closeModal()
      } 
    }
    async book(bool){
      await this.closeModal1( );
      Notiflix.Report.Init(
        {success: 
          {svgColor:'#0061d5',
          titleColor:'#1e1e1e',
          messageColor:'#242424',
          buttonBackground:'#0061d5',
          buttonColor:'#fff'
          ,backOverlayColor:'rgba(#00479d,0.2)',},
        })
        if(bool=='googlepay'){
          Notiflix.Report.Success("L'appuntamento è stato prenotato", 'Pagamento effetuato con Google Pay \n\nControlla la tua email per ulteriori informazioni. (Può capitare finisca nella sezione spam)', 'OK');
        }else{
          Notiflix.Report.Success("L'appuntamento è stato prenotato", 'Controlla la tua email per ulteriori informazioni. (Può capitare finisca nella sezione spam)', 'OK');
        }
       
        var ok_btn = document.getElementById('NXReportButton')
         ok_btn.addEventListener("click",async ()=>{
           await this.homeref.closeModal();  await this.nav.navigateRoot('/tabs/tab2'); await this.homeref.presentNotModal()
        },false) 
     
    }
    async useStripeGoogle(){

        var clientSecret = this.homeref.secret
           StripeCap.confirmPaymentIntent({
              clientSecret,
              saveMethod: true,
              googlePayOptions: { 
                merchantName: 'Prenota',
                currencyCode: 'EUR',
                totalPrice: this.homeref.to_pay,
                totalPriceStatus: GooglePayPriceStatus['FINAL'],
                allowedAuthMethods: [GooglePayAuthMethod['PAN_ONLY'], GooglePayAuthMethod['CRYPTOGRAM_3DS']],
                allowedCardNetworks: ['VISA', 'MASTERCARD','AMEX']
            },
          }).then(async ()=>{
            await this.book('googlepay') 
          }).catch(async ()=>{
            // await this.book(false) 
            this.presentToast("C'è stato un problema durante il pagamento. La spesa non è stata addebitata. Puoi sempre pagare sul posto")})
  }
    async buywithCard(){
      this.payment_loading=true
      var card_number:any = document.getElementById('card_number')
      card_number = card_number.value.replaceAll(' ','')
      var date:any = document.getElementById('expiry')
      date = date.value.split('/')
      var cvv:any = document.getElementById('cvv')
      cvv = cvv.value
      var clientSecret = this.homeref.secret
      StripeCap.confirmPaymentIntent({
            clientSecret,
            saveMethod: true,
            card: {
                number: card_number,
                exp_month: Number(date[0]),
                exp_year: 2000+ Number(date[1]),
                cvc: cvv,
            },
            redirectUrl: 'https://prenota.cc/', // Required for Android
        }).then(async ()=>{
          await this.book(true) 
          this.payment_loading=false 
        }).catch(async (err)=>{
          console.log(err)
          this.payment_loading=false 
          // await this.book(false) 
          this.presentToast("C'è stato un problema durante il pagamento. La spesa non è stata addebitata. Puoi sempre pagare sul posto")})
        
     
    }

    async cardsActionSheet() {
      var buttons=[]
    
      for (let el of this.payment_methods.data){
        console.log(el)
       var button= {
                    text: `${el.card.brand.toUpperCase()} ···· ···· ···· ${el.card.last4}`,
                    icon: 'card-outline',
                    handler: () => {
                      this.payment_loading=true 
                      var clientSecret = this.homeref.secret
                      StripeCap.confirmPaymentIntent({
                        clientSecret,
                        saveMethod: true,
                        paymentMethodId: el.id,
                        redirectUrl: 'https://prenota.cc/', // Required for Android
                    }).then(async ()=>{
                      await this.book(true) 
                      this.payment_loading=false 
                    }).catch(async (err)=>{
                      console.log(err)
                      this.payment_loading=false 
                      // await this.book(false) 
                      this.presentToast("C'è stato un problema durante il pagamento. La spesa non è stata addebitata. Puoi sempre pagare sul posto")})
                    }
                  }
          buttons.push(button)
      }
      buttons.push({
        text: 'Nuova carta',
        icon: 'add-outline',
        handler: async () => {
          await this.goCardPayment()
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
    
}
