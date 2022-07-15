import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { PriceComponent } from './price.component';
import { FuseCardModule } from '@fuse/components/card';
export const priceRoute: Route[] = [
    {
      path: '',
      component: PriceComponent
    },

]
@NgModule({
    declarations: [
        PriceComponent
    ],
    imports     : [
        RouterModule.forChild(priceRoute),
        MatButtonModule,
        FuseCardModule,
        SharedModule,MatIconModule
    ]
})
export class PriceModule
{
}
