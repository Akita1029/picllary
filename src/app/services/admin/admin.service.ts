import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, of, tap } from "rxjs";
import { environment } from '../../../environments/environment';
import { approvalImage } from "./approvalImages.types";
import { UserPreference, prefernce } from "./userprefernce.types";


@Injectable({
    providedIn: 'root'
})



export class AdminService {

    constructor(private _httpClient: HttpClient) { }

    private _allUsers: BehaviorSubject<UserPreference[] | null> = new BehaviorSubject(null);
    private _aprovalImages: BehaviorSubject<approvalImage[] | null> = new BehaviorSubject(null);



    get allUsers$(): Observable<UserPreference[]> {
        return this._allUsers.asObservable();
    }

    get allApprovalImages$(): Observable<approvalImage[]> {
        return this._aprovalImages.asObservable();
    }

    getAllUsersforAdministration(): Observable<UserPreference[]> {
        return this._httpClient.get<UserPreference[]>(`${environment.apiURL}User/getAllusers`).pipe(
            tap(
                (Response: UserPreference[]) => {
                    this._allUsers.next(Response);
                }
            )
        );
    }
    getImagesNeedApproval(): Observable<approvalImage[]> {
        return this._httpClient.get<approvalImage[]>(`${environment.apiURL}Admin/getBlockedImages`).pipe(
            tap(
                (Response: approvalImage[]) => {
                    this._aprovalImages.next(Response);
                }
            )
        );
    }

    updateUserPrefernce(userId: number, Prefernces: prefernce): Observable<any> {
        const url = environment.apiURL + "Admin/updateUserStatus?userId=" + userId;
        const headers = { 'content-type': 'application/json' }
        const body = JSON.stringify(Prefernces);
        return this._httpClient.put(url, body, { 'headers': headers })

    }

    addApproval(imageGuid:string):Observable<any>
    {
        return this._httpClient.post(`${environment.apiURL}Admin/approveImage?imageGuid=${imageGuid}`,"");
    }

}