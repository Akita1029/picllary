import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { EventsService } from 'app/services/events/events.service';
import { PublicEventService } from 'app/services/public-events/public-event.service';
import { PublicEvents } from 'app/services/public-events/public-event.type';
import {  Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-public-events',
  templateUrl: './public-events.component.html',
  styleUrls: ['./public-events.component.scss']
})
export class PublicEventsComponent implements OnInit {
  masonryColumns: number = 4;
  publicEvents: PublicEvents[];
  loading: boolean = true;
  isError: boolean = false;
  searchControl: FormControl = new FormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private publicEventService: PublicEventService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _eventService: EventsService,
    ) { 
    this.searchControl.valueChanges.subscribe(query=>  {
      if(query){
        this.publicEventService.eventSearch(query)
          .subscribe((resp: PublicEvents[]) => this.publicEvents = resp,
          (error: any) => {this.publicEvents = null; this.isError = true});
      }else{
        this.getEvents();
      }
    });
      
  }

  ngOnInit(): void {
    this.getEvents();
      // adjust image list columns based on window size
     this._fuseMediaWatcherService.onMediaChange$
     .pipe(takeUntil(this._unsubscribeAll))
     .subscribe(({ matchingAliases }) => {

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

  trackByFn(index: number, item: any): any {
    return item.imageId || index;
  }

  getEvents(){
    this.publicEventService.getAll().subscribe((res: PublicEvents[]) => {
      this.publicEvents = res;
    });
  }

  clearSearchText(){
    this.searchControl.patchValue('');
    this.getEvents();
  }
}
