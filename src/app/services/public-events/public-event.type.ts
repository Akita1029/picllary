export interface PublicEvents{
    eventId     : number;
    eventName   : string;
    price       : number; 
    createdAt   : string;
    isActive    : boolean
    isDeleted   : boolean
    isPublic    : boolean
    updatedAt   : string
    imageCount  : number;
    images      : Array<string>;
    userId      : number;
    user        : EventUser;
}

export interface EventUser {
    userId      : number;
    email       : string;
    firstName   : string;
    lastName    : string;
    mobile      : number;
    profilePhoto: string;
}
