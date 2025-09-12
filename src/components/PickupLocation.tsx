
import { useState } from 'react';
import { TemplateSchedule } from '../types/TemplateSchedule';

interface PickupLocationProps {
    templateScedule: TemplateSchedule;
}

const PickupLocation: React.FC<PickupLocationProps> = ({ templateScedule }) => {

    const date = new Date(templateScedule.date);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = date.getFullYear();

    const dateToDisplay = `${day}-${month}-${year}`;
  

    return (
        <div className="text-2xl p-4 bg-gray-50 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-2">
                Afhentning:
            </h2>

            <div className="text-xl" >
                {dateToDisplay} mellem {templateScedule.starttime} - {templateScedule.endtime}
            </div>

              <div className="text-xl" >
                {templateScedule.locationname}
            </div>


              <div className="text-xl" >
                {templateScedule.location.address}
            </div>



        </div>
    );
}

export default PickupLocation