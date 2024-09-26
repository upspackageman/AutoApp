export interface VehicleByYear{
    Count: number;
  Message: string;
  Results: Results[];
}

export interface Results {
  ModelYear: number;
  Make:      string;
  Model:     string;
  VehicleId: number;
  
}
