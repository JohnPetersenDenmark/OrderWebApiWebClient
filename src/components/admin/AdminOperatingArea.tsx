

import React, { useEffect, useState } from 'react';
import OperatingArea from "../../types/OperatingArea";
import OperatingAreaCreateEdit from '../OperatingAreaCreateEdit';

import { AxiosClientGet, AxiosClientPost, AxiosClientDelete } from '../../types/AxiosClient';

const AdminOperatingArea: React.FC = () => {

  const [operatingAreas, setOperatingAreas] = useState<OperatingArea[]>([]);
  
  const [isCreateEditoperatingAreaResponseModalOpen, setIsCreateEditoperatingAreaResponseModalOpen] = useState(false);
  const [operatingAreaToEdit, setOperatingAreaToEdit] = useState<OperatingArea | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  
    const [error, setError] = useState<string | null>(null);
    
       useEffect(() => {
       
           const fetchData = async () => {
       
             try {
               const operatingAreaResponse: any = await AxiosClientGet('/Admin/operatingarealist', true);
       
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

           const handleEdit = (operatingArea: OperatingArea) => {
             setOperatingAreaToEdit(operatingArea);
             setIsCreateEditoperatingAreaResponseModalOpen(true);
           };
         
           const handleDelete = (operatingArea: OperatingArea) => {
             if (operatingArea) {
               const deleteUser = async () => {
                 try {
                   setSubmitting(true);
         
                   await AxiosClientDelete('/Admin/XXXXCCCC/' + operatingArea.id, true)
         
         
                 } catch (error) {
                   setError('Fejl');
                   console.error(error);
                 } finally {
                   setSubmitting(false);
                   setReload(prev => prev + 1);
                 }
               };
               deleteUser();
         
             }
           };
         
           const handleNewOperatingArea = () => {
             setIsCreateEditoperatingAreaResponseModalOpen(true);
             setOperatingAreaToEdit(null);
         
           };
         
           const handleCloseCreateEditEmployeeModal = () => {
             setOperatingAreaToEdit(null);
             setIsCreateEditoperatingAreaResponseModalOpen(false);
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

      <OperatingAreaCreateEdit
        isOpen={isCreateEditoperatingAreaResponseModalOpen}
        operatingAreaToEdit={operatingAreaToEdit}
        onClose={handleCloseCreateEditEmployeeModal} />

      <div style={{
        fontSize: '2rem',
        fontWeight: 600,
        color: '#22191b',
        margin: '20px',
        textAlign: 'center' as const,
      }}>Brugere</div>

      <div style={{ margin: 'auto', padding: '1rem' }}>
        {operatingAreas && operatingAreas.map((operatingArea) => (
          <div key={operatingArea.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', border: '1px solid grey', borderRadius: '5px', background: '#ffffff', }}>
            <div style={{ flex: '2', padding: '0.5rem' }}>{operatingArea.name}</div>           
            <div style={{ flex: '3', padding: '0.5rem' }}>
              <img
                src="/images/edit-icon.png"
                alt="Edit"
                onClick={() => handleEdit(operatingArea)}
                style={{ cursor: 'pointer', width: '28px', height: '28px' }}
              />
            </div>

            <div style={{ flex: '4', padding: '0.5rem' }}>
              <img
                src="/images/delete-icon.png"
                alt="Delete"
                onClick={() => handleDelete(operatingArea)}
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

export default AdminOperatingArea