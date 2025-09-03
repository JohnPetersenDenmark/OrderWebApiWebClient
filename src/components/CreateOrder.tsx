
import { FishShopFullDto } from '../types/FishShop';
import { TemplateSchedule } from '../types/TemplateSchedule';
import { useLocation } from "react-router-dom";

export default function CreateOrder() {

    const location = useLocation();
    const { fishShop, templateScedule } = (location.state as { fishShop: FishShopFullDto; templateScedule: TemplateSchedule }) || {};
    
    var x = fishShop;
    var y = templateScedule
    return (<></>);

}

