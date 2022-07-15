/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard',
        isAdmin: false,
        isGuest: true
    },
    {
        id   : 'events',
        title: 'Events',
        type : 'basic',
        icon : 'heroicons_outline:bell',
        link : '/events',
        isAdmin: false,
        isGuest: true
    },
    {
        id   : 'publicevents',
        title: 'Public Events',
        type : 'basic',
        icon : 'heroicons_outline:bell',
        link : '/public-events',
        isAdmin: false,
        isGuest: true
    },
    {
        id   : 'settings',
        title: 'Settings',
        type : 'basic',
        icon : 'heroicons_outline:cog',
        link : '/settings',
        isAdmin: false,
        isGuest: false
    },
    {
        id   : 'adminarea',
        title: 'Admin Area',
        type : 'basic',
        icon : 'heroicons_outline:adjustments',
        link : '/adminarea',
        isAdmin: true,
        isGuest: false
    }
   

];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'feather:layout',
        link : '/dashboard'
    },
    {
        id   : 'events',
        title: 'Events',
        type : 'basic',
        icon : 'feather:bell',
        link : '/events'
    },
    
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
    {
        id   : 'events',
        title: 'Events',
        type : 'basic',
        icon : 'heroicons_outline:bell',
        link : '/events'
    },
    {
        id   : 'adminarea',
        title: 'Admin Area',
        type : 'basic',
        icon : 'heroicons_outline:adjustments',
        link : '/adminarea'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'feather:layout',
        link : '/dashboard'
    },
    {
        id   : 'events',
        title: 'Events',
        type : 'basic',
        icon : 'feather:bell',
        link : '/events'
    },
    
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
    {
        id   : 'events',
        title: 'Events',
        type : 'basic',
        icon : 'heroicons_outline:bell',
        link : '/events'
    },
    {
        id   : 'adminarea',
        title: 'Admin Area',
        type : 'basic',
        icon : 'heroicons_outline:adjustments',
        link : '/adminarea'
    }
];

//This is used for PC navaigation
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard',
        isAdmin: false,
        isGuest: false
    },
    {
        id   : 'events',
        title: 'Events',
        type : 'basic',
        icon : 'heroicons_outline:bell',
        link : '/events',
        isAdmin: false,
        isGuest: true
    },
    {
        id   : 'publicevents',
        title: 'Public Events',
        type : 'basic',
        icon : 'heroicons_outline:bell',
        link : '/public-events',
        isAdmin: false,
        isGuest: true
    },
    {
        id   : 'settings',
        title: 'Settings',
        type : 'basic',
        icon : 'heroicons_outline:cog',
        link : '/settings',
        isAdmin: false,
        isGuest: false
    },
    {
        id   : 'adminarea',
        title: 'Admin Area',
        type : 'basic',
        icon : 'heroicons_outline:adjustments',
        link : '/adminarea',
        isAdmin: true,
        isGuest: false
    }
];
