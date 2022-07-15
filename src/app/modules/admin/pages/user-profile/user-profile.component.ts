import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { eventsModel} from 'app/services/events/events.model';
import { EventsService } from 'app/services/events/events.service';
import { PublicEventService } from 'app/services/public-events/public-event.service';
import { PublicEvents } from 'app/services/public-events/public-event.type';
import { UserService } from 'app/services/user/user.service';
import { User } from 'app/services/user/user.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  masonryColumns: number = 4;
  events: eventsModel[];
  loading: boolean = true;
  isError: boolean = false;
  profilePhoto = null;
  userName = '';
  aboutMe = ``;
  user: User | undefined;
  totalEvents: number = 0;
  readMore = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _eventService: EventsService,
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(p=>{
      if(p['userId']){
        this.getUserData(p['userId']);
        this.getEvents(p['userId']);
      }
    });
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
             this.masonryColumns = 4;
         }
         else if (matchingAliases.includes('lg')) {
             this.masonryColumns = 3;
         }
         else if (matchingAliases.includes('md')) {
             this.masonryColumns = 2;
         }
         else if (matchingAliases.includes('sm')) {
             this.masonryColumns = 1;
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

  getEvents(userId){
    this._eventService.getevent().subscribe((res: eventsModel[]) => {
      this.events = res.filter(x=> x.userId == userId && x.isPublic);
      this.totalEvents = this.events.length;
      this._changeDetectorRef.markForCheck();
    });
  }

  getUserData(userId): void{
    this._userService.getUserById(userId).subscribe((data: User)=>{
      this.user = data;
      this.aboutMe = data.aboutMe;
      this.userName = this.user.firstName + this.user.lastName;
      this.profilePhoto = this.user.profilePhoto;
      this._changeDetectorRef.markForCheck();
  });
}
}
