import { Route } from '@angular/router';
import { EventsComponent } from './events.component';
import { EventByidComponent } from './event-byid/event-byid.component';
import {EventsDetailsComponent} from './details/details.component';
import {EditImageDetailsComponent} from './edit-image-details/edit-image-details.component';

export const notesRoutes: Route[] = [
    {
        path: '',
        component: EventsComponent,
        children: [
            {
                path: '',
                component: EventByidComponent
            },
            {
                path: ':eventId',
                component: EventByidComponent
            }
            ,
            {
                path: ':eventId/editimage',
                component: EditImageDetailsComponent
            }
        ],
        
    }
];
