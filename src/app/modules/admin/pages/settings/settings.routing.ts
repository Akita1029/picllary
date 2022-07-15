import { Route } from '@angular/router';
import { RoleGuard } from 'app/core/auth/guards/role.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { SettingsComponent } from 'app/modules/admin/pages/settings/settings.component';
import { EventManagementDetailsComponent } from './event-management/event-management-details/event-management-details.component';

export const settingsRoutes: Route[] = [
    {
        path     : '',
        canActivate: [RoleGuard],
        canActivateChild: [RoleGuard],
        component: SettingsComponent,
        // children : [
        //     {
        //         path         : ':eventId',
        //         component    : PublicEventManagementDetailsComponent 
        //     }
        // ]
        children : [
            {
                path     : 'eventmanagement',
                // component: LayoutComponent,
                children : [
                    {
                        path         : ':eventId',
                        component    : EventManagementDetailsComponent,
                    }
                ]
            }
        ]
    },
    
];
