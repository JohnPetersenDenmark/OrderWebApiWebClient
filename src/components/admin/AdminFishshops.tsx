

import React, { useEffect, useState } from 'react';

import { FishShopFullDto } from '../../types/FishShop';

import FishShopCreateEdit from '../FishShopCreateEdit';

import { AxiosClientGet, AxiosClientPost, AxiosClientDelete } from '../../types/AxiosClient';

const AdminFishshop: React.FC = () => {

  const [fishShops, setFishshops] = useState<FishShopFullDto[]>([]);
  
  const [isCreateEditFishShopModalOpen, setIsCreateEditFishShopModalOpen] = useState(false);
  const [fishShopToEdit, setFishShopToEdit] = useState<FishShopFullDto | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  
    const [error, setError] = useState<string | null>(null);
    
    var x = 1;
       useEffect(() => {
       
           const fetchData = async () => {
       
             try {
               const fishShopResponse: any = await AxiosClientGet('/Admin/fishshoplist', true);
       
               setFishshops(fishShopResponse);
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
       
       
         }, [isCreateEditFishShopModalOpen, submitting]);

           const handleEdit = (fishShop: FishShopFullDto) => {
             setFishShopToEdit(fishShop);
             setIsCreateEditFishShopModalOpen(true);
           };
         
           const handleDelete = (fishShop: FishShopFullDto) => {
             if (fishShop) {
               const deleteFishShop = async () => {
                 try {
                   setSubmitting(true);
         
                   await AxiosClientDelete('/Admin/XXXXCCCC/' + fishShop.id, true)
         
         
                 } catch (error) {
                   setError('Fejl');
                   console.error(error);
                 } finally {
                   setSubmitting(false);
                   setReload(prev => prev + 1);
                 }
               };
               deleteFishShop();
         
             }
           };
         
           const handleNewOperatingArea = () => {
             setIsCreateEditFishShopModalOpen(true);
             setFishShopToEdit(null);
         
           };
         
           const handleCloseCreateEditEmployeeModal = () => {
             setFishShopToEdit(null);
             setIsCreateEditFishShopModalOpen(false);
             setReload(prev => prev + 1);
           };
         

     return (
    <div
      className="location-frame"
      style={{
        border: '1px solid grey',
        borderRadius: '5px',
        fontSize: '20px',
        color: '#22191b',
        fontWeight: 200,

        margin: 'auto',
      }}
    >

      <FishShopCreateEdit
        isOpen={isCreateEditFishShopModalOpen}
        fishShopToEdit={fishShopToEdit}
        onClose={handleCloseCreateEditEmployeeModal} />

      <div style={{
        fontSize: '2rem',
        fontWeight: 600,
        color: '#22191b',
        margin: '20px',
        textAlign: 'center' as const,
      }}>Biler</div>

      <div style={{ margin: 'auto', padding: '1rem' }}>
        {fishShops && fishShops.map((fishShop) => (
          <div key={fishShop.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', border: '1px solid grey', borderRadius: '5px', background: '#ffffff', }}>
            <div style={{ flex: '2', padding: '0.5rem' }}>{fishShop.name}</div>           
            <div style={{ flex: '3', padding: '0.5rem' }}>
              <img
                src="/images/edit-icon.png"
                alt="Edit"
                onClick={() => handleEdit(fishShop)}
                style={{ cursor: 'pointer', width: '28px', height: '28px' }}
              />
            </div>

            <div style={{ flex: '4', padding: '0.5rem' }}>
              <img
                src="/images/delete-icon.png"
                alt="Delete"
                onClick={() => handleDelete(fishShop)}
                style={{ cursor: 'pointer', width: '28px', height: '28px' }}
              />
            </div>

          </div>
        ))}
      </div>
      <style>
        {`
          @media (max-width: 768px) {    
          .location-frame {
                      background-color: #8d4a5b;
      }
    }
  `}
      </style>
      <div
        style={{
          border: '1px dashed #ccc',
          padding: '1rem',
          borderRadius: '8px',
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={handleNewOperatingArea}
      >
        <img
          src="/images/new-icon.png"
          alt="Ny"
          style={{ width: '28px', height: '28px' }}
        />
      </div>
    </div>

  )
}

export default AdminFishshop