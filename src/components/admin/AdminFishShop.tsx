
import React, { useEffect, useState } from 'react';
import { FishShop } from '../../types/FishShop';

import { AxiosClientGet, AxiosClientPost, AxiosClientDelete } from '../../types/AxiosClient';

const AdminFishShop: React.FC = () => {

  const [fishshops, setFishShops] = useState<FishShop[]>([]);
  const [isCreateEditLocationModalOpen, setIsCreateEditLocationModalOpen] = useState(false);
  const [locationToEdit, setLocationToEdit] = useState<FishShop | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
    const [error, setError] = useState<string | null>(null);
    
       useEffect(() => {
       
           const fetchData = async () => {
       
             try {
               const fishshopResponse: any = await AxiosClientGet('/Home/fishshoplist', true);
       
               setFishShops(fishshopResponse);
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
       
       
         }, [isCreateEditLocationModalOpen, submitting]);

    return(<></>)
}

export default AdminFishShop