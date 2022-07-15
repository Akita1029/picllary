import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseMasonryModule } from '@fuse/components/masonry';
import { SharedModule } from 'app/shared/shared.module';
import { notesRoutes } from './events.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {NgxPhotoEditorModule} from "ngx-photo-editor";

//custom components
import { EventsDetailsComponent } from './details/details.component';
import { EventByidComponent } from './event-byid/event-byid.component';
import { AddevntComponent } from './addevnt/addevnt.component';
import { MultiImageUploadComponent } from './multi-image-upload/multi-image-upload.component'
import { EventsLabelsComponent } from './labels/labels.component'
import { AddimageComponent } from './addimage/addimage.component';
import { EventsComponent } from './events.component';
import { EditImageDetailsComponent } from './edit-image-details/edit-image-details.component';

import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import 'hammerjs'; 
@NgModule({
    declarations: [
        EventsDetailsComponent,
        EventByidComponent,
        AddevntComponent,
        MultiImageUploadComponent,
        EventsLabelsComponent,
        AddimageComponent,
        EventsComponent,
        EditImageDetailsComponent,
    ],
    imports: [
        RouterModule.forChild(notesRoutes),
        RouterModule,
        FuseMasonryModule,
        SharedModule,
        ReactiveFormsModule,
        FuseAlertModule,

        NgxDropzoneModule,
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
        GalleryModule,
        LightboxModule,
        
        NgxPhotoEditorModule

    ]
})
export class EventsModule {
}
