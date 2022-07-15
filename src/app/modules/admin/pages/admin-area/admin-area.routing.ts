import { NgModule } from '@angular/core';
import { Route } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { RoleGuard } from 'app/core/auth/guards/role.guard';
import { AdminAreaComponent } from './admin-area.component';
import { UserAdministrationComponent } from './user-administration/user-administration.component';
import {ImageApprovalComponent} from './image-approval/image-approval.component';


export const adminReaRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'adminarea'
  },
  {
    path: '',
    component: AdminAreaComponent,
    canActivate: [RoleGuard],
    canActivateChild: [RoleGuard],
    children: [
      {
        path: '',
        component: UserAdministrationComponent,
      },

      {
        path: 'usersetting',
        component: UserAdministrationComponent,
      },
      {
        path: 'imageapproval',
        component: ImageApprovalComponent,
      }
    ]
  }
];
