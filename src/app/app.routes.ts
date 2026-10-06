import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'state-debug',
    loadComponent: () => import('./features/state-debug/state-debug.component').then(m => m.StateDebugComponent)
  },
  { 
    path: 'contacts', 
    loadComponent: () => import('./features/contacts/contact-list/contact-list.component').then(m => m.ContactListComponent),
    children: [
      { 
        path: ':id', 
        loadComponent: () => import('./features/contacts/contact-details/contact-details.component').then(m => m.ContactDetailsComponent) 
      }
    ]
  },
  { path: '', redirectTo: '/contacts', pathMatch: 'full' },
  { path: '**', redirectTo: '/contacts' }
];
