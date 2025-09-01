
import React, { useEffect, useState } from 'react';
export default function Layout() {

    const [selectedMenuPoint, setSelectedMenuPoint] = useState(0);

    function handleMenuSelection (menuItem : number)
    {
        setSelectedMenuPoint (menuItem) ;
    }

    return (
        <div className="flex">
            {/* Column 1 */}
            <div className="flex-1 bg-customBlue text-white p-4 text-center">
                <img src="/images/jjfisk_logo.svg" alt="Logo" height={100} width={100} />
            </div>

            {/* Column 2 with nested row */}
            <div className="flex-1 bg-customBlue text-white p-4">
                <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-customBlue text-2xl p-2">
                        <span
                            onClick={() => handleMenuSelection(1)}
                            className={`cursor-pointer hover:text-hoverYellow ${selectedMenuPoint == 1 ? 'text-hoverYellow' : 'text-white'  }`} >                                                     
                            FORSIDE
                        </span>
                    </div>
                    <div className="bg-customBlue text-2xl p-2">
                        <span
                            onClick={() => handleMenuSelection(2)}
                            className={`cursor-pointer hover:text-hoverYellow ${selectedMenuPoint == 2 ? 'text-hoverYellow' : 'text-white'  }`} >                                                     
                            NYHEDER
                        </span>
                        </div>
                    <div className="bg-customBlue text-2xl p-2">
                        <span
                            onClick={() => handleMenuSelection(3)}
                            className={`cursor-pointer hover:text-hoverYellow ${selectedMenuPoint == 3  ? 'text-hoverYellow' : 'text-white'  }`} >                                                     
                            OM OS
                        </span>
                        </div>
                    <div className="bg-customBlue text-2xl p-2">
                        <span
                            onClick={() => handleMenuSelection(4)}
                            className={`cursor-pointer hover:text-hoverYellow ${selectedMenuPoint == 4  ? 'text-hoverYellow' : 'text-white'  }`} >                                                     
                           KONTAKT
                        </span>
                        </div>
                </div>
            </div>

            {/* Column 3 */}
            <div className="flex-1 bg-customBlue text-white p-4 text-center">
                Column 3
            </div>
        </div>
    );
}