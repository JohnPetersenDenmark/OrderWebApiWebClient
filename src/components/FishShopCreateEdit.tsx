import React, { useEffect, useState } from 'react';
import { AxiosClientGet, AxiosClientPost } from '../types/AxiosClient';

import { Employee } from '../types/Employee';
import OperatingArea from '../types/OperatingArea';

import { FishShop } from '../types/FishShop';

interface RegisterModalProps {
    isOpen: boolean;
    fishShopToEdit: FishShop | null;
    onClose: () => void;
}

const FishShopCreateEdit: React.FC<RegisterModalProps> = ({ isOpen, fishShopToEdit, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [fishShop, setFishShop] = useState<FishShop[]>([]);

    const [fishShopName, setFishShopName] = useState<string>('');
    const [fishShopNameTouched, setfishShopNameTouched] = useState(false);

    const [fishShopId, setFishShopId] = useState<string>('');

    const [employeeList, setEmployeeList] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const [operatingAreaList, setOperatingAreaList] = useState<OperatingArea[]>([]);
    const [selectedOperatingArea, setSelectedOperatingArea] = useState<OperatingArea | null>(null);


    const [selectedTruckLocationsTouched, setSelectedTruckLocationsTouched] = useState(false);
    const [selectedTruckLocationId, setSelectedTruckLocationId] = useState<string>('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const isfishShopNameNameValid = fishShopName.length > 0;
    const isFormValid = isfishShopNameNameValid;

    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {

            try {
                const employeesResponse: any = await AxiosClientGet('/Admin/employeelist', true);

                setEmployeeList(employeesResponse);
                setLoading(false);

            } catch (err) {
                setError('Failed to load locations');
                setLoading(false);
                console.error(err);
            } finally {
                setLoading(false);
            }

            try {
                const operatingAreaResponse: any = await AxiosClientGet('/Admin/operatingarealist', true);

                setOperatingAreaList(operatingAreaResponse);
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
    }, [isOpen]);

    useEffect(() => {
        //  if (!isOpen) return;

        if (fishShopToEdit !== null) {
            setFishShopId(fishShopToEdit.id.toString())
            setFishShopName(fishShopToEdit.name);
           // (fishShopToEdit.employeeid)

            const preSelectedEmployee = employeeList.filter(employee =>
                 fishShopToEdit.employeeid == employee.id);

             setSelectedEmployee(preSelectedEmployee[0]) 

               const preSelectedOperatingArea = operatingAreaList.filter(operatingArea =>
                 fishShopToEdit.operatingareaid == operatingArea.id);

             setSelectedOperatingArea(preSelectedOperatingArea[0]) 
        }

        else {
            setFishShopId("0")
            setFishShopName('');
            setSelectedEmployee(null);
        }

        setfishShopNameTouched(false);
        setSelectedTruckLocationsTouched(false)
        setSubmitting(false);



    }, [employeeList]);



    const toggleEmployee = (employee: Employee) => {
        if (selectedEmployee === employee) {
            return;

        } else {
            setSelectedEmployee(employee);
        }
    };

    const toggleOperatingArea = (operatingArea: OperatingArea) => {
        if (selectedOperatingArea === operatingArea) {
            return;

        } else {
            setSelectedOperatingArea(operatingArea);
        }
    };


    const handleSubmit = async () => {
        //const userData: fishShop = {
        const userData : FishShop = {
            id: Number(fishShopId),
            name: fishShopName,
           employeeid : selectedEmployee?.id,
           operatingareaid : selectedOperatingArea?.id
        };
        try {
            setSubmitting(true);
            let url = "/Admin/addorupdatefishshop";
            const response = await AxiosClientPost(url, userData, false);
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
                backgroundColor: '#8d4a5b',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                padding: '1rem',
            }}
        >
            <div
                style={{
                    backgroundColor: '#c7a6ac',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    width: '90%',
                    maxWidth: '500px',
                    boxSizing: 'border-box',
                }}
            >
                <h2
                    style={{
                        backgroundColor: '#8d4a5b',
                        padding: '1rem',
                        color: 'white',
                        borderRadius: '8px',
                        textAlign: 'center',
                    }}
                >
                    Ny fiskebil
                </h2>


                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="fishshopname"><strong>Navn:</strong></label><br />
                    <input
                        id="fishshopname"
                        type="text"
                        value={fishShopName}
                        onChange={(e) => setFishShopName(e.target.value)}
                        onBlur={() => setfishShopNameTouched(true)}
                        placeholder="Indtast navn"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isfishShopNameNameValid && fishShopNameTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                        }}

                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <h2 className="text-xl font-bold mb-2">Vælg medarbejder</h2>
                    <ul className="mb-4">
                        {employeeList.map((employee) => (
                            <li key={employee.id} className="mb-1">
                                <button
                                    onClick={() => toggleEmployee(employee)}
                                /*  className={`px-3 py-1 rounded ${
                                   selected.includes(location)
                                     ? "bg-blue-500 text-white"
                                     : "bg-gray-200"
                                 }`} */
                                >
                                    {employee.name} {employee.phone}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>



                <div style={{ marginBottom: '1rem' }}>
                    <h3 className="text-lg font-semibold mb-2">Selected:</h3>
                    <ul>
                        <li>{selectedEmployee?.name}</li>
                    </ul>
                </div>


                <div style={{ marginBottom: '1rem' }}>
                    <h2 className="text-xl font-bold mb-2">Vælg medarbejder</h2>
                    <ul className="mb-4">
                        {operatingAreaList.map((operationgArea) => (
                            <li key={operationgArea.id} className="mb-1">
                                <button
                                    onClick={() => toggleOperatingArea(operationgArea)}
                                /*  className={`px-3 py-1 rounded ${
                                   selected.includes(location)
                                     ? "bg-blue-500 text-white"
                                     : "bg-gray-200"
                                 }`} */
                                >
                                    {operationgArea.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <h3 className="text-lg font-semibold mb-2">Selected:</h3>
                    <ul>
                        <li>{selectedOperatingArea?.name}</li>
                    </ul>
                </div>

                {submitError && <p style={{ color: 'red' }}>{submitError}</p>}

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid || submitting}
                        style={{
                            flex: 1,
                            padding: '0.5rem 1rem',
                            backgroundColor: isFormValid && !submitting ? '#8d4a5b' : 'grey',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isFormValid && !submitting ? 'pointer' : 'not-allowed',
                            minWidth: '100px',
                        }}
                    >
                        Ok
                    </button>
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        style={{
                            flex: 1,
                            padding: '0.5rem 1rem',
                            backgroundColor: !submitting ? '#8d4a5b' : 'grey',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: !submitting ? 'pointer' : 'not-allowed',
                            minWidth: '100px',
                        }}
                    >
                        Annuller
                    </button>
                </div>
            </div>
        </div>
    );
};




export default FishShopCreateEdit;
