import { Employee } from "./Employee";
import  OperatingArea  from "./OperatingArea";

export interface FishShopLightDto {
  id: number;
  name: string;
  operatingareaid : number | undefined;
  employeeid : number | undefined
}

export interface FishShopFullDto {
  id: number;
  name: string; 
  area : OperatingArea | undefined;
  employee : Employee | undefined
    operationAreaId : number | undefined;
  employeeId : number | undefined
}

