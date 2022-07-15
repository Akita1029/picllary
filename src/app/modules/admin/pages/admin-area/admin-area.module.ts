import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminAreaComponent } from './admin-area.component';
import { RouterModule } from '@angular/router';
import { adminReaRoutes } from './admin-area.routing';
/* mat componrnt */
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import {MatChipsModule} from '@angular/material/chips';
import {MatSliderModule} from '@angular/material/slider';
import {MatDividerModule} from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator';
import { FuseNavigationModule } from '@fuse/components/navigation/navigation.module';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import {MatSortModule} from '@angular/material/sort';
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { UserAdministrationComponent } from './user-administration/user-administration.component';
import { ImageApprovalComponent } from './image-approval/image-approval.component';
import { ImageDetailsComponent } from './image-approval/image-details/image-details.component';
@NgModule({
  declarations: [
    AdminAreaComponent,
    UserAdministrationComponent,
    ImageApprovalComponent,
    ImageDetailsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(adminReaRoutes),
    RouterModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatSidenavModule,
    MatSlideToggleModule,    
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatStepperModule,
    MatProgressBarModule,
    MatChipsModule,
    MatDividerModule,
    FuseNavigationModule,
    MatSliderModule,
    FuseCardModule,
    FuseAlertModule,
    NgxSliderModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
    
  ]
})
export class AdminAreaModule { }
