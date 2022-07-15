import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { EventsDetailsComponent } from '../details/details.component';
import { EventsLabelsComponent } from '../labels/labels.component';
import { AddevntComponent } from '../addevnt/addevnt.component';
import { AddimageComponent } from '../addimage/addimage.component';
import { EventsService } from 'app/services/events/events.service';
import { eventsModel, imageModel } from 'app/services/events/events.model';
import { Label, Event } from '../events.types';
import { cloneDeep } from 'lodash-es';
import { UserService } from 'app/services/user/user.service';


@Component({
    selector: 'notes-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsListComponent implements OnInit, OnDestroy, AfterViewInit {
    labels$: Observable<Label[]>;
    notes$: Observable<Event[]>;
    events$: Observable<eventsModel[]>
    images$: Observable<imageModel[]>
    eventid: number;
    userId: number;

    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    filter$: BehaviorSubject<string> = new BehaviorSubject('notes');
    searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
    masonryColumns: number = 4;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    sellectedEventId: number;
    


    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _matDialog: MatDialog,
        private _eventService: EventsService,
        private _userservice: UserService,
     
    ) {
    }
    ngAfterViewInit(): void {
       
    }


    get filterStatus(): string {
        return this.filter$.value;
    }


    ngOnInit(): void {
        this._userservice.userId$.subscribe(id=>this.userId = id);
        this.eventid = 0;
        //get event ids and load image for the first event     
        this._eventService.getevent().subscribe((data: eventsModel[]) => {

            if (data.length > 0) {
                this.eventid = data[0].eventId;
                this._eventService.getImagesByEvent(data[0].eventId).subscribe();
            }

        });
        this.events$ = this._eventService.event$;
        this.images$ = this._eventService.images$;
        this.images$.subscribe((data: any[]) => {

        });

        // adjust image list columns based on window size
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Set the drawerMode and drawerOpened if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Set the masonry columns
                //
                // This if block structured in a way so that only the
                // biggest matching alias will be used to set the column
                // count.
                if (matchingAliases.includes('xl')) {
                    this.masonryColumns = 5;
                }
                else if (matchingAliases.includes('lg')) {
                    this.masonryColumns = 4;
                }
                else if (matchingAliases.includes('md')) {
                    this.masonryColumns = 3;
                }
                else if (matchingAliases.includes('sm')) {
                    this.masonryColumns = 2;
                }
                else {
                    this.masonryColumns = 1;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

     
    }


    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }


    addNewEvent(): void {
        this._matDialog.open(AddevntComponent, {
            autoFocus: false,
            data: {
                note: {}
            }
        });
    }
    addNewImage(eventId: Number): void {
        //AddimageComponent      
        this._matDialog.open(AddimageComponent, {

            autoFocus: false,
            maxHeight: '90vh',
            data: {
                eventId
            }
        });
    }



    openEditLabelsDialog(): void {
       this._matDialog.open(EventsLabelsComponent, { autoFocus: false });
      
    }


    openImageDetailsDialog(imageid: number): void {
        this._matDialog.open(EventsDetailsComponent, {
            autoFocus: false,
            maxHeight: '90vh',
            data: {
              selectedImageId:imageid,          
          }
        });
    }


    LoadImageByEvent(labelId: number): void {
        const filterValue = `label:${labelId}`;
        this.eventid = labelId;
        this.filter$.next(filterValue);
        this._eventService.getImagesByEvent(labelId).subscribe();
        this.images$ = this._eventService.images$;
    }
   
    trackByFn(index: number, item: any): any {

        return item.imageId || index;

    }
}
