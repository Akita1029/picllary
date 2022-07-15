import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { UserProfileComponent } from './modules/admin/pages/user-profile/user-profile.component';
import { PriceComponent } from './modules/price/price.component';
import { PrivacyComponent } from './modules/admin/pages/privacy/privacy.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    {
       path: 'privacy', component: PrivacyComponent 
    },
    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard' },
    { 
        path: 'public-events',
        component: LayoutComponent,
        resolve: {
                    initialData: InitialDataResolver,
        },
        children: [{path:'', loadChildren:()=> import('../app/modules/admin/pages/public-events/public-events.module').then(m => m.PublicEventsModule)}]
    },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule) },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) },
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule) }
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
           { path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule) },
          
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: 'dashboard', loadChildren: () => import('app/modules/admin/pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'settings', loadChildren: () => import('app/modules/admin/pages/settings/settings.module').then(m => m.SettingsModule) },
            { path: 'events', loadChildren: () => import('app/modules/admin/pages/events/events.module').then(m => m.EventsModule) },
            { path: 'adminarea', loadChildren: () => import('app/modules/admin/pages/admin-area/admin-area.module').then(m => m.AdminAreaModule) },
            { path: 'profile/:userId', loadChildren: () => import('app/modules/admin/pages/user-profile/user-profile-module').then(m => m.UserProfileModule) },
            { path: 'price', loadChildren: () => import('app/modules/price/price.module').then(m => m.PriceModule) },
        ]
    },

    // application routes
    // {
    //     path: '',
    //     canActivate: [AuthGuard],
    //     canActivateChild: [AuthGuard],
    //     component: LayoutComponent,
    //     resolve: {
    //         initialData: InitialDataResolver,
    //     },
    //     children: [
    //         { path: 'events', loadChildren: () => import('app/modules/apps/events/events.module').then(m => m.EventsModule) },
    //     ]
    // }

];
