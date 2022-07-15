import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { SettingsComponent } from 'app/modules/admin/pages/settings/settings.component';
import { SettingsAccountComponent } from 'app/modules/admin/pages/settings/account/account.component';
import { SettingsSecurityComponent } from 'app/modules/admin/pages/settings/security/security.component';
import { SettingsPlanBillingComponent } from 'app/modules/admin/pages/settings/plan-billing/plan-billing.component';
import { SettingsNotificationsComponent } from 'app/modules/admin/pages/settings/notifications/notifications.component';
import { SettingsTeamComponent } from 'app/modules/admin/pages/settings/team/team.component';
import { settingsRoutes } from 'app/modules/admin/pages/settings/settings.routing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventManagementDetailsComponent } from './event-management/event-management-details/event-management-details.component';
import { EventManagementComponent } from './event-management/event-management.component';
import { FuseConfirmationModule } from '@fuse/services/confirmation';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
    declarations: [
        SettingsComponent,
        SettingsAccountComponent,
        SettingsSecurityComponent,
        SettingsPlanBillingComponent,
        SettingsNotificationsComponent,
        SettingsTeamComponent,
        EventManagementComponent,
        EventManagementDetailsComponent
    ],
    imports     : [
        RouterModule.forChild(settingsRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        FuseAlertModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        MatTooltipModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        MatDatepickerModule,
        NgxMatMomentModule,
        FuseConfirmationModule,
        MatAutocompleteModule
    ]
})
export class SettingsModule
{
}
