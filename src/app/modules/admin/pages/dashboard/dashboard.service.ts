import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { DashboardService as httpDashboardService } from '../../../../services/dashboard/dashboard.service';
import { DashboardType } from 'app/services/dashboard/dashboard.types';


@Injectable({
    providedIn: 'root'
})
export class DashboardService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private _dashboarrdService: httpDashboardService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any>
    {
        return this._dashboarrdService.fetchDashboardData().pipe(
            tap((response: DashboardType) =>
                this._data.next(response),
                err => console.log('Dashboard Service',err)),
        );
    }
}
