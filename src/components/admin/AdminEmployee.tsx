
import React, { useEffect, useState } from 'react';
import { Employee } from '../../types/Employee';

import { AxiosClientGet, AxiosClientPost, AxiosClientDelete } from '../../types/AxiosClient';
import EmployeeCreateEdit from '../EmployeeCreateEdit';

const AdminEmployee: React.FC = () => {

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isCreateEditEmployeeModalOpen, setIsCreateEditEmployeeModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  
    const [error, setError] = useState<string | null>(null);
    
       useEffect(() => {
       
           const fetchData = async () => {
       
             try {
               const employeesResponse: any = await AxiosClientGet('/Admin/employeelist', true);
       
               setEmployees(employeesResponse);
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
       
       
         }, [isCreateEditEmployeeModalOpen, submitting]);

  const handleEdit = (user: Employee) => {
    setEmployeeToEdit(user);
    setIsCreateEditEmployeeModalOpen(true);
  };

  const handleDelete = (user: Employee) => {
    if (user) {
      const deleteUser = async () => {
        try {
          setSubmitting(true);

          await AxiosClientDelete('/Login/removeuser/' + user.id, true)


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

  const handleNewEmployee = () => {
    setIsCreateEditEmployeeModalOpen(true);
    setEmployeeToEdit(null);

  };

  const handleCloseCreateEditEmployeeModal = () => {
    setEmployeeToEdit(null);
    setIsCreateEditEmployeeModalOpen(false);
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

      <EmployeeCreateEdit
        isOpen={isCreateEditEmployeeModalOpen}
        employeeToEdit={employeeToEdit}
        onClose={handleCloseCreateEditEmployeeModal} />

      <div style={{
        fontSize: '2rem',
        fontWeight: 600,
        color: '#22191b',
        margin: '20px',
        textAlign: 'center' as const,
      }}>Medarbejdere</div>

      <div style={{ margin: 'auto', padding: '1rem' }}>
        {employees && employees.map((employee) => (
          <div key={employee.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', border: '1px solid grey', borderRadius: '5px', background: '#ffffff', }}>
            <div style={{ flex: '2', padding: '0.5rem' }}>{employee.name}</div>           
            <div style={{ flex: '3', padding: '0.5rem' }}>
              <img
                src="/images/edit-icon.png"
                alt="Edit"
                onClick={() => handleEdit(employee)}
                style={{ cursor: 'pointer', width: '28px', height: '28px' }}
              />
            </div>

            <div style={{ flex: '4', padding: '0.5rem' }}>
              <img
                src="/images/delete-icon.png"
                alt="Delete"
                onClick={() => handleDelete(employee)}
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
        onClick={handleNewEmployee}
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

export default AdminEmployee