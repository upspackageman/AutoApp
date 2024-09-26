export interface Complaint {
   Message:string;
   Count:number;
    results:           Product[];
}

export interface Product {
    odiNumber:          number;
    manufacturer:       string;
    crash:              boolean;
    fire:               boolean;
    numberOfInjuries:   number;
    numberOfDeaths:     number;
    dateOfIncident:     string;
    dateComplaintFiled: string;
    vin:                string;
    components:         string;
    summary:            string;
}