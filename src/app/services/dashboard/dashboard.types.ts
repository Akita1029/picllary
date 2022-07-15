export interface DashboardType{
    eventStatistics: {
        totalEvents: number,
        totalPrivateEvents: number,
        totalPublicEvents: number,
        totalSharedEvents: number,
        accessToExternalEvents: number
    };
    userStatistics:{
        allowedImageCount: number;
        allowedStorage: number;
        sizeUnit: string
        totalImageCount: number;
        usedStorage: number;
    }

}