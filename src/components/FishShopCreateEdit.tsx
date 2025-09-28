import React, { useEffect, useState } from 'react';
import { AxiosClientGet, AxiosClientPost } from '../types/AxiosClient';

import { Employee } from '../types/Employee';
import OperatingArea from '../types/OperatingArea';

import { FishShopFullDto, FishShopLightDto } from '../types/FishShop';

interface RegisterModalProps {
    isOpen: boolean;
    fishShopToEdit: FishShopFullDto | null;
    onClose: () => void;
}

const FishShopCreateEdit: React.FC<RegisterModalProps> = ({ isOpen, fishShopToEdit, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [fishShop, setFishShop] = useState<FishShopFullDto[]>([]);

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

    const [dataListIsLoaded, setDataListIsLoaded] = useState(false);



    const isfishShopNameNameValid = fishShopName.length > 0;
    const isFormValid = isfishShopNameNameValid;

    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                const [employeesResponse, operatingAreaResponse] = await Promise.all([
                    AxiosClientGet('/Admin/employeelist', true),
                    AxiosClientGet('/Admin/operatingarealist', true)
                ]);

                setEmployeeList(employeesResponse);
                setOperatingAreaList(operatingAreaResponse);

            } catch (err) {
                setError("Failed to load data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isOpen]);


    // 2. Preselect when editing + lists are ready
    useEffect(() => {
        if (!isOpen) return;

        if (!fishShopToEdit) {
            // new shop
            setFishShopId("0");
            setFishShopName('');
            setSelectedEmployee(null);
            setSelectedOperatingArea(null);
        } else {
            // editing existing shop
            setFishShopId(fishShopToEdit.id.toString());
            setFishShopName(fishShopToEdit.name);

            if (employeeList.length > 0) {
                setSelectedEmployee(
                    employeeList.find(e => e.id === fishShopToEdit?.employeeId) || null
                );
            }

            if (operatingAreaList.length > 0) {
                setSelectedOperatingArea(
                    operatingAreaList.find(o => o.id === fishShopToEdit?.operationAreaId) || null
                );
            }
        }

        setfishShopNameTouched(false);
        setSelectedTruckLocationsTouched(false);
        setSubmitting(false);

    }, [fishShopToEdit, employeeList, operatingAreaList, isOpen]);



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

    const closeModal = () => {
        fishShopToEdit = null;
        onClose();
    };

    const handleSubmit = async () => {
        //const userData: fishShop = {
        const userData: FishShopLightDto = {
            id: Number(fishShopId),
            name: fishShopName,
            employeeid: selectedEmployee?.id,
            operatingareaid: selectedOperatingArea?.id
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
                    Fiskebil
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

                <div className="flex gap-6">
                    {/* Employee list */}
                    <div className="flex-1 mb-6">
                        <h2 className="text-xl font-semibold mb-3 text-gray-800">
                            Vælg medarbejder
                        </h2>
                        <ul className="bg-white rounded-lg shadow p-4 space-y-2">
                            {employeeList.map((employee) => (
                                <li key={employee.id}>
                                    <button
                                        onClick={() => toggleEmployee(employee)}
                                        className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200
              ${selectedEmployee?.id === employee.id
                                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {employee.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Selected employee */}
                    <div className="flex-1 mb-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">Valgt:</h3>
                        <ul className="bg-white rounded-lg shadow p-4">
                            {selectedEmployee ? (
                                <li className="text-gray-700 font-medium">{selectedEmployee.name}</li>
                            ) : (
                                <li className="text-gray-400 italic">Ingen valgt</li>
                            )}
                        </ul>
                    </div>
                </div>


                <div className="flex gap-6">
                    {/* Operating area list */}
                    <div className="flex-1 mb-6">
                        <h2 className="text-xl font-semibold mb-3 text-gray-800">
                            Vælg område
                        </h2>
                        <ul className="bg-white rounded-lg shadow p-4 space-y-2">
                            {operatingAreaList.map((operatingArea) => (
                                <li key={operatingArea.id}>
                                    <button
                                        onClick={() => toggleOperatingArea(operatingArea)}
                                        className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200
              ${selectedOperatingArea?.id === operatingArea.id
                                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {operatingArea.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Selected operating area */}
                    <div className="flex-1 mb-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">Valgt:</h3>
                        <ul className="bg-white rounded-lg shadow p-4">
                            {selectedOperatingArea ? (
                                <li className="text-gray-700 font-medium">{selectedOperatingArea.name}</li>
                            ) : (
                                <li className="text-gray-400 italic">Ingen valgt</li>
                            )}
                        </ul>
                    </div>
                </div>


                {submitError && <p style={{ color: 'red' }}>{submitError}</p>}

                <div className="flex gap-4">
                    <div className="flex-1">
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid || submitting}
                            className="w-full px-4 py-2 rounded bg-white text-black hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Ok
                        </button>
                    </div>
                    <div className="flex-1">
                        <button
                            onClick={onClose}
                            disabled={submitting}
                            className="w-full px-4 py-2 rounded bg-white text-black hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Annuler
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};




export default FishShopCreateEdit;
