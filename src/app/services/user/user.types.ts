export interface User {
    firstName: string;
    lastName: string;
    email: string;
    profilePhoto: string;
    userId: number;
    discloseLocation: boolean;
    latitude: number;
    longitude: number;
    mobile: number;
    profession: string;
    stripeId: number;
    country: Country;
    interest: any;
    status: boolean;
    isPublic?: boolean;
    isPhotographer?: boolean;
    token?: string;
    aboutMe: string;
    isAdmin?: boolean;
    isGuest?: boolean;
}


export interface Country {
    countryId: number;
    name: string;
    code: string;
}