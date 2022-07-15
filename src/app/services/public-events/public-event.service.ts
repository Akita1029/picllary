import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { PublicEvents } from "./public-event.type";
import { environment } from '../../../environments/environment'

@Injectable({
    providedIn: 'root'
})

export class PublicEventService {
    private _event: BehaviorSubject<PublicEvents[] | null> = new BehaviorSubject(null);
    private _isPublicEvents: BehaviorSubject<boolean | null> = new BehaviorSubject(null);
    
    /**
     *
     */
    constructor(private _httpClient: HttpClient) {

    }

    get publicEventTypes$(): Observable<PublicEvents[]>{
        return this._event.asObservable();
    }

    set publicEventTypes(value: PublicEvents[]){
        this._event.next(value);
    }
    
    get publicEventSetting$(): Observable<boolean>{
        return this._isPublicEvents.asObservable();
    }

    set publicEventSetting(value: boolean){
        this._isPublicEvents.next(value);
    }

    getAll() : Observable<PublicEvents[]>{
        return this._httpClient.get<PublicEvents[]>(`${environment.apiURL}Event`);
    }

    eventSearch(searchQuery: string): Observable<PublicEvents[]>{
        return this._httpClient.get<PublicEvents[]>(`${environment.apiURL}Event/search/?searchText=${searchQuery}`);
    }
}