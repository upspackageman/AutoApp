export interface VehicleCrashRatingId {
    Message: string;
    Count:number;
    Results:Results[];
}


export interface Results{
    VehicleDescription: string;
    VehicleId:          number;
    
}