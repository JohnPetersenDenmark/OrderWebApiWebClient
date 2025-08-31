import React, { useEffect, useState } from 'react';
import { AxiosClientGet, AxiosClientPost } from '../types/AxiosClient';

import { SaleLocation } from '../types/SaleLocation';
import OperatingArea from '../types/OperatingArea';

interface TemplateSchedule {
    id: number,
    operationareaid: number,
    dayofweek: number;
    starttime: string;
    endtime: string;
    locationid: number;
    locationname: string;
}

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

    const [saleLocationList, setSaleLocationList] = useState<SaleLocation[]>([]);

    // schedules live here
    const [templateScheduleList, setTemplateScheduleList] = useState<TemplateSchedule[]>([]);

    const [selectedSaleLocations, setSelectedSaleLocations] = useState<SaleLocation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const isOperatingAreaNameValid = operatingAreaName.length > 0;
    const isFormValid = isOperatingAreaNameValid;

    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {
            try {
                const saleLocationsResponse: any = await AxiosClientGet('/Home/locationlist', true);
                setSaleLocationList(saleLocationsResponse);
                setLoading(false);
            } catch (err) {
                setError('Failed to load locations');
                setLoading(false);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isOpen]);

    useEffect(() => {
        if (operatingAreaToEdit !== null) {
            setOperatingAreaId(operatingAreaToEdit.id.toString());
            setOperatingAreaName(operatingAreaToEdit.name);
            setSelectedSaleLocations(operatingAreaToEdit.locations)
            setTemplateScheduleList(operatingAreaToEdit.templateSchedules)
        } else {
            setOperatingAreaId("0");
            setOperatingAreaName('');
            setSelectedSaleLocations([]);
            setTemplateScheduleList([]);
        }

        setOperatinAreaNameTouched(false);
        setSubmitting(false);
    }, [operatingAreaToEdit]);

    const addLocation = (saleLocation: SaleLocation) => {

        // add location + blank schedule
        setSelectedSaleLocations([...selectedSaleLocations, saleLocation]);
        setTemplateScheduleList([
            ...templateScheduleList,
            {
                id: 0,
                locationname: '',
                operationareaid: 0,
                dayofweek: 1,
                starttime: "09:00",
                endtime: "10:00",
                locationid: saleLocation.id
            }
        ]);
    };

    const removeLocation = (saleLocation: SaleLocation, index: number) => {



        setSelectedSaleLocations(prev => prev.filter((_, i) => i !== index));
        setTemplateScheduleList(prev => prev.filter((_, i) => i !== index));

        /*   if (selectedSaleLocations.find((l) => l.id === saleLocation.id)) {
              // remove location + its schedule
              setSelectedSaleLocations(selectedSaleLocations.filter((l) => l.id !== saleLocation.id));
              setTemplateScheduleList(templateScheduleList.filter(s => s.locationid !== saleLocation.id));
          
           } */
    };

    const updateScheduleField = (index: number, locationId: number, field: keyof TemplateSchedule, value: any) => {
          setTemplateScheduleList(templateScheduleList.map((s , i) =>
             i === index ? { ...s, [field]: value } : s
         )); 

       // setTemplateScheduleList(prev => prev.filter((_, i) => i !== index));

    };

    const handleSubmit = async () => {

        const OperatingAreaData = {
            id: operatingAreaToEdit ? operatingAreaToEdit?.id : 0,
            name: operatingAreaName,
            locationids: selectedSaleLocations.map(loc => loc.id),
            templateschedules: templateScheduleList
        };

        try {
            setSubmitting(true);

            // 1. Save OperatingArea
            await AxiosClientPost("/Admin/addorupdateoperatingarea", OperatingAreaData, false);

            // 2. Save TemplateSchedules (bulk API endpoint?)
            // await AxiosClientPost("/Admin/savetemplateschedules", templateScheduleList, false);

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
                <div style={{ marginBottom: '1rem' }}>
                    <h2 className="bg-[#8d4a5b] text-white text-center p-3 rounded-lg">Område</h2>

                    {/* Name */}
                    <div className="mb-4">
                        <label htmlFor="operatingareaname" className="font-bold">Navn:</label>
                        <input
                            id="operatingareaname"
                            type="text"
                            value={operatingAreaName}
                            onChange={(e) => setOperatingAreaName(e.target.value)}
                            onBlur={() => setOperatinAreaNameTouched(true)}
                            placeholder="Indtast navn"
                            className={`w-full p-2 mt-1 border rounded ${!isOperatingAreaNameValid && operatingAreaNameTouched ? "border-red-500" : "border-gray-300"}`}
                        />
                    </div>

                    {/* Locations */}
                    <div style={{ marginBottom: '1rem' }}>
                        <h2 className="text-lg font-bold mb-2">Vælg lokation</h2>
                        <ul className="space-y-1">
                            {saleLocationList.map((location) => (
                                <li key={location.id}>
                                    <button
                                        onClick={() => addLocation(location)}
                                        className={`px-3 py-1 rounded ${selectedSaleLocations.find(l => l.id === location.id) ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                    >
                                        {location.locationname}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Selected + schedules */}
                    <div style={{ marginBottom: '1rem' }}>
                        <h3 className="text-lg font-semibold mb-2">Selected:</h3>
                        {selectedSaleLocations.length === 0 && <p className="text-gray-500">None</p>}

                        <ul className="space-y-3">
                            {selectedSaleLocations.map((loc, index) => {
                                // const schedule = templateScheduleList.find(s => s.locationid === loc.id);
                                  const schedule = templateScheduleList[index];
                                return (
                                    <li key={loc.id} className="border p-3 rounded">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium">{loc.locationname}</span>
                                            <button
                                                onClick={() => removeLocation(loc, index)}
                                                className="text-red-500 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        {/* Inline schedule editor */}
                                        {schedule && (
                                            <div className="flex gap-2 items-center">
                                                <select
                                                    value={schedule.dayofweek}
                                                    onChange={e => updateScheduleField(index, loc.id, "dayofweek", Number(e.target.value))}
                                                    className="border rounded p-1"
                                                >
                                                    <option value={1}>Mandag</option>
                                                    <option value={2}>Tirsdag</option>
                                                    <option value={3}>Onsdag</option>
                                                    <option value={4}>Torsdag</option>
                                                    <option value={5}>Fredag</option>
                                                    <option value={6}>Lørdag</option>
                                                    <option value={7}>Søndag</option>
                                                </select>

                                                <input
                                                    type="time"
                                                    value={schedule.starttime}
                                                    onChange={e => updateScheduleField(index, loc.id, "starttime", e.target.value)}
                                                    className="border rounded p-1"
                                                />

                                                <input
                                                    type="time"
                                                    value={schedule.endtime}
                                                    onChange={e => updateScheduleField(index, loc.id, "endtime", e.target.value)}
                                                    className="border rounded p-1"
                                                />
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {submitError && <p className="text-red-500">{submitError}</p>}

                    {/* Buttons */}
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
        </div>
    );
};

export default OperatingAreaCreateEdit;
