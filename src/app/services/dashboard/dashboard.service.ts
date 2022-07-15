import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, of } from "rxjs";
import {environment} from '../../../environments/environment';
import { DashboardType } from "./dashboard.types";

@Injectable({
    providedIn: 'root'
})
export class DashboardService
{
/**
 *
 */
constructor(private _httpClient: HttpClient) {}

 fetchDashboardData(): Observable<DashboardType>{
     return this._httpClient.get<DashboardType>(`${environment.apiURL}Dashboard/usageinfo`).pipe(
        map((response)=> {
            response.userStatistics.usedStorage = Math.round(response.userStatistics.usedStorage);
            response.userStatistics.allowedImageCount = Math.round(response.userStatistics.allowedImageCount);
            return response},
        err=> {
            console.log('Error getting usageinfo',err);
        }));
 }
}