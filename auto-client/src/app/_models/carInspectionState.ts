export interface CarInspectionState {
    Message:string;
    Count:number;
    Results:Results[];

}


export interface Results{
    ContactFirstName:  null;
    ContactLastName:   null;
    Organization:      string;
    AddressLine1:      string;
    City:              string;
    State:             string;
    Zip:               string;
    Email:             null;
    Fax:               null;
    Phone1:            string;
    CPSWeekEventFlag:  string;
    LastUpdatedDate:   Date;
    MobileStationFlag: string;
    CountiesServed:    null;
    LocationLatitude:  number;
    LocationLongitude: number;
}