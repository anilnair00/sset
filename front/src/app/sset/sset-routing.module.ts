import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SsetComponent } from './pages/sset/sset.component';
import { IHeaderConfig } from '../shared/models/header-config.interface';
import { ConfigActivator } from '../shared/guards/config-activator.guard';
import { UnavailableComponent } from '../shared/components/unavailable/unavailable.component';

const headerConfig: IHeaderConfig = {
  title: 'SSET',
  menu: [],
  langs: ['en', 'fr', 'es', 'zh']
};

const routes: Routes = [
  {
    path: '',
    data: { nav: true, header: headerConfig },
    canActivate: [ConfigActivator],
    canDeactivate: [ConfigActivator],
    children: [
      { path: '', redirectTo: 'en', pathMatch: 'full' },
      { path: ':lang/unavailable', component: UnavailableComponent },
      { path: ':lang', component: SsetComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SsetRoutingModule {}
