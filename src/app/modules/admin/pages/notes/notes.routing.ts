import { Route } from '@angular/router';
import { NotesListComponent } from './list/list.component';
import { NotesComponent } from './notes.component';

export const notesRoutes: Route[] = [
    {
        path     : '',
        component: NotesComponent,
        children : [
            {
                path     : '',
                component: NotesListComponent
            }
        ]
    }
];
