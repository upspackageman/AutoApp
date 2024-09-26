export interface VehicleCrashRating {
    Message:string;
    Count:number;
    Results:Results[];
}

export interface Results{
    VehiclePicture:                           string;
    OverallRating:                            string;
    OverallFrontCrashRating:                  string;
    FrontCrashDriversideRating:               string;
    FrontCrashPassengersideRating:            string;
    FrontCrashPicture:                        string;
    OverallSideCrashRating:                   string;
    SideCrashDriversideRating:                string;
    SideCrashPassengersideRating:             string;
    SideCrashPicture:                         string;
    SidePolePicture:                          string;
    "combinedSideBarrierAndPoleRating-Front": string;
    "combinedSideBarrierAndPoleRating-Rear":  string;
    "sideBarrierRating-Overall":              string;
    RolloverRating:                           string;
    RolloverRating2:                          string;
    RolloverPossibility:                      number;
    RolloverPossibility2:                     number;
    dynamicTipResult:                         string;
    SidePoleCrashRating:                      string;
    NHTSAElectronicStabilityControl:          string;
    NHTSAForwardCollisionWarning:             string;
    NHTSALaneDepartureWarning:                string;
    ComplaintsCount:                          number;
    RecallsCount:                             number;
    InvestigationCount:                       number;
    ModelYear:                                number;
    Make:                                     string;
    Model:                                    string;
    VehicleDescription:                       string;
    VehicleId:                                number;
    FrontCrashVideo:                          any;
    SideCrashVideo:                           any;
    SidePoleVideo:                            any;
}
