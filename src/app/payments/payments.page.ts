import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
// import { Stripe } from '@ionic-native/stripe/ngx';
declare var Stripe ;

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {
stripe_key ='pk_test_f3m2iNJqa6UdyuD9Ey8O7ZiH00eSjJ4lEt'
cardNumber: string;
cardMonth: number;
cardYear: number;
cardCVV: string;
cardErr: boolean =false
  // constructor(public stripe: Stripe) { }
  constructor(private nav: NavController) { }

  ngOnInit() {
//     var self = this
//     var expy = document.getElementById('expiry');
//     var x =document.querySelector<HTMLInputElement>('input[name="scadenza"]')
//     expy.addEventListener('keyup', function(event) {
//         if(parseInt(x.value[0])>1){
//             x.value=''
//         }
//         if(x.value.length==2){
//             x.value =x.value+"/"
//           }
//         self.cardMonth = parseInt(x.value.substring(0,2))
//         self.cardYear = 2000+parseInt(x.value.substring(3,5))


// });

// expy.addEventListener('keydown', function(event) {
//   var key = event.keyCode || event.charCode;
      
//   if(x.value.length==3 && (key == 8 || key == 46)){
//     x.value=x.value.slice(0, -1);
//   }
// })

// var card_n = document.getElementById('card_number');
//     var y =document.querySelector<HTMLInputElement>('input[name="card-number"]')
//     card_n.addEventListener('keyup', function(event) {
//     var length= y.value.length
//         if(length==4 || length==9 || length==14 ){
//             y.value =y.value+" "
//           }
// });
// card_n.addEventListener('keydown', function(event) {
//   var key = event.keyCode || event.charCode;
//   var length= y.value.length
//   if((length==5 || length==10 || length==15 )&& (key == 8 || key == 46)){
//     y.value=y.value.slice(0, -1);
//   }

//   self.cardNumber = y.value.replace(/\s/g,'')

// })


    // this.striperedirect = await loadStripe('pk_test_f3m2iNJqa6UdyuD9Ey8O7ZiH00eSjJ4lEt');
    const stripe = Stripe('pk_test_f3m2iNJqa6UdyuD9Ey8O7ZiH00eSjJ4lEt',{locale: 'it'});
    const elements = stripe.elements();
    const paymentRequest = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Demo total',
        amount: 1099,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });
    var prButton = elements.create('paymentRequestButton', {
      paymentRequest: paymentRequest,
    });
    // Check the availability of the Payment Request API first.
    paymentRequest.canMakePayment().then(function(result) {
      if (result) {
        prButton.mount('#payment-request-button');
      } else {
        document.getElementById('payment-request-button').style.display = 'none';
      }
    });
    // Custom styling can be passed to options when creating an Element.
    const style = {
      base: {
        color: '#0f0f0f',
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
form1.addEventListener('submit', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(async function(result) {
    if (result.error) {
      // Inform the user if there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
       console.log(result.token)
      stripeTokenHandler(result.token);
      // const charge = await stripe.charges.create({
      //   amount: 999,
      //   currency: 'eur',
      //   description: 'Example charge',
      //   source: result.token,
      // });
      // console.log(charge)
    }
  });
});
var self= this
function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  // var form = <HTMLFormElement>document.getElementById('payment-form-card');
  // var hiddenInput = document.createElement('input');
  // hiddenInput.setAttribute('type', 'hidden');
  // hiddenInput.setAttribute('name', 'stripeToken');
  // hiddenInput.setAttribute('value', token.id);
  // form.appendChild(hiddenInput);
  // Submit the form
  console.log(token)
  self.nav.navigateRoot('/payment-success')
  // form.submit();
}
  }
  async validateCard(){
    this.cardErr= false
    // this.stripe.setPublishableKey(this.stripe_key);
    let card = {
      number: this.cardNumber,
      expMonth: this.cardMonth,
      expYear: this.cardYear,
      cvc: this.cardCVV
     };

     // Run card validation here and then attempt to tokenise
     console.log(card)
    //  await this.stripe.validateCardNumber(card.number).catch(err=>{
    //   console.log("invalid card number",err)
    //   this.cardErr= true
    //  })
    //  await this.stripe.validateExpiryDate(card.expMonth.toString() ,card.expYear.toString()).catch(err=>{
    //   console.log("invalid expirry date",err)
    //   this.cardErr= true
    // })
    // await this.stripe.validateCVC(card.cvc).catch(err=>{
    //   console.log("invalid cvc", err)
    //   this.cardErr= true
    // })
    // if( !this.cardErr){
    //   await this.stripe.createCardToken(card)
    //   .then(token => console.log(token))
    //   .catch(error => console.error(error));
    //   } 
    }
   
    async navHome(){
      await this.nav.navigateBack('/tabs')
    }
}
