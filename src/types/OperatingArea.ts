
import { TemplateSchedule } from "./TemplateSchedule";
import { SaleLocation } from "./SaleLocation";

  interface OperatingArea {
  id: number;
  name: string;
  //locationids : number[];
  locations : SaleLocation[];
  templateSchedules : TemplateSchedule[];
}

export default OperatingArea