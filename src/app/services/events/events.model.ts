

export interface eventsModel {
    eventId: number;
    eventName: string;
    isPublic: boolean;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    isActive: boolean;
    userId: number;
    image: imageModel[];
    isSharedEvent: boolean;
    haveReadPermission: boolean;
    haveWritePermission: boolean;
    haveUploadPermission: boolean;
    haveDeletePermission: boolean;
    isOwner: boolean;
}

export class eventBaseModel {
    eventName: string;
    price: number;
    isPublic: boolean;
}
export interface imageModel {
    imageId: number;
    eventId: number;
    size: number;
    createdAt: Date;
    isDeleted: boolean;
    isOwner: boolean;
    isPublic: boolean;
    title: string;
    folderName: string;
    description: string;
    tags: string;
    userId: number;
    price: number;
    totalDownloads: number;
    totalView: number;
    event: string;
    imageType: string;
    imageUrl: string;
    watermarkedImageUrl: string;
    imageGuid: string;
    thumbnailImageUrl: string;
    format:string;
}

export class uploadImageModel {
    imageFile: any;
    eventId: number;
    isPublic: boolean;
    title: string;
    description: string;
    tags: string;
    userId: number;
    price: number;
}
export class uploadmultiImageModel {
    imageFile: any[];
    eventId: number;
    isPublic: boolean;
    title: string;
    description: string;
    tags: string;
    price: number;
}

export class eventByIdmodel {
    eventId: number;
    eventName: string;
    isPublic: boolean;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    isActive: boolean;
    userId: number;
    user: User;
    eventPermission: EventPermission[];
    imageCount: number;
    images: string[];
    isOwner: boolean;
    haveDeletePermission: boolean;
    haveReadPermission: boolean;
    haveUploadPermission: boolean;
    haveWritePermission: boolean;
}
export class User {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    mobile: number;
    profilePhoto: string;
}

export interface EventPermission {
    eventPermisionId: number;
    userId: number;
    expiresAt: Date;
    createdAt: Date;
    haveReadPermission: boolean;
    haveWritePermission: boolean;
}