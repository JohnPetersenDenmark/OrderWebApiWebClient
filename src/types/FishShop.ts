import { Employee } from "./Employee";
import  OperatingArea  from "./OperatingArea";

export interface FishShop {
  id: number;
  name: string;
  operatingareaid : number | undefined;
  employeeid : number | undefined
}

