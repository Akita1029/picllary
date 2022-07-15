import { Component, OnInit } from '@angular/core';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.scss']
})

export class AdminAreaComponent implements OnInit {

  menuData: FuseNavigationItem[];

  constructor(private _fuseMediaWatcherService: FuseMediaWatcherService) {
    this.menuData = [
      {
          title   : 'Actions',
          subtitle: 'Administration',
          type    : 'group',
          children: [
              {
                  title: 'User Administration',
                  type : 'basic',
                  icon : 'heroicons_outline:user-group',
                  link:'usersetting'
            
              },
              {
                title: 'Approvals',
                type : 'basic',
                icon : 'heroicons_outline:badge-check',
                link:'imageapproval'
          
            }
          ]
      }
  ];
   }
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  ngOnInit(): void {


    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(({matchingAliases}) => {

        // Set the drawerMode and drawerOpened
        if ( matchingAliases.includes('lg') )
        {
            this.drawerMode = 'side';
            this.drawerOpened = true;
        }
        else
        {
            this.drawerMode = 'over';
            this.drawerOpened = false;
        }
    });
  }




 ngOnDestroy(): void
 {
     // Unsubscribe from all subscriptions
     this._unsubscribeAll.next(null);
     this._unsubscribeAll.complete();
 }
}
