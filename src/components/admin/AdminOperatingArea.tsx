

import React, { useEffect, useState } from 'react';
import { OperatingArea } from '../../types/OperatingArea';

import { AxiosClientGet, AxiosClientPost, AxiosClientDelete } from '../../types/AxiosClient';

const AdminOperatingArea: React.FC = () => {

  const [operatingAreas, setOperatingAreas] = useState<OperatingArea[]>([]);
  const [isCreateEditoperatingAreaResponseModalOpen, setIsCreateEditoperatingAreaResponseModalOpen] = useState(false);
  const [operatingAreaEdit, setOperatingAreaToEdit] = useState<OperatingArea | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
    const [error, setError] = useState<string | null>(null);
    
       useEffect(() => {
       
           const fetchData = async () => {
       
             try {
               const operatingAreaResponse: any = await AxiosClientGet('/Home/XXXXXX', true);
       
               setOperatingAreas(operatingAreaResponse);
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
       
       
         }, [isCreateEditoperatingAreaResponseModalOpen, submitting]);

    return(<></>)
}

export default AdminOperatingArea