import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicEventsRoutingModule } from './public-events-routing.module';
import { PublicEventsComponent } from './public-events/public-events.component';
import { FuseCardModule } from '@fuse/components/card';
import { FuseMasonryModule } from '@fuse/components/masonry';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    PublicEventsComponent
  ],
  imports: [
    CommonModule,
    FuseCardModule,
    FuseMasonryModule,
    PublicEventsRoutingModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class PublicEventsModule { }
