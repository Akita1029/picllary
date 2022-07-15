import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { eventByIdmodel, eventsModel, imageModel } from 'app/services/events/events.model';
import { EventsService } from 'app/services/events/events.service';
import { BehaviorSubject, Observable, Subject, takeUntil, filter } from 'rxjs';
import { AddimageComponent } from '../addimage/addimage.component';
import { EventsDetailsComponent } from '../details/details.component';
import { MultiImageUploadComponent } from '../multi-image-upload/multi-image-upload.component';
import { UserService } from 'app/services/user/user.service';
@Component({
  selector: 'app-event-byid',
  templateUrl: './event-byid.component.html'
})
export class EventByidComponent implements OnInit, AfterViewInit {

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  images$: Observable<imageModel[]>
  selectedEventDetails$: Observable<eventByIdmodel>;
  selectedEventDetails: eventByIdmodel;
  eventid: number;
  drawerMode: 'side' | 'over';
  masonryColumns: number = 4;
  allImages: imageModel[];
  msterImageSource: imageModel[];
  isPhotographer: Boolean = false;
  filterValues = {};
  filterSelectObj = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(
    private _matDialog: MatDialog,
    private _eventService: EventsService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
    private route: ActivatedRoute
  ) { 
    this.filterSelectObj = [
      {
        name: 'TITLE',
        columnProp: 'title',
        options: []
      }, {
        name: 'POSITION',
        columnProp: 'description',
        options: []
      }, {
        name: 'TAG',
        columnProp: 'tag',
        options: []
      }, {
        name: 'PRICE',
        columnProp: 'price',
        options: []
      }
    ]
  }

  ngOnInit(): void {

    this.allImages = null;
    this.route?.params.subscribe(params => {
      let eventId = params['eventId'];
      if (eventId != null) {
        // Mark for check
        this._changeDetectorRef.markForCheck();
        this.eventid = eventId;
        this._eventService.getImagesByEvent(eventId).subscribe();
        this.images$ = this._eventService.images$;
        this._eventService.images$.subscribe((data) => { this.allImages = data; this.msterImageSource = data; }, (error) => {
          this.allImages = null;
          this.msterImageSource = null;
          console.log("error while loading")
        });
        this._eventService.getEventDaetilsbyID(eventId).subscribe();
        this.selectedEventDetails$ = this._eventService.eventDetails$;
        this.selectedEventDetails$.subscribe((data) => { this.selectedEventDetails = data })
      }
      else {
        this.loadLastUpdatedEvent();
      }

    });

    this._userService.user$.subscribe((data) => { this.isPhotographer=data.isPhotographer});
    // Masonary View
    // adjust image list columns based on window size
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {

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

  ngAfterViewInit(): void {

  }

  openImageDetailsDialog(imageData: imageModel): void {
    this._eventService.updateImageViewCount(imageData.imageGuid).subscribe();

    this._matDialog.open(EventsDetailsComponent, {
      autoFocus: false,
      maxHeight: '90vh',
      data: {
        selectedImageId: imageData.imageId,
        eventDetails: this.selectedEventDetails
      }
    });
  }

  addNewImage(): void {
    let eventId: Number = this.eventid;
    this._matDialog.open(AddimageComponent, {

      autoFocus: false,
      maxHeight: '115vh',
      data: {
        eventId
      }
    });
  }

  addMultiImage(): void {
    let eventId: Number = this.eventid;
    this._matDialog.open(MultiImageUploadComponent, {

      autoFocus: false,
      maxHeight: '90vh',
      data: {
        eventId
      }
    });

  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  loadLastUpdatedEvent() {
    // Mark for check
    this.allImages = null;
    let lastEdi: number;
    this._eventService.geteventbyUserId().subscribe((data: eventsModel[]) => {
      data.sort(function (a, b) {
        var date1 = a.updatedAt;
        var date2 = b.updatedAt;
        if (date1 > date2) {
          return -1;
        }
        if (date1 < date2) {
          return 1;
        }
        return 0;
      });

      lastEdi = data[0].eventId;
      this.eventid = lastEdi;
      this._eventService.getImagesByEvent(lastEdi).subscribe();
      this.images$ = this._eventService.images$;
      this._eventService.images$.subscribe((data) => { this.allImages = data; this.msterImageSource = data; });
      this._eventService.getEventDaetilsbyID(lastEdi).subscribe();
      this.selectedEventDetails$ = this._eventService.eventDetails$;
      this.selectedEventDetails$.subscribe((data: eventByIdmodel) => {
        this.selectedEventDetails = data;
      });

      // Mark for check
      this._changeDetectorRef.markForCheck();
    })
  }


  filterImages(searchKey: string) {
    this.allImages = this.msterImageSource.filter(image => image.title.toLocaleLowerCase().includes(searchKey.toLocaleLowerCase()))
  }
  filterChange(filterItem, searchKey: string) {
    switch(filterItem.columnProp){
      case 'title':
        this.allImages = this.msterImageSource.filter(image => image.title.toLocaleLowerCase().includes(searchKey.toLocaleLowerCase()));
        break
      case 'tag':
        this.allImages = this.msterImageSource.filter(image => image.tags.toLocaleLowerCase().includes(searchKey.toLocaleLowerCase()));
        break
      case 'price':
        this.allImages = this.msterImageSource.filter(image => image.price = Number(searchKey));
        break
      case 'description':
        this.allImages = this.msterImageSource.filter(image => image.description.toLocaleLowerCase().includes(searchKey.toLocaleLowerCase()));
        break
    }
  }
  getFilterObject(fullObj, key) {
    const uniqChk = [];
    fullObj.filter((obj) => {
      if (!uniqChk.includes(obj[key])) {
        uniqChk.push(obj[key]);
      }
      return obj;
    });
    return uniqChk;
  }
}
