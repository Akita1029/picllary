import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, ignoreElements, map, Observable, of, ReplaySubject, Subject, switchMap, tap } from 'rxjs';
import { User } from 'app/services/user/user.types';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _userId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private _allUsers: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
        /**
     * Constructor
    */
    constructor(private _httpClient: HttpClient)
    {
        // let getuser = localStorage.getItem("user");
        // if(getuser){
        //     this.signedUser = JSON.parse(getuser) as User;
        // }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        this._user.next(value);
        this._userId.next(value.userId);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }
   
    get userId$(): Observable<number>
    {
        return this._userId.asObservable();
    }

  
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

   
    getUserById(userId?): Observable<User>{
        if(userId){
            return this._httpClient.get<User>(`${environment.apiURL}User/getuser/?userId=${userId}`).pipe(
                tap((user)=>{
                    return of(user);
                })
            );
        }
        return this._httpClient.get<User>(`${environment.apiURL}User/getuser`).pipe(
            tap((user)=>{
                this.user =user;
                return of(user);
            })
        );
    }

    
    /**
     * Update the user
     *
     * @param user
     */
   
    updateUser(user): Observable<any>{
        return this._httpClient.put(`${environment.apiURL}User/update`, user);
    }

    /**
     * Get All users
     * 
     */
    getAllUsers(): Observable<User[]>{
        return this._httpClient.get<User[]>(`${environment.apiURL}User/getAllusers`);
    }

    /**
     * Upload profile photo
     */

    uploadProfilePhoto(file): Observable<any>{
        return this._httpClient.post<any>(`${environment.apiURL}User/uploadProfileImage`,  file);
    }

    /**
     * Delete profile photo
     */

    deleteProfilePhoto(): Observable<any>{
        return this._httpClient.delete(`${environment.apiURL}User/deleteProfileImage`);
    }

  
}
