import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MasterService
{
    /**
     *
     */
    constructor(private _httpClient: HttpClient) { }

    getCountries(): Observable<any>{
        return this._httpClient.get(`${environment.apiURL}Data/countries`)
    }
   
    getInterests(): Observable<any>{
        return this._httpClient.get(`${environment.apiURL}Data/interests`)
    }
}