import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from 'app/services/auth/auth.service';
import { UserService } from 'app/services/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild
{
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _userService: UserService
    )
    {
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
         return this._userService.getUserById()
                   .pipe( 
                       switchMap((user) => {
                        // If the user is guest...
                        if(user.isGuest){
                            this._router.navigateByUrl('/');
                            return of(false);
                        }
                        // If the user is not admin...
                        if (!user.isAdmin)
                        {
                            this._router.navigateByUrl('/');
                            return of(false);
                        }

                        // Allow the access
                        return of(true);

                })
            );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
    {
       return this._userService.getUserById()
                   .pipe( 
                       switchMap((user) => {
                         // If the user is guest...
                         if(user.isGuest){
                            this._router.navigateByUrl('/');
                            return of(false);
                        }
                        // If the user is not admin...
                        if (!user.isAdmin)
                        {
                            this._router.navigateByUrl('/');
                            return of(false);
                        }

                        // Allow the access
                        return of(true);

                })
            );

    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    // canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    // {
    //     return this._authService.isAdmin ? true : false;
    // }

    /**
     * Can load
     *
     * @param route
     * @param segments
     */
    // canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean
    // {
    //     return this._check('/');
    // }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @param redirectURL
     * @private
     */
    // private _check(redirectURL: string): Observable<boolean>
    // {
    //     // Check the authentication status
    //     return this._authService.check()
    //                .pipe(
    //                    switchMap((authenticated) => {
                   
    //                     // If the user is not authenticated...
    //                        if ( !authenticated )
    //                        {
    //                            // Redirect to the sign-in page
    //                            this._router.navigate(['sign-in'], {queryParams: {redirectURL}});

    //                            // Prevent the access
    //                            return of(false);
    //                        }

    //                        // Allow the access
    //                        return of(true);
    //                    })
    //                );
    // }
}
