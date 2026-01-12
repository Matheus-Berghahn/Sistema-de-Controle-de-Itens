import { Routes } from '@angular/router';
import { ItemListComponent } from './items/item-list/item-list';
import { ItemFormComponent } from './items/item-form/item-form';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'items',
    pathMatch: 'full'
  },
  {
    path: 'items',
    component: ItemListComponent
  },
  {
    path: 'items/novo',
    component: ItemFormComponent
  },
  {
    path: 'items/:id/editar',
    component: ItemFormComponent
  },
  {
    path: '**',
    redirectTo: 'items'
  }
];