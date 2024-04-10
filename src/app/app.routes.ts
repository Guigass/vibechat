import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'app',
    loadComponent: () => import('./pages/app/app.page').then( m => m.AppPage),
    children: [
      {
        path: '',
        redirectTo: 'default',
        pathMatch: 'full',
      },
      {
        path: 'chat',
        loadComponent: () => import('./pages/chat/chat.page').then( m => m.ChatPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
      },
      {
        path: 'default',
        loadComponent: () => import('./pages/default/default.page').then( m => m.DefaultPage)
      },
    ]
  },

];
