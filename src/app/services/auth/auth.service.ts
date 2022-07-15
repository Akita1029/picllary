import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/services/user/user.service';
import { User } from '../user/user.types';
import {environment} from '../../../environments/environment';
import { I } from '@angular/cdk/keycodes';


@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;
    public isAdmin: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<User>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post<User>(`${environment.apiURL}Login/validate`, credentials).pipe(
            switchMap((response: User) => {
                // Store the access token in the local storage
                this.accessToken = response.token;
                // Set the authenticated flag to true
                this._authenticated = true;
                this.isAdmin = response.isAdmin;
                // Return a new observable with the response
                return of(response);
            }),
            //  catchError((err, caught) => {
            //     let msg= "User Not Found ! :(";
            //     alert(msg)
            //     return of(msg);
            // }) 
        );
    }


    
    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Renew token
        return this._httpClient.post('api/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Store the access token in the local storage
                // this.accessToken = response.accessToken;

                // // Set the authenticated flag to true
                // this._authenticated = true;

                // // Store the user on the user service
                // this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { firstName: string; lastName: string; email: string; password: string; mobile: number, isPhotographer: boolean }): Observable<any>
    {

          let reqBody = {
            "email"             : user.email,
            "discloseLocation"  : true,
            "isPublic"          : true,
            "firstName"         : user.firstName,
            "password"          : user.password,
            "lastName"          : user.lastName,
            "latitude"          : 0,
            "longitude"         : 0,
            "mobile"            : user.mobile,
            "profession"        : "",
            "isPhotographer"    : user.isPhotographer,
            "stripeId"          : 0,
            "countryId"         : 1,
            "totalImageCount"   : 0,
            "allowedImageCount" : 0,
            "interest"          : [""]
          }
        return this._httpClient.post(`${environment.apiURL}User/addUser`, reqBody);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }
        
        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
