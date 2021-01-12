import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, NavController } from '@ionic/angular';
import Notiflix from "notiflix";
import { NativeApiService } from '../services/nativeapi.service';
import { ApiService } from '../services/api.service';
// import { ApplePay } from '@ionic-native/apple-pay/ngx';
import { PayPal, PayPalPayment, PayPalConfiguration, PayPalPaymentDetails } from '@ionic-native/paypal/ngx';
import { Braintree, ApplePayOptions, PaymentUIOptions, PaymentUIResult } from '@ionic-native/braintree/ngx';
declare var Stripe ;
// declare var ApplePay;

@Component({
  selector: 'app-bus-ticket',
  templateUrl: './bus-ticket.page.html',
  styleUrls: ['./bus-ticket.page.scss'],
})
export class BusTicketPage implements OnInit {
  confirm='none'
  loading='none'
  sure_confirm='block'
  card='none'
  paymentAmount: string = '1.35';
  currency: string = 'EUR';
  currencyIcon: string = '€';
  constructor(private braintree: Braintree,private payPal: PayPal,private nav: NavController, private modalController: ModalController, private plt:Platform,private apiNative:NativeApiService,private api: ApiService,) {
    // Render the PayPal button into #paypal-button-container
    // 
    
   }

  ngOnInit() {
  }
  rederPay(){
    var self = this
    setTimeout(() => {
      <any>window['paypal'].Buttons({
        style: {
          layout: 'horizontal'
      },
        // Set up the transaction
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: '1.35'
              }
            }]
          });
        },

        // Finalize the transaction
        onApprove: function (data, actions) {
          return actions.order.capture()
            .then(function (details) {
              // Show a success message to the buyer
               self.closeModal()
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
            })
            .catch(err => {
              console.log(err);
            })
        }
  }).render('#paypal-button-container');
}, 500);
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
            }, 1800);
   
  }
  async buy(){
    this.rederPay()
    if (this.plt.is('hybrid')) {
      var token: any = await this.apiNative.isvalidToken()
      if(token){
        this.confirm='block'
      }else{
          this.card='block'
          this.sure_confirm='none'
          // this.loading='block'
          const stripe = Stripe('pk_test_f3m2iNJqa6UdyuD9Ey8O7ZiH00eSjJ4lEt',{locale: 'it'});
          const elements = stripe.elements();
          const style = {
            base: {
              color: '#343a40',
              fontSize: '16px',
              lineHeight: '50px',
              '::placeholder': {
                color: '#333'
              },
              ':-webkit-autofill': {
                color: '#32325d',
              },
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a',
              ':-webkit-autofill': {
                color: '#fa755a',
              },
            },
          };
      
          var card = elements.create('card', {style: style});
      
      // Add an instance of the card Element into the `card-element` <div>.
      card.mount('#card-element');
      
      // Handle real-time validation errors from the card Element.
      card.on('change', function(event) {
        var displayError = document.getElementById('card-errors');
        if (event.error) {
          displayError.textContent = event.error.message;
        } else {
          displayError.textContent = '';
        }
      });
      
      // Handle form submission.
      var form1 = document.getElementById('payment-form-card');

      var self= this
      form1.addEventListener('submit', function(event) {
        self.loading='block'
        self.card='none'
        event.preventDefault();
  
      self.apiNative.stripeBusTicket('daily',false).then(async data=>{
        const res:any = await data
        console.log(data)
        confirmpayment(res.client_secret,card)
      }).catch(err=>{
        console.log(err)
      })
      })
      function confirmpayment(clientSecret,card){
        stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
          },
          setup_future_usage: 'off_session'
        }).then(async function(result) {
          if (result.error) {
            self.loading='none'
            // Show error to your customer
            console.log(result.error.message);
          } else {
            if (result.paymentIntent.status === 'succeeded') {
              await self.closeModal()
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
              // Show a success message to your customer
              // There's a risk of the customer closing the window before callback execution
              // Set up a webhook or plugin to listen for the payment_intent.succeeded event
              // to save the card to a Customer
        
              // The PaymentMethod ID can be found on result.paymentIntent.payment_method
            }
          }
        });
        }
      }
      }else{
        if(this.api.isvalidToken()){
          this.confirm='block'
        }else{
          this.card='block'
          this.sure_confirm='none'
          // this.loading='block'
          const stripe = Stripe('pk_test_f3m2iNJqa6UdyuD9Ey8O7ZiH00eSjJ4lEt',{locale: 'it'});
          const elements = stripe.elements();
          const style = {
            base: {
              color: '#343a40',
              fontSize: '16px',
              lineHeight: '50px',
              '::placeholder': {
                color: '#333'
              },
              ':-webkit-autofill': {
                color: '#32325d',
              },
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a',
              ':-webkit-autofill': {
                color: '#fa755a',
              },
            },
          };
      
          var card = elements.create('card', {style: style});
      
      // Add an instance of the card Element into the `card-element` <div>.
      card.mount('#card-element');
      
      // Handle real-time validation errors from the card Element.
      card.on('change', function(event) {
        var displayError = document.getElementById('card-errors');
        if (event.error) {
          displayError.textContent = event.error.message;
        } else {
          displayError.textContent = '';
        }
      });
      
      // Handle form submission.
      var form1 = document.getElementById('payment-form-card');

      var self= this
      form1.addEventListener('submit', function(event) {
        self.loading='block'
        self.card='none'
        event.preventDefault();
  
      self.api.stripeBusTicket('daily',false).subscribe(async data=>{
        const res:any = await data
        confirmpayment(res.client_secret,card)
        self
      },err=>{
        console.log(err)
      })
      })
      function confirmpayment(clientSecret,card){
        stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
          },
          setup_future_usage: 'off_session'
        }).then(async function(result) {
          if (result.error) {
            self.loading='none'
            // Show error to your customer
            console.log(result.error.message);
          } else {
            if (result.paymentIntent.status === 'succeeded') {
              await self.closeModal()
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
              // Show a success message to your customer
              // There's a risk of the customer closing the window before callback execution
              // Set up a webhook or plugin to listen for the payment_intent.succeeded event
              // to save the card to a Customer
        
              // The PaymentMethod ID can be found on result.paymentIntent.payment_method
            }
          }
        });
        }
     

      }

}
  
    
  }
   applePayment() {
    // This block is optional -- only if you need to update order items/shipping
    // methods in response to shipping method selections
  
    //  ApplePay.canMakePayments().then( (message) => {
    //    this.payWithApplePay()
    // }).catch((error) => {
     
    // });
  
  }
    payWithApplePay() {
    try {
      // let order: any = {
      //   items: [{
      //     label: 'Biglietto del bus 60 minuti',
      //     amount: 1.35
      //   }],
      //   shippingMethods: [{    
      //     label: "Consenga istantanea",
      //     detail: "Consenga istantanea",
      //     amount: "0.00",
      //     identifier: "FreeShip"
      // }],
      // currencyCode: 'EUR',
      //   countryCode: 'IT',
      //   billingAddressRequirement: 'none',
      //   shippingAddressRequirement: 'none',
      //   shippingType: 'shipping',  
        
      // }
      // ApplePay.setMerchantId('merchant.stripe.prenota.cc').then(()=>{
      //   ApplePay.setPublishableKey('pk_test_f3m2iNJqa6UdyuD9Ey8O7ZiH00eSjJ4lEt').then(()=>{
      //     ApplePay.setPublishableKey('pk_test_f3m2iNJqa6UdyuD9Ey8O7ZiH00eSjJ4lEt')
      //     ApplePay.makePaymentRequest(order).then( (message) => {
      //      console.log(message,'cazzoooooooooooo')
      //       ApplePay.completeLastTransaction('success').then( ()=>{
      //        setTimeout( () => {
      //           this.closeModal()
      //        Notiflix.Report.Init(
      //          {success: 
      //            {svgColor:'#0061d5',
      //            titleColor:'#1e1e1e',
      //            messageColor:'#242424',
      //            buttonBackground:'#0061d5',
      //            buttonColor:'#fff'
      //            ,backOverlayColor:'rgba(#00479d,0.4)',},
      //          })
      //  Notiflix.Report.Success("Biglietto acquistato", 'Il biglietto è stato acquistato con successo', 'OK');
      //        }, 1100); 
      //      });
      //    }).catch((error) => {
      //      console.log(error)
      //      // ApplePay.completeLastTransaction('failure');
      //    });
      //   })
      // })
      

      // In real payment, this step should be replaced by an actual payment call to payment provider
      // Here is an example implementation:

      // MyPaymentProvider.authorizeApplePayToken(token.paymentData)
      //    .then((captureStatus) => {
      //        // Displays the 'done' green tick and closes the sheet.
      //        ApplePay.completeLastTransaction('success');
      //    })
      //    .catch((err) => {
      //        // Displays the 'failed' red cross.
      //        ApplePay.completeLastTransaction('failure');
      //    });

    } catch {
      console.log('errrrkjgjfg cathch 2')
      // handle payment request error
      // Can also handle stop complete transaction but these should normally not occur
    }
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
  pay(){
    this.nav.navigateRoot('payments')
  }
  async closeModal(){
    await this.modalController.dismiss();
  }
}
