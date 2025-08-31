

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

                /*   const tmpLocationNames = fishShops
                      .flatMap(fishshop => fishshop.area?.locations || []) // flatten arrays
                      .map(location => location?.locationname)                     // extract names
                      .filter(Boolean)                                     // remove null/undefined
                      .join(", ");
   */
                if (fishShopResponse.length > 0) {
                    const locationNamesPerShop = fishShopResponse.map( (shop : any) =>
                        shop.area?.locations
                            ?.map( (loc : any)  => loc?.locationname)
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


    return (
        <div style={{ color: '#ffffff', display: 'grid', gridTemplateColumns: '1fr ', textAlign: 'center' }}>
            <br />
            <div style={{ fontSize: '30px' }}>

                <br /><br />
                <hr
                    style={{
                        height: '1px',
                        backgroundColor: '#999',
                        border: 'none',
                        width: '30%',
                        margin: '0 auto'
                    }}
                />
            </div>
            {fishShops && fishShops.map((fishShop, index) => (
                <React.Fragment key={fishShop.id}>

                    <div style={{ fontSize: '20px', marginTop: '15px' }}>

                        <p>
                            {fishShop.area?.name}
                        </p>
                        <p>
                            {locationNames[index]}
                        </p>

                         <p>
                           Kontakt {fishShop.employee?.name} på telefon {fishShop.employee?.phone} i vognens åbningstid.                          
                        </p>

                          <p>                         
                           Du kan også sende en email til : {fishShop.employee?.email}
                        </p>
                    </div>


                    <div style={{ color: '#000000', fontSize: '20px' }}></div>
                    <div style={{ fontSize: '20px' }}>
                        <br /><br />
                        <hr
                            style={{
                                height: '1px',
                                backgroundColor: '#999',
                                border: 'none',
                                width: '20%',
                                margin: '0 auto'
                            }}
                        />
                    </div>

                </React.Fragment>
            ))}
        </div>
    )
}

export default DisplayListFishShopCalendar