import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { debounceTime, filter, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { EventsService } from 'app/services/events/events.service';
import { eventBaseModel } from 'app/services/events/events.model';
import { Label } from '../events.types';

@Component({
    selector: 'notes-labels',
    templateUrl: './labels.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsLabelsComponent implements OnInit, OnDestroy {
    events$: Observable<eventBaseModel[]>;

    labelChanged: Subject<Label> = new Subject<Label>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _notesService: EventsService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the labels
        this.events$ = this._notesService.event$;

      
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

   

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
