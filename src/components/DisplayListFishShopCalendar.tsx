

import React, { useEffect, useState } from 'react';

import { FishShopFullDto } from '../types/FishShop';

import { SaleLocation } from '../types/SaleLocation';

import { AxiosClientGet, AxiosClientPost, AxiosClientDelete } from '../types/AxiosClient';

const DisplayListFishShopCalendar: React.FC = () => {

    const [fishShops, setFishshops] = useState<FishShopFullDto[]>([]);

    const [locationNames, setLocationNames] = useState<string[]>([]);

    const [isCreateEditFishShopModalOpen, setIsCreateEditFishShopModalOpen] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(0);

    const [error, setError] = useState<string | null>(null);



    useEffect(() => {

        const fetchData = async () => {
            try {
                const fishShopResponse: any = await AxiosClientGet('/Admin/fishshoplistSchedules', true);

                setFishshops(fishShopResponse);
        
                if (fishShopResponse.length > 0) {
                    const locationNamesPerShop = fishShopResponse.map((shop: any) =>
                        shop.area?.locations
                            ?.map((loc: any) => loc?.locationname)
                            .filter(Boolean)
                            .join(", ") || "No locations"
                    );

                    setLocationNames(locationNamesPerShop);
                }

                setLoading(false);

            } catch (err) {
                setError('Failed to load locations');
                setLoading(false);
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const weekDayNames: string[] = [];

    weekDayNames[0] = 'Mandag'
    weekDayNames[1] = 'Tirsdag'
    weekDayNames[2] = 'Onsdag'
    weekDayNames[3] = 'Torsdag'
    weekDayNames[4] = 'Fredag'
    weekDayNames[5] = 'Lørdag'
    weekDayNames[6] = 'Søndag'


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center mt-4"
           style={{ textAlign : 'left' , margin : '20px'}} // fixed column width
        >
            {fishShops?.map((fishShop, index) => (
                <div
                    key={index}
                    className="bg-white text-customBlue p-4 rounded-lg shadow text-xl"
                    
                >
                    <div className="font-bold">{fishShop.area?.name}</div>
                    <p  className="text-black text-lg">{locationNames[index]}</p>
                    
                    <p className="text-hoverYellow text-xl">
                        Kontakt {fishShop.employee?.name} på telefon {fishShop.employee?.phone} i
                        vognens åbningstid.
                    </p>
                      <p className="text-hoverYellow text-xl">
                        Du kan også sende en email til : {fishShop.employee?.email}</p>
                    <p className="text-black text-lg">Vi er hos dig:</p>

                    {fishShop.area?.templateSchedules?.map((templateSchedule, tsIndex) => (
                        <p className="text-black text-lg" key={tsIndex}>
                            {weekDayNames[templateSchedule.dayofweek]}{" "}
                            {templateSchedule.locationname} {templateSchedule.starttime} -{" "}
                            {templateSchedule.endtime}
                        </p>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default DisplayListFishShopCalendar