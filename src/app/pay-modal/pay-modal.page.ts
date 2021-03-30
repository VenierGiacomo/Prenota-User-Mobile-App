import { Component, OnInit, Input } from '@angular/core';
import { ModalController, Platform, NavController, ToastController, AlertController, ActionSheetController, PopoverController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import '@capacitor-community/stripe'; 
import { StripePlugin, GooglePayPriceStatus, GooglePayAuthMethod } from '@capacitor-community/stripe';
const StripeCap = Plugins.Stripe as StripePlugin;
import Notiflix from "notiflix";
import { NativeApiService } from '../services/nativeapi.service';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
import { PopoverComponent } from '../popover/popover.component';
const { LocalNotifications } = Plugins;
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
  credit_pay=false
  @Input() total_service
  @Input() today
  @Input() timeslot
  @Input() homeref
  @Input() adons_list
  payment_methods
  height
  elmnt = 80
  payment_credit_loading
  height_interval
  constructor(private popoverController: PopoverController,private storage: StorageService ,public actionSheetController: ActionSheetController, private apiNative:NativeApiService,private api: ApiService,private nav: NavController,private plt: Platform, private modalController: ModalController,private toastController:ToastController,) {
    this.plt.ready().then(async  ()=>{
      if(this.plt.is('hybrid')){
        StripeCap.setPublishableKey({ key: 'pk_live_kb4i70qfPxeWXXYfjImvx64f00Et58vNmC' })
        // StripeCap.setPublishableKey({ key: 'pk_test_f3m2iNJqa6UdyuD9Ey8O7ZiH00eSjJ4lEt' })
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
      }

      if(this.adons_list.length>0){
        var slidingTagLiAfterStyle = document.createElement("style");
        slidingTagLiAfterStyle.id = 'style-adon'
slidingTagLiAfterStyle.innerHTML =
 `  .recap:after {
  display: block;
  background: #313131;
  content: '';
  height: 1px;
  width: 82%;
  margin: 20px auto ;
  padding: 0;
  }
  `
  document.head.appendChild(slidingTagLiAfterStyle);
      }else{
 var style_el = document.getElementById('style-adon')
 if(style_el){
  style_el.remove()
 }
      }
      setTimeout(async ()=>{
        this.height = window.innerHeight
        var elmnt = document.getElementById("cont");
        var padding_top = this.height - elmnt.offsetHeight - 275 - ( 52* this.adons_list.length )
        var x:any = document.getElementsByClassName('pay-customer-modal')[0]
        x.style.transition="400ms"     
        x.style.paddingTop =`${padding_top}px`
        await this.getCLientSecret()
        },200)
 this.height_interval =setInterval(()=>{
  this.height = window.innerHeight
  var elmnt = document.getElementById("cont");
  var padding_top = this.height - elmnt.offsetHeight - 275 - ( 52* this.adons_list.length )
  var x:any = document.getElementsByClassName('pay-customer-modal')[0]
  x.style.transition="400ms"     
  x.style.paddingTop =`${padding_top}px`
},300)
        
   })
   }

  ngOnInit() {
  
  
  }
  async getCLientSecret(){
    var x =document.getElementsByClassName("modal-shadow")
    if(x==undefined ||x==null|| x[x.length-1]!=undefined||x[x.length-1]!=null){
      this.event_listener =x[x.length-1].addEventListener('click',async()=>{
        await  this.backModal()      
       })
    }
    
    var y =document.getElementsByClassName("backdrop-no-tappable")
    if(y==undefined ||y==null||y[y.length-1]!=undefined||y[y.length-1]!=null){
    this.event_listener1 =y[y.length-1].addEventListener('click',async()=>{
     await  this.backModal()      
    })
  }
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
        if(this.homeref.must_be_payed){
          this.apiNative.booknotifications(this.homeref.appointments_id).then((res)=>{
            console.log(res)
          }).catch((err)=>{
            console.log(err)
          })
          this.homeref.sendEmailConfirmation()
        }
        this.book(true) 
      }).catch(()=>{
        // await this.book(false)
        if(this.homeref.must_be_payed){
          this.presentToast("Non siamo risuciti a terminare il pagamento. La spesa non è stata addebitata.")
        }else{
          this.presentToast("Non siamo risuciti a terminare il pagamento. La spesa non è stata addebitata. Puoi sempre pagare sul posto")
        }
      })
       
       
      this.payment_loading=false 
      
    }

    async closeModal(){
      var x =document.getElementsByClassName("modal-shadow")
      if(x==undefined ||x==null|| x[x.length-1]!=undefined || x[x.length-1]!=null){
      this.event_listener =x[x.length-1].removeEventListener('click',async()=>{
       await  this.backModal()      
      })
    }
    var y =document.getElementsByClassName("backdrop-no-tappable")
    if(y==undefined ||y==null||y[y.length-1]!=undefined&&y[y.length-1]!=null){
  
      this.event_listener1 =y[y.length-1].removeEventListener('click',async()=>{
       await  this.backModal()      
      })
    }
    var card = document.getElementById('card_number')
    if(card!=undefined&&card!=null){
      card.removeEventListener('input', function (e:any) {
        e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
        var key = e.keyCode || e.charCode;
        if( key!= 8 || key != 46 ){
          if(e.target.value.length==19){
            document.getElementById('expiry').focus()
          }
        }
       
      });
    }
      var expiry =document.getElementById('expiry')
      if(expiry!=undefined&&expiry!=null){
      document.getElementById('expiry')
      expiry.removeEventListener('keyup', function (e:any) {
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
    }
      clearInterval(this.height_interval)
      await this.modalController.dismiss('not_keep');
      
    }
    async closeModal1(){
      var x =document.getElementsByClassName("modal-shadow")
      if( x==undefined ||x==null||x[x.length-1]!=undefined||x[x.length-1]!=null){
      this.event_listener =x[x.length-1].removeEventListener('click',async()=>{
       await  this.backModal()      
      })
    }
      var y =document.getElementsByClassName("backdrop-no-tappable")
      if(y==undefined ||y==null||y[y.length-1]!=undefined||y[y.length-1]!=null){
      this.event_listener1 =y[y.length-1].removeEventListener('click',async()=>{
       await  this.backModal()      
      })
    }
      var card = document.getElementById('card_number')
      if(card!=undefined&&card!=null){
      card.removeEventListener('input', function (e:any) {
        e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
        var key = e.keyCode || e.charCode;
        if( key!= 8 || key != 46 ){
          if(e.target.value.length==19){
            document.getElementById('expiry').focus()
          }
        }
       
      });
    }
      var expiry =document.getElementById('expiry')
      if(expiry!=undefined&&expiry!=null){
      expiry.removeEventListener('keyup', function (e:any) {
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
    }
      clearInterval(this.height_interval)
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
      if(this.fast_pay){
         if(this.homeref.account_credits > Number(this.homeref.to_pay)*100){ this.credit_pay=true
          var padding_top = `calc(100vh  - ${this.elmnt}px - 445px)`
          x.style.paddingTop =`${padding_top}`
          this.applePay_top = "-290px"
        }else{
          this.credit_pay=false
          var padding_top =`calc(100vh  - ${this.elmnt}px - 445px)`
          x.style.paddingTop =`${padding_top}`
          this.applePay_top = "-220px"
        }
      }else{
         if(this.homeref.account_credits > Number(this.homeref.to_pay)*100){ this.credit_pay=true
          var padding_top =`calc(100vh  - ${this.elmnt}px - 445px)`
          x.style.paddingTop =`${padding_top}`
          this.applePay_top = "-120px"
        }else{
          this.credit_pay=false
          var padding_top =`calc(100vh  - ${this.elmnt}px - 375px)`
          x.style.paddingTop =`${padding_top}`
          this.applePay_top = "-170px"
        }
     
       
      }
    }

   async  goPay(){
    clearInterval(this.height_interval)
    this.book_load =true
    clearInterval(this.height_interval)
    var adons =[]
    adons = await this.adons_list.filter((val)=>{ return val.selected})
    adons = adons.map((val)=>{ return val.id_c})
    
      this.homeref.book(adons)

      setTimeout(async () => {
        clearInterval(this.height_interval)
        if(this.homeref.payable){

    
        if(this.plt.is('hybrid')){
          var token = await this.apiNative.isvalidToken()
          if(token){
            this.disabled_back=true      
            
            if(this.fast_pay){
               if(this.homeref.account_credits > Number(this.homeref.to_pay)*100){ this.credit_pay=true
                var padding_top = this.height - this.elmnt -295
                var x:any = document.getElementsByClassName('pay-customer-modal')[0]
                x.style.transition="400ms"     
                x.style.paddingTop =`${padding_top}px`
              }else{
                var padding_top = this.height - this.elmnt -245
                var x:any = document.getElementsByClassName('pay-customer-modal')[0]
                x.style.transition="400ms"     
                x.style.paddingTop =`${padding_top}px`
              }
             
            }else{
              
               if(this.homeref.account_credits > Number(this.homeref.to_pay)*100){ this.credit_pay=true
                var padding_top = this.height - this.elmnt -245
                var x:any = document.getElementsByClassName('pay-customer-modal')[0]
                x.style.transition="400ms"     
                x.style.paddingTop =`${padding_top}px`
              }else{
                this.credit_pay=false
                var padding_top = this.height - this.elmnt -175
                var x:any = document.getElementsByClassName('pay-customer-modal')[0]
                x.style.transition="400ms"     
                x.style.paddingTop =`${padding_top}px`
              }
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
            },900)
          } }else{
            var token = await this.api.isvalidToken()
            if(token){
              this.disabled_back=true      
             
              if(this.fast_pay){
                 if(this.homeref.account_credits > Number(this.homeref.to_pay)*100){ this.credit_pay=true
                  var padding_top = this.height - this.elmnt -295
                  var x:any = document.getElementsByClassName('pay-customer-modal')[0]
                  x.style.transition="400ms"     
                  x.style.paddingTop =`${padding_top}px`
                }else{
                  this.credit_pay=false
                  this.pos_book='-100vw'
                  this.pos_pay='0vw'
                }
               
              }else{
                
                 if(this.homeref.account_credits > Number(this.homeref.to_pay)*100){ this.credit_pay=true
                
                  this.pos_book='-100vw'
                  this.pos_pay='0vw'
                }else{
                  this.credit_pay=false
                  var padding_top = this.height - this.elmnt -175
                  var x:any = document.getElementsByClassName('pay-customer-modal')[0]
                  x.style.transition="400ms"     
                  x.style.paddingTop =`${padding_top}px`
                }
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
              },900)
            }
          }
      
         var interval = setInterval(async ()=>{
           if(this.plt.is('hybrid')){
            var token = await this.apiNative.isvalidToken()
            if(token){
              this.disabled_back=true          
                if(this.fast_pay){
                   if(this.homeref.account_credits > Number(this.homeref.to_pay)*100){ this.credit_pay=true
                    var padding_top = this.height - this.elmnt -295
                    var x:any = document.getElementsByClassName('pay-customer-modal')[0]
                    x.style.transition="400ms"     
                    x.style.paddingTop =`${padding_top}px`
                  }else{
                    this.credit_pay=false
                    this.pos_book='-100vw'
                    this.pos_pay='0vw'
                  }
                 
                }else{
                  
                   if(this.homeref.account_credits > Number(this.homeref.to_pay)*100){ this.credit_pay=true
                  
                    this.pos_book='-100vw'
                    this.pos_pay='0vw'
                  }else{
                    this.credit_pay=false
                    var padding_top = this.height - this.elmnt -175
                    var x:any = document.getElementsByClassName('pay-customer-modal')[0]
                    x.style.transition="400ms"     
                    x.style.paddingTop =`${padding_top}px`
                  }
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
              },900)
            }
           }else{
            var token = await this.api.isvalidToken()
            if(token){
              this.disabled_back=true      
              if(this.fast_pay){
                 if(this.homeref.account_credits > Number(this.homeref.to_pay)*100){ this.credit_pay=true
                  var padding_top = this.height - this.elmnt -295
                  var x:any = document.getElementsByClassName('pay-customer-modal')[0]
                  x.style.transition="400ms"     
                  x.style.paddingTop =`${padding_top}px`
                }else{
                  this.credit_pay=false
                  this.pos_book='-100vw'
                  this.pos_pay='0vw'
                }
               
              }else{
                
                 if(this.homeref.account_credits > Number(this.homeref.to_pay)*100){ this.credit_pay=true
                
                  this.pos_book='-100vw'
                  this.pos_pay='0vw'
                }else{
                  this.credit_pay=false
                  var padding_top = this.height - this.elmnt -175
                  var x:any = document.getElementsByClassName('pay-customer-modal')[0]
                  x.style.transition="400ms"     
                  x.style.paddingTop =`${padding_top}px`
                }
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
              },900)
            }
          }
        },800)
      }
      }, 1500);
      
        
   
      
    }
    async backModal(back_btn?){
      if(this.homeref.must_be_payed){
        if(back_btn){
          if (this.plt.is('hybrid')) {
            await this.closeModal()
            for(let appo of this.homeref.appointments_id){      
              
                await LocalNotifications.getPending().then( res => {
                var id_1 =appo
                var id_2 =appo+1000
  
                var indexes = res.notifications.filter((val,ind,arr)=>{ return val.id == id_1.toString() ||val.id == id_2.toString() })
  
                LocalNotifications.cancel({notifications: indexes});
                })      
            }
          }else{
            await this.closeModal()
          }
        }
        
      }
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
            if(this.homeref.must_be_payed){
              this.homeref.sendEmailConfirmation()
              this.apiNative.booknotifications(this.homeref.appointments_id).then((res)=>{
                console.log(res)
              }).catch((err)=>{
                console.log(err)
              })
            }
            await this.book('googlepay') 
          }).catch(async ()=>{
            // await this.book(false) 
            if(this.homeref.must_be_payed){
          this.presentToast("Non siamo risuciti a terminare il pagamento. La spesa non è stata addebitata.")
        }else{
          this.presentToast("Non siamo risuciti a terminare il pagamento. La spesa non è stata addebitata. Puoi sempre pagare sul posto")
        }})
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
        }).then(async ()=>{
          if(this.homeref.must_be_payed){
            if(this.plt.is('hybrid')){
              this.apiNative.booknotifications(this.homeref.appointments_id).then((res)=>{
                console.log(res)
              }).catch((err)=>{
                console.log(err)
              })
            }else{
              this.api.booknotifications(this.homeref.appointments_id).subscribe(res=>{
                console.log(res)
              },err=>{
                console.log(err)
              })
            }
            this.homeref.sendEmailConfirmation()
          }
          await this.book(true) 
          this.payment_loading=false 
        }).catch(async (err)=>{
          console.log(err)
          this.payment_loading=false 
          // await this.book(false) 
          if(this.homeref.must_be_payed){
          this.presentToast("Non siamo risuciti a terminare il pagamento. La spesa non è stata addebitata.")
        }else{
          this.presentToast("Non siamo risuciti a terminare il pagamento. La spesa non è stata addebitata. Puoi sempre pagare sul posto")
        }})
        
     
    }

    async cardsActionSheet() {
      var buttons=[]
    
      for (let el of this.payment_methods.data){
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
                    }).then(async ()=>{
                      if(this.homeref.must_be_payed){
                        this.homeref.sendEmailConfirmation()
                        if(this.plt.is('hybrid')){
                          this.apiNative.booknotifications(this.homeref.appointments_id).then((res)=>{
                            console.log(res)
                          }).catch((err)=>{
                            console.log(err)
                          })
                        }else{
                          this.api.booknotifications(this.homeref.appointments_id).subscribe(res=>{
                            console.log(res)
                          },err=>{
                            console.log(err)
                          })
                        }
                      }
                      await this.book(true) 
                      this.payment_loading=false 
                    }).catch(async (err)=>{
                      console.log(err)
                      this.payment_loading=false 
                      // await this.book(false) 
                      if(this.homeref.must_be_payed){
          this.presentToast("Non siamo risuciti a terminare il pagamento. La spesa non è stata addebitata.")
        }else{
          this.presentToast("Non siamo risuciti a terminare il pagamento. La spesa non è stata addebitata. Puoi sempre pagare sul posto")
        }})
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
    
  payWithCredits(){
    this.payment_credit_loading=true
    if(this.plt.is('hybrid')){
      this.apiNative.payBusinesswithCredits(this.homeref.appointments_id).then(async (res:any)=>{
        if(res.payed){
          if(this.homeref.must_be_payed){
            this.apiNative.booknotifications(this.homeref.appointments_id).then((res)=>{
              console.log(res)
            }).catch((err)=>{
              console.log(err)
            })
            this.homeref.sendEmailConfirmation()
          }
          await this.book(true) 
        }else{
          if(this.homeref.must_be_payed){
          this.presentToast("Non siamo risuciti a terminare il pagamento. La spesa non è stata addebitata.")
        }else{
          this.presentToast("Non siamo risuciti a terminare il pagamento. La spesa non è stata addebitata. Puoi sempre pagare sul posto")
        }
        }
        
        this.payment_credit_loading=false
      }).catch(err=>{
        if(this.homeref.must_be_payed){
          this.presentToast("Non siamo risuciti a terminare il pagamento. La spesa non è stata addebitata.")
        }else{
          this.presentToast("Non siamo risuciti a terminare il pagamento. La spesa non è stata addebitata. Puoi sempre pagare sul posto")
        }
        this.payment_credit_loading=false
      })
    }else{
      this.api.payBusinesswithCredits(this.homeref.appointments_id).subscribe(async (res:any)=>{
        if(res.payed){
          if(this.homeref.must_be_payed){
            this.api.booknotifications(this.homeref.appointments_id).subscribe(res=>{
              console.log(res)
            },err=>{
              console.log(err)
            })
            this.homeref.sendEmailConfirmation()
          }
          await this.book(true) 
        }else{
          
          if(this.homeref.must_be_payed){
          this.presentToast("Non siamo risuciti a terminare il pagamento. La spesa non è stata addebitata.")
        }else{
          this.presentToast("Non siamo risuciti a terminare il pagamento. La spesa non è stata addebitata. Puoi sempre pagare sul posto")
        }
        }
        
        this.payment_credit_loading=false
      },err=>{
        if(this.homeref.must_be_payed){
          this.presentToast("Non siamo risuciti a terminare il pagamento. La spesa non è stata addebitata.")
        }else{
          this.presentToast("Non siamo risuciti a terminare il pagamento. La spesa non è stata addebitata. Puoi sempre pagare sul posto")
        }
        this.payment_credit_loading=false
      })
    }
  
    
  }
  async popoverInfo(ev, adon){
  
      const popover = await this.popoverController.create({
        component: PopoverComponent,
        cssClass: 'popover_custom',
        event: ev,
        componentProps:{
          desc: adon.description
        }
      });
      return await popover.present();
    
  }
}
