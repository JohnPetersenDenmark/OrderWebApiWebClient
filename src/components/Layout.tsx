
import React, { useEffect, useState } from 'react';

import {  useNavigate } from "react-router-dom";
import CreateOrder from './CreateOrder';
import DisplayListFishShopCalendar from './DisplayListFishShopCalendar';
import { FishShopFullDto } from '../types/FishShop';
import { TemplateSchedule } from '../types/TemplateSchedule';
export default function Layout() {

    const [selectedMenuPoint, setSelectedMenuPoint] = useState(0);
    const navigate = useNavigate();

    function handleMenuSelection(menuItem: number) {
        setSelectedMenuPoint(menuItem);
        if (menuItem === 5) {
            navigate("/admin")
        }
    }

      function handleSelectedFishShop( fishShop : FishShopFullDto, templateScedule : TemplateSchedule) {
       
        navigate("/createOrder", { state: { fishShop, templateScedule } });
    }

    return (
        <>
           {selectedMenuPoint === 5 ? "<main></main>" : ''}
          
            <div className="flex flex-col gap-60  bg-customBlue">
                <div className="flex">
                    {/* Column 1 */}
                    <div className="flex-1  text-white p-4 text-center">
                        <img src="/images/jjfisk_logo.svg" alt="Logo" height={100} width={100} />
                    </div>

                    {/* Column 2 with nested row */}
                    <div className="flex-1 text-white p-4">
                        <div className="grid grid-cols-5 gap-2 text-center">
                            <div className="text-2xl p-2">
                                <span
                                    onClick={() => handleMenuSelection(1)}
                                    className={`cursor-pointer hover:text-hoverYellow ${selectedMenuPoint == 1 ? 'text-hoverYellow' : 'text-white'}`} >
                                    FORSIDE
                                </span>
                            </div>
                            <div className="text-2xl p-2">
                                <span
                                    onClick={() => handleMenuSelection(2)}
                                    className={`cursor-pointer hover:text-hoverYellow ${selectedMenuPoint == 2 ? 'text-hoverYellow' : 'text-white'}`} >
                                    NYHEDER
                                </span>
                            </div>
                            <div className="text-2xl p-2">
                                <span
                                    onClick={() => handleMenuSelection(3)}
                                    className={`cursor-pointer hover:text-hoverYellow ${selectedMenuPoint == 3 ? 'text-hoverYellow' : 'text-white'}`} >
                                    OM OS
                                </span>
                            </div>
                            <div className="text-2xl p-2">
                                <span
                                    onClick={() => handleMenuSelection(4)}
                                    className={`cursor-pointer hover:text-hoverYellow ${selectedMenuPoint == 4 ? 'text-hoverYellow' : 'text-white'}`} >
                                    KONTAKT
                                </span>
                            </div>
                            <div className="text-2xl p-2">
                                <span
                                    onClick={() => handleMenuSelection(5)}
                                    className={`cursor-pointer hover:text-hoverYellow ${selectedMenuPoint == 4 ? 'text-hoverYellow' : 'text-white'}`} >
                                    ADMINISTRATION
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Column 3 */}
                    <div className="flex-1 text-white p-4 text-center">
                        Column 3
                    </div>
                </div>

                <div className="flex flex-col gap-20  bg-customBlue">
                    <div>
                        <div className="flex">
                            <div className="flex-1 text-white p-4 text-6xl">
                                <div className="flex-1 text-center">
                                    JJ Fisk - en seriøs
                                </div>
                            </div>
                        </div>

                        <div className="flex">
                            <div className="flex-1 text-white p-4 text-6xl">
                                <div className="text-center">
                                    fiskehandler
                                </div>
                            </div>
                        </div>

                    </div>
                    <div>
                        <div className="flex justify-center gap-10">
                            <div className="bg-hoverYellow hover:bg-hoverYellowLight p-4 transition">
                                <span className="text-white text-2xl cursor-pointer" onClick={() => handleMenuSelection(1)}>
                                    Find os her
                                </span>
                            </div>

                            <div className="text-white bg-customBlue text-2xl hover:bg-white p-4 hover:text-black border-4 text-center">
                                <span
                                    onClick={() => handleMenuSelection(4)}
                                    className={"cursor-pointe"}
                                >
                                    Kontakt os
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            </div>


            <div className="flex flex-col gap-10  bg-white text-center" >
                <div>

                </div>
                <div className="text-hoverYellow text-2xl">
                    VI KØRER I HELE MIDTJYLLAND
                </div>
                <div className="text-customBlue text-4xl">
                    Friske fisk i Aarhus og Midtjylland
                </div>

                <div className="text-black text-1xl">
                    J Fisk holder til i Hasselager, hvor vi producerer alle vores varer og pakker vores fiskebiler op hver morgen. I kan her på siden se i hvilket område de 6 mobile fiskevogne holder til. I kan følge os på Facebook eller kontakte bilerne direkte i åbningstiden.
                </div>
                <div></div>
            </div>


            <div className="flex flex-col gap-10  bg-customGreyLight text-center" >

                <div></div>
                <div className="text-hoverYellow text-3xl" >
                    Her finder du vores 6 mobile fiskeforretninger
                </div>
 
                <DisplayListFishShopCalendar onSelect={handleSelectedFishShop} />
            </div>
        </>
    );
}