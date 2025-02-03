import { AssessmentComponent } from './pages/assessment/assessment.component';
import { ConfigActivator } from '../shared/guards/config-activator.guard';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';
import { IHeaderConfig } from '../shared/models/header-config.interface';
import { IncompleteComponent } from './pages/incomplete/incomplete.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SsetComponent } from './pages/sset/sset.component';
import { UnavailableComponent } from '../shared/components/unavailable/unavailable.component';

const headerConfig: IHeaderConfig = {
  langs: ['en', 'fr'],
  menu: [],
  title: 'SSET'
};

const routes: Routes = [
  {
    path: '',
    canActivate: [ConfigActivator],
    canDeactivate: [ConfigActivator],
    children: [
      { path: '', redirectTo: 'en', pathMatch: 'full' },
      { path: ':lang', component: SsetComponent },
      { path: ':lang/assessment', component: AssessmentComponent },
      { path: ':lang/confirmation', component: ConfirmationComponent },
      { path: ':lang/incomplete', component: IncompleteComponent },
      { path: ':lang/unavailable', component: UnavailableComponent }
    ],
    data: { nav: true, header: headerConfig }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SsetRoutingModule {}
