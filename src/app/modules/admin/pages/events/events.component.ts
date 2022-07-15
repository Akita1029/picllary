import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { eventByIdmodel, eventsModel } from 'app/services/events/events.model';
import { EventsService } from 'app/services/events/events.service';
import { UserService } from 'app/services/user/user.service';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { AddevntComponent } from './addevnt/addevnt.component';
import { EventsLabelsComponent } from './labels/labels.component';


@Component({
    selector: 'events',
    templateUrl: './events.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EventsComponent implements OnInit, AfterViewInit {

    @ViewChild('drawer') sidenav: MatSidenav;
    /**
     * Constructor
     */
    events$: Observable<eventsModel[]>;
    allEvents:eventsModel[]=[];
    masterAllevents:eventsModel[]=[];
    eventDetails: eventByIdmodel;
    seletcedEventid: number;
    userId: number;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    isBigScreen:boolean;
    isPhotographer:boolean=false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _matDialog: MatDialog,
        private _eventService: EventsService,
        private _userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,

    ) {
    }

    ngOnInit(): void {
        this._userService.userId$.subscribe(id => this.userId = id);
       
        this._userService.user$.subscribe((data)=>{this.isPhotographer=data.isPhotographer});
        //get event ids and load image for the first event     
        this._eventService.geteventbyUserId().subscribe();
        this._eventService.event$.subscribe((data)=>{
            this.allEvents=data;
            this.masterAllevents=data;
            this._changeDetectorRef.markForCheck();
        });
        this.events$ = this._eventService.event$;

        // adjust image list columns based on window size
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Set the drawerMode and drawerOpened if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                   this.isBigScreen=true;
                }
                else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                    this.isBigScreen=false
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    ngAfterViewInit(): void {
        if (!this.userId) {
            this._userService.getUserById().subscribe();
        }
    }

    addNewEvent(): void {
        this._matDialog.open(AddevntComponent, {
            autoFocus: false,
            data: {
                note: {}
            }
        });
    }

    openEditLabelsDialog(): void {
        this._matDialog.open(EventsLabelsComponent, { autoFocus: false });
    }
    selectEvent(eventid: number) {
        if (this.isBigScreen==false) {
            this.sidenav.toggle();
        }

        this.seletcedEventid = eventid;
    }

    onEventSearchKeychange(searchKey:string){
        console.log(searchKey);
        this.allEvents=(Object.values(this.masterAllevents).filter(x=>x.eventName.toLowerCase().includes(searchKey.toLowerCase())));
    }

}
