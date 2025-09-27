import React, { useEffect, useState } from 'react';
import { AxiosClientGet, AxiosClientPost } from '../types/AxiosClient';
import { User } from '../types/User';
import { Employee } from '../types/Employee';

interface RegisterModalProps {
    isOpen: boolean;
    employeeToEdit: Employee | null;
    onClose: () => void;
}

const EmployeeCreateEdit: React.FC<RegisterModalProps> = ({ isOpen, employeeToEdit, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [employeeName, setEmployeeName] = useState<string>('');
    const [employeeNameTouched, setEmployeeNameTouched] = useState(false);

    const [employeeId, setEmployeeId] = useState<string>('');


    const [employeePhone, setEmployeePhone] = useState<string>('');
    const [employeePhoneTouched, setEmployeePhoneTouched] = useState(false);

    const [employeeEmail, setEmployeeEmail] = useState<string>('');
    const [employeeEmailTouched, setEmployeeEmailTouched] = useState(false);

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmployeeNameValid = employeeName.length > 0;
    const isEmployeePhoneValid = employeePhone.length > 0;
    const isEmployeeEmailValid = emailRegex.test(employeeEmail);

    const isFormValid = isEmployeePhoneValid && isEmployeeNameValid && isEmployeeEmailValid;

    let x = 1;

    useEffect(() => {
        if (!isOpen) return;

        if (employeeToEdit !== null) {
            setEmployeeId(employeeToEdit.id.toString())
            setEmployeeName(employeeToEdit.name);   
            setEmployeePhone(employeeToEdit.phone)     
        }

        else {
            setEmployeeId("0")
            setEmployeeName('');    
            setEmployeePhone('') ;     
        }
       
        setEmployeeNameTouched(false);       
        setSubmitting(false);

    }, [isOpen]);

    const handleSubmit = async () => {
        const userData = {
            id: employeeId,
            name : employeeName,
            phone : employeePhone,
            email: employeeEmail.trim(),
           
        };
        try {
            setSubmitting(true);
            let url =  "/Admin/addorupdateemployee";           
            const response = await AxiosClientPost(url, userData, true);
            onClose();

        } catch (error) {
            setSubmitError('Fejl');
            console.error(error);

        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#ccd4e5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                padding: '1rem',
            }}
        >
            <div
                style={{
                    backgroundColor: '#5470a9',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    width: '90%',
                    maxWidth: '500px',
                    boxSizing: 'border-box',
                }}
            >
                <h2
                    style={{
                        backgroundColor: '#5470a9',
                        padding: '1rem',
                        color: 'white',
                        borderRadius: '8px',
                        textAlign: 'center',
                    }}
                >
                    Medarbejder
                </h2>

             
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="employeename"><strong>Navn:</strong></label><br />
                    <input
                        id="employeename"
                        type="text"
                        value={employeeName}
                        onChange={(e) => setEmployeeName(e.target.value)}
                        onBlur={() => setEmployeeNameTouched(true)}
                        placeholder="Indtast navn"
                        style={{                           
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isEmployeeNameValid && employeeNameTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                        }}
                        
                    />
                </div>
               
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="phone"><strong>Telefonnummer:</strong></label><br />
                    <input
                        id="phone"
                        type="text"
                        value={employeePhone}
                        onChange={(e) => setEmployeePhone(e.target.value)}
                        onBlur={() => setEmployeePhoneTouched(true)}
                        placeholder="Indtast telefonnummer"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isEmployeePhoneValid && employeePhoneTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                        }}
                      
                    />
                    {!isEmployeePhoneValid && employeePhoneTouched && (
                        <p style={{ color: 'red', marginTop: '0.25rem' }}>Telefonnummer skal angives</p>
                    )}
                </div>

               
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="email"><strong>Email:</strong></label><br />
                    <input
                        id="email"
                        type="Text"
                        value={employeeEmail}
                        onChange={(e) => setEmployeeEmail(e.target.value)}
                        onBlur={() => setEmployeeEmailTouched(true)}
                        placeholder="Indtast email"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isEmployeeEmailValid && employeeEmailTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                        }}
                        disabled={submitting}
                    />
                    {!isEmployeeEmailValid && employeeEmailTouched && (
                        <p style={{ color: 'red', marginTop: '0.25rem' }}>Display name</p>
                    )}
                </div>

                {submitError && <p style={{ color: 'red' }}>{submitError}</p>}

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                     <button 
                        onClick={handleSubmit}
                        disabled={!isFormValid || submitting}
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: isFormValid && !submitting ? "white" : "grey",
                            color: "black",
                            border: "none",
                            borderRadius: "4px",
                            cursor: isFormValid && !submitting ? "pointer" : "not-allowed",
                        }}
                    >
                        Ok
                    </button>
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: !submitting ? 'white' : 'grey',
                            color: 'black',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: !submitting ? 'pointer' : 'not-allowed',
                        }} 
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeCreateEdit;
