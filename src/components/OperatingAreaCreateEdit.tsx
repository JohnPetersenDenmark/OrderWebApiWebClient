import React, { useEffect, useState } from 'react';
import { AxiosClientGet, AxiosClientPost } from '../types/AxiosClient';

import { TruckLocation } from '../types/TruckLocation';
import OperatingArea from '../types/OperatingArea'

interface RegisterModalProps {
    isOpen: boolean;
    operatingAreaToEdit: OperatingArea | null;
    onClose: () => void;
}

const OperatingAreaCreateEdit: React.FC<RegisterModalProps> = ({ isOpen, operatingAreaToEdit, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [operatingAreaName, setOperatingAreaName] = useState<string>('');
    const [operatingAreaNameTouched, setOperatinAreaNameTouched] = useState(false);

    const [operatingAreaId, setOperatingAreaId] = useState<string>('');

    const [truckLocationList, setTruckLocationList] = useState<TruckLocation[]>([]);

    const [selectedTruckLocations, setSelectedTruckLocations] = useState<TruckLocation[]>([]);


    const [selectedTruckLocationsTouched, setSelectedTruckLocationsTouched] = useState(false);

    const [selectedTruckLocationId, setSelectedTruckLocationId] = useState<string>('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const isOperatingAreaNameValid = operatingAreaName.length > 0;
    const isFormValid = isOperatingAreaNameValid;

    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {

            try {
                const truckLocationsResponse: any = await AxiosClientGet('/Home/truckcalendarlocationlist', true);

                setTruckLocationList(truckLocationsResponse);
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

        if (operatingAreaToEdit !== null) {
            setOperatingAreaId(operatingAreaToEdit.id.toString())
            setOperatingAreaName(operatingAreaToEdit.name);

            const noget = truckLocationList.filter(truckLocation =>
                operatingAreaToEdit.trucklocationids.includes(truckLocation.id))
            setSelectedTruckLocations(noget)
        }

        else {
            setOperatingAreaId("0")
            setOperatingAreaName('');
            setSelectedTruckLocations([]);
        }

        setOperatinAreaNameTouched(false);
        setSelectedTruckLocationsTouched(false)
        setSubmitting(false);



    }, [truckLocationList]);

    const toggleLocation = (location: TruckLocation) => {
        if (selectedTruckLocations.includes(location)) {
            // remove
            setSelectedTruckLocations(selectedTruckLocations.filter((l) => l !== location));
        } else {
            // add
            setSelectedTruckLocations([...selectedTruckLocations, location]);
        }
    };


    const handleSubmit = async () => {
        const userData: OperatingArea = {
            id: Number(operatingAreaId),
            name: operatingAreaName,
            trucklocationids: selectedTruckLocations.map(loc => loc.id)
        };
        try {
            setSubmitting(true);
            let url = "/Admin/addorupdateoperatingarea";
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
                    Ny medarbejder
                </h2>


                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="operatingareaname"><strong>Navn:</strong></label><br />
                    <input
                        id="operatingareaname"
                        type="text"
                        value={operatingAreaName}
                        onChange={(e) => setOperatingAreaName(e.target.value)}
                        onBlur={() => setOperatinAreaNameTouched(true)}
                        placeholder="Indtast navn"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isOperatingAreaNameValid && operatingAreaNameTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                        }}

                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <h2 className="text-xl font-bold mb-2">Pick Locations</h2>
                    <ul className="mb-4">
                        {truckLocationList.map((location) => (
                            <li key={location.id} className="mb-1">
                                <button
                                    onClick={() => toggleLocation(location)}
                                /*  className={`px-3 py-1 rounded ${
                                   selected.includes(location)
                                     ? "bg-blue-500 text-white"
                                     : "bg-gray-200"
                                 }`} */
                                >
                                    {location.locationname} {location.startdatetime}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>



                <div style={{ marginBottom: '1rem' }}>
                    <h3 className="text-lg font-semibold mb-2">Selected:</h3>
                    <ul>
                        {selectedTruckLocations.map((loc) => (
                            <li key={loc.id} className="flex items-center justify-between mb-1">
                                {loc.locationname}
                                <button
                                    onClick={() => toggleLocation(loc)}
                                    className="text-red-500 hover:underline"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                        {selectedTruckLocations.length === 0 && <p className="text-gray-500">None</p>}
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




export default OperatingAreaCreateEdit;
