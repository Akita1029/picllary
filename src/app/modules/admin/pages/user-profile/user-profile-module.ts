import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FuseCardModule } from '@fuse/components/card';
import { FuseMasonryModule } from '@fuse/components/masonry';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile.component';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [ {
    path: '',
    component: UserProfileComponent,
}];
  
@NgModule({
  declarations: [
    UserProfileComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FuseCardModule,
    FuseMasonryModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class UserProfileModule { }
