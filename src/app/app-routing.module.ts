import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'book-modal',
    loadChildren: () => import('./book-modal/book-modal.module').then( m => m.BookModalPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./onboarding/onboarding.module').then( m => m.OnboardingPageModule)
  },
  {
    path: 'payment-success',
    loadChildren: () => import('./payment-success/payment-success.module').then( m => m.PaymentSuccessPageModule)
  },
  {
    path: 'business/:id',
    loadChildren: () => import('./business/business.module').then( m => m.BusinessPageModule)
  },
  {
    path: 'register/:first_name/:last_name/:email/:phone',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
//   {path: '**', 
//   redirectTo: '/tabs/tab1',
// },
  {
    path: 'bus-ticket',
    loadChildren: () => import('./bus-ticket/bus-ticket.module').then( m => m.BusTicketPageModule)
  },
  {
    path: 'pay-modal',
    loadChildren: () => import('./pay-modal/pay-modal.module').then( m => m.PayModalPageModule)
  },
  {
    path: 'not-modal',
    loadChildren: () => import('./not-modal/not-modal.module').then( m => m.NotModalPageModule)
  },
  {
    path: 'cancel-modal',
    loadChildren: () => import('./cancel-modal/cancel-modal.module').then( m => m.CancelModalPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'select-company',
    loadChildren: () => import('./select-company/select-company.module').then( m => m.SelectCompanyPageModule)
  },
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
