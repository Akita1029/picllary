import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicEventsComponent } from './public-events/public-events.component';

const routes: Routes = [ {
  path: '',
  component: PublicEventsComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicEventsRoutingModule { }
