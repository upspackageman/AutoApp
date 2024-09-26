export interface Recall {
    Count: number;
    Message: string;
    results:Results[];
}


export interface Results {
    Manufacturer:        string;
    NHTSACampaignNumber: string;
    ReportReceivedDate:  string;
    Component:           string;
    Summary:             string;
    Consequence:         string;
    Remedy:              string;
    Notes:               string;
    ModelYear:           string;
    Make:                string;
    Model:               string;
    
}