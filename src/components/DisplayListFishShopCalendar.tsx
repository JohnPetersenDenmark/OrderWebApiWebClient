

import React, { useEffect, useState } from 'react';
import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { FishShopFullDto } from '../types/FishShop';

import { SaleLocation } from '../types/SaleLocation';
import { TemplateSchedule } from '../types/TemplateSchedule';

import { AxiosClientGet, AxiosClientPost, AxiosClientDelete } from '../types/AxiosClient';

interface FishShopToSelectProps {
    onSelect: (shop: FishShopFullDto, schedule: TemplateSchedule) => void;
}

const DisplayListFishShopCalendar: React.FC<FishShopToSelectProps> = ({ onSelect }) => {

    const [fishShops, setFishshops] = useState<FishShopFullDto[]>([]);

    const [locationNames, setLocationNames] = useState<string[]>([]);

    const [locationsVisible, setLocationsVisible] = useState<boolean[]>([]);

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
                    const locationNamesPerShop = fishShopResponse.map((shop: any, index: number) =>

                        shop.area?.locations
                            ?.map((loc: any) => loc?.locationname)
                            .filter(Boolean)
                            .join(", ") || "No locations"
                    );

                    setLocationNames(locationNamesPerShop);
                }
                const tmpLocationsVisible: boolean[] = [];

                if (fishShopResponse.length > 0) {
                    const locationNamesPerShop = fishShopResponse.map((shop: any, index: number) =>
                        tmpLocationsVisible[index] = false
                    );

                    setLocationsVisible(tmpLocationsVisible);

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

    weekDayNames[1] = 'Mandag'
    weekDayNames[2] = 'Tirsdag'
    weekDayNames[3] = 'Onsdag'
    weekDayNames[4] = 'Torsdag'
    weekDayNames[5] = 'Fredag'
    weekDayNames[6] = 'Lørdag'
    weekDayNames[7] = 'Søndag'

    const toggleLocationVisible = (index: number) => {
        setLocationsVisible((prevFlags) =>
            prevFlags.map((flag, i) => (i === index ? !flag : flag))
        );
    };

    const ConvertDate = (dateToConvert: any) => {
        const date = new Date(dateToConvert);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
        const year = date.getFullYear();

        return (`${day}-${month}-${year}`);
    };



    const handleSubmit = (fishShop: FishShopFullDto, templateSchedule: TemplateSchedule) => {
        onSelect(fishShop, templateSchedule);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center mt-4"
            style={{ textAlign: 'left', margin: '20px' }} // fixed column width
        >
            {fishShops?.map((fishShop, index) => (
                <div
                    key={index}
                    className="bg-white text-customBlue p-4 rounded-lg shadow text-xl"

                >
                    <p className="font-bold text-3xl">{fishShop.area?.name}</p>
                    <p className="text-black text-lg mt-5">{locationNames[index]}</p>

                    <p className="text-hoverYellow text-xl mt-5 font-bold">
                        Kontakt {fishShop.employee?.name} på telefon {fishShop.employee?.phone} i
                        vognens åbningstid.
                    </p>
                    <p className="text-hoverYellow text-xl font-bold">
                        Du kan også sende en email til : {fishShop.employee?.email}
                    </p>


                    {locationsVisible[index] ?
                        <p
                            className="text-black  mt-5 mb-5 font-bold text-1xl cursor-pointer"
                            onClick={() => toggleLocationVisible(index)}
                        >
                            <ChevronUp /> Se mindre
                            <hr />
                        </p>
                        :
                        <p className="text-black  mt-5 mb-5 font-bold text-1xl cursor-pointer"
                            onClick={() => toggleLocationVisible(index)}
                        >
                            <ChevronDown />  Se hvornår at vi er hos dig:
                            <hr />
                        </p>
                    }

                    {locationsVisible[index] ?
                        <>
                            {fishShop.area?.templateSchedules?.map((templateSchedule, tsIndex) => (
                                <>
                                    <div className="grid grid-cols-2 items-center text-black text-lg mt-5 mb-5" key={tsIndex}
                                        onClick={() => handleSubmit(fishShop, templateSchedule)}
                                    >
                                        <div>
                                            <div> {weekDayNames[templateSchedule.dayofweek]}{" "}</div>
                                            <div> {templateSchedule.locationname}</div>
                                        </div>
                                        <div>
                                            {templateSchedule.starttime} -{" "} {templateSchedule.endtime}
                                             {" ("}  {ConvertDate(templateSchedule.date)} {")"}
                                        </div>

                                    </div>
                                    <hr />
                                </>
                            ))} </>

                        : ''}
                </div>

            ))}
        </div>
    );
}

export default DisplayListFishShopCalendar