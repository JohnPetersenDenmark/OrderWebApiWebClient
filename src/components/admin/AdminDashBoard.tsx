import React, { useEffect, useState } from 'react';

import AdminPlaces from './AdminPlaces'
import AdminCalendar from './AdminCalendar'
import AdminOrders from './AdminOrders'
import AdminAllOrders from './AdminAllOrders'
import AdminMenues from './AdminMenues'
import AdminFishShops from './AdminFishshops'
import AdminEmployee from './AdminEmployee';
import AdminOperatingArea from './AdminOperatingArea';
import AdminProductCategories from './AdminProductCategories';
import AdminProductTypes from './AdminProductTypes';
import { useNavigate } from "react-router-dom";

import RevenuePerTimePeriod from '../Statistic/RevenuePerTimePeriod'

import AdminSettings from './AdminSettings'
import AdminUsers from './AdminUsers'
import AdminPackingList from './AdminPackingList';
import { CurrentUser, useCurrentUser } from "../../components/CurrentUser";
import { useDashboardContext } from "./DashboardContext";

interface DashboardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface MenuPoint {
    clickableText: string;
    component: React.ComponentType; // points to actual component
}
// const AdminDashBoard: React.FC<DashboardModalProps> = ({ isOpen, onClose }) => {
const AdminDashBoard: React.FC = () => {

    const { user, authStatus } = useCurrentUser();
    const [selectedMenuPoint, setSelectedMenuPoint] = useState(0);
    const navigate = useNavigate();

    const { isOpen, setIsOpen } = useDashboardContext();

    const handleClose = () => {
        setIsOpen(false);
    };

    function handleMenuSelection(menuItem: number) {
        setSelectedMenuPoint(menuItem);
        /*  if (menuItem === 5) {
             navigate("/admin")
         } */
    }

    const menuArray: MenuPoint[] = [];

 let newMenuPoint = {
        clickableText: "Ordrer",
        component: AdminOrders
    }
     menuArray.push(newMenuPoint)


     newMenuPoint = {
        clickableText: "Produkter",
        component: AdminMenues
    }
     menuArray.push(newMenuPoint)


     newMenuPoint = {
        clickableText: "Brugere",
        component: AdminUsers

    }    
    menuArray.push(newMenuPoint)

    
      newMenuPoint = {
        clickableText: "Biler",
        component: AdminFishShops
    }
    menuArray.push(newMenuPoint)

      newMenuPoint = {
        clickableText: "Stadepladser",
        component: AdminPlaces
    }
    menuArray.push(newMenuPoint)

        newMenuPoint = {
        clickableText: "Områder",
        component: AdminOperatingArea
    }
    menuArray.push(newMenuPoint)

            newMenuPoint = {
        clickableText: "Medarbejdere",
        component: AdminEmployee
    }
    menuArray.push(newMenuPoint)

                newMenuPoint = {
        clickableText: "Produktkategorier",
        component: AdminProductCategories
    }
    menuArray.push(newMenuPoint)

   

     menuArray.push(newMenuPoint)

                newMenuPoint = {
        clickableText: "Produkttyper",
        component:  AdminProductTypes
    }
    menuArray.push(newMenuPoint)



    

    return (
        <>
              <div className="flex flex-col gap-60  bg-customBlue">
                <div className="flex">
                    {/* Column 1 */}
                    <div className="flex-1  text-white p-4 text-center">
                        <img src="/images/jjfisk_logo.svg" alt="Logo" height={100} width={100} />
                    </div>

                    {/* Column 2 with nested row */}
                    <div className="flex-5 text-white p-4">
                       <div className="grid grid-cols-10 gap-2 text-center">
                           {menuArray.map((menuPoint, index) => (
                            <>
                                <div
                                    className={`cursor-pointer hover:text-hoverYellow ${selectedMenuPoint == index ? 'text-hoverYellow' : 'text-white'}`}
                                    onClick={() => handleMenuSelection(index)}
                                >
                                    {menuPoint.clickableText}
                                </div>
                            </>
                        ))}
                          </div>
                    </div>

                    {/* Column 3 */}
                    <div className="flex-1 text-white p-4 text-center">
                        Column 3
                    </div>
                </div>

                </div>

                {menuArray[selectedMenuPoint]?.component
                    ? React.createElement(menuArray[selectedMenuPoint].component)
                    : ''}


            
        </>

    )
}

export default AdminDashBoard;