export class approvalImage {
    imageId: number;
    eventId: number;
    size: number;
    createdAt: Date;
    isDeleted: boolean;
    isPublic: boolean;
    title: string;
    description: string;
    tags: string;
    userId: number;
    price: number;
    totalDownloads: number;
    totalView: number;
    imageGuid: string;
    isModerationApproved: boolean;
    labels: string;
    labelObject: string;
    moderationObject: string;
    sizeUnit: string;
    format: string;
    watermarkedImageUrl: string;
    thumbnailImageUrl: string;
    isOwner: boolean;
    userDetails: UserDetails;
}
export interface UserDetails {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    isNewUser: boolean;
    isAdmin: boolean;
    isGuest: boolean;
    isPhotographer: boolean;
}
