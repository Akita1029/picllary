import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { filter, fromEvent, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Contact } from 'app/layout/common/quick-chat/quick-chat.types';
import { Country } from 'app/services/user/user.types';
import { PublicEvents } from 'app/services/public-events/public-event.type';
import { PublicEventService } from 'app/services/public-events/public-event.service';
import { EventsService } from 'app/services/events/events.service';
import { eventsModel } from 'app/services/events/events.model';
import { FuseAlertType } from '@fuse/components/alert';
import { fuseAnimations } from '@fuse/animations';
@Component({
  selector: 'settings-event-management',
  templateUrl: './event-management.component.html',
  encapsulation  : ViewEncapsulation.None,
  animations   : fuseAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventManagementComponent implements  OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    eventsModel$: Observable<eventsModel[]>;

    contactsCount: number = 0;
    contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    countries: Country[];
    drawerMode: 'side' | 'over';
    searchInputControl: FormControl = new FormControl();
    selectedContact: Contact;
    statuses= [
        {name: 'Private', value: 'isPrivate' ,description: 'Can make event as private'},
        {name: 'Public', description: 'Can make event as public'},
        {name: 'Archive', description: 'Can make event as archive'}];
    statusControl = new FormControl('');
    //Alert
    alert: { type: FuseAlertType; message: string, appearance: string } = {
        type   : 'success',
        message: '',
        appearance: 'fill'
    };
    showAlert: boolean = false;
    isSM = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _eventService: EventsService,

    )
    {
    }

  
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    // Get the public events
    fetchAllEventsByUserId(){
        this._eventService.geteventbyUserId().subscribe((res:eventsModel[])=> {
            this.eventsModel$ = of(res.filter(x=> !x.isSharedEvent));
            this._changeDetectorRef.markForCheck();
          });
    }
    /**
     * On init
     */
    ngOnInit(): void
    {
        this.fetchAllEventsByUserId();
           // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if ( !opened )
            {
                // Remove the selected contact when drawer closed
                this.selectedContact = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode if the given breakpoint is active
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                }
                else
                {
                    this.drawerMode = 'over';
                    this.isSM = true;
                }

            
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Listen for shortcuts
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(event =>
                    (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
                    && (event.key === '/') // '/'
                )
            )
            .subscribe();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        this.onBackdropClicked();
    }
    
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void
    {
        // Go back to the list
        // this._router.navigate(['./'], {relativeTo: this._activatedRoute});
        // this._router.navigate(['/settings']);
        // this.matDrawer.close();
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    selectedStatus(value,publicEvent){
        this.showAlert = false;
        let reqBody= {
            "eventId": publicEvent.eventId, 
            "eventName": publicEvent.eventName, 
            "price": publicEvent.price, 
            "isPublic": value == 'Public' ?  true : false,
            "isDeleted": value == 'Delete' ?  true : false,
            "isActive": true,
            "isArchive": value == 'Archive' ?  true : false,
        };
       
        this._eventService.updateEvent(reqBody).subscribe(res =>{
            // Set the alert
                this.alert = {
                type   : 'success',
                message: `Sucessfully changed the ${reqBody.eventName} status !`,
                appearance: 'fill'
            };

            // Show the alert
            this.showAlert = true;
            setTimeout(() => {
                // Hide the alert
                    this.showAlert = false;
            }, 3000);
            this.fetchAllEventsByUserId();
        }, 
        (error)=> {
            // Set the alert
            this.alert = {
                type   : 'error',
                message: 'Status changing failed !',
                appearance: 'outline'
            };
            // Show the alert
            this.showAlert = true;
            setTimeout(() => {
                // Hide the alert
                    this.showAlert = false;
            }, 3000);
        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // delete public event
    // deleteEvent(item:any):any{
    //     this._eventService.de
    // }
}

