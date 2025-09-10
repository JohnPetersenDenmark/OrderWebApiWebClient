import { SaleLocation } from "./SaleLocation";

export interface TemplateSchedule {
  id: number;
  operationareaid: number;
  name: string;
  locationname: string,
  locationid: number,
  dayofweek: number,
  starttime: string;
  endtime: string;
  date : string
location : SaleLocation
}