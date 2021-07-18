import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'book-modal',
    loadChildren: () => import('./modals/book-modal/book-modal.module').then( m => m.BookModalPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./components/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./components/onboarding/onboarding.module').then( m => m.OnboardingPageModule)
  },
  {
    path: 'payment-success',
    loadChildren: () => import('./components/payment-success/payment-success.module').then( m => m.PaymentSuccessPageModule)
  },
  {
    path: 'business/:id',
    loadChildren: () => import('./views/business/business.module').then( m => m.BusinessPageModule)
  },
  {
    path: 'register/:first_name/:last_name/:email/:phone/:store/client_id:',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'bus-ticket',
    loadChildren: () => import('./components/bus-ticket/bus-ticket.module').then( m => m.BusTicketPageModule)
  },
  {
    path: 'pay-modal',
    loadChildren: () => import('./modals/pay-modal/pay-modal.module').then( m => m.PayModalPageModule)
  },
  {
    path: 'not-modal',
    loadChildren: () => import('./modals/not-modal/not-modal.module').then( m => m.NotModalPageModule)
  },
  {
    path: 'cancel-modal',
    loadChildren: () => import('./modals/cancel-modal/cancel-modal.module').then( m => m.CancelModalPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./views/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'select-company',
    loadChildren: () => import('./views/select-company/select-company.module').then( m => m.SelectCompanyPageModule)
  },
  {
    path: 'share-appo-social',
    loadChildren: () => import('./modals/share-appo-social/share-appo-social.module').then( m => m.ShareAppoSocialPageModule)
  },
  {
    path: 'add-favorites',
    loadChildren: () => import('./views/add-favorites/add-favorites.module').then( m => m.AddFavoritesPageModule)
  },
  {
    path: 'category',
    loadChildren: () => import('./components/category/category.module').then( m => m.CategoryPageModule)
  },
  {
    path: 'booked-by-others',
    loadChildren: () => import('./modals/booked-by-others/booked-by-others.module').then( m => m.BookedByOthersPageModule)
  },
  {
    path: 'noconnection',
    loadChildren: () => import('./components/absent/absent.module').then( m => m.AbsentPageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./views/info-page/info-page.module').then( m => m.InfoPagePageModule)
  },
  
  {
    path: 'info-page',
    loadChildren: () => import('./views/info-page/info-page.module').then( m => m.InfoPagePageModule)
  },
  {
    path: 'not-bookable-online',
    loadChildren: () => import('./views/not-bookable-online/not-bookable-online.module').then( m => m.NotBookableOnlinePageModule)
  },
  {
    path: 'extra-info',
    loadChildren: () => import('./modals/extra-info/extra-info.module').then( m => m.ExtraInfoPageModule)
  },
  {
    path: 'not-settings',
    loadChildren: () => import('./components/not-settings/not-settings.module').then( m => m.NotSettingsPageModule)
  },
  {path: '**', 
  redirectTo: '/tabs/tab1',
},
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
