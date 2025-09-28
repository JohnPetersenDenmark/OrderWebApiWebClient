import React, { useEffect, useState } from "react";
import { AxiosClientGet, AxiosClientPost } from "../types/AxiosClient";
import { SaleLocation } from "../types/SaleLocation";
import OperatingArea from "../types/OperatingArea";

interface TemplateSchedule {
  id: number;
  operationareaid: number;
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

const OperatingAreaCreateEdit: React.FC<RegisterModalProps> = ({
  isOpen,
  operatingAreaToEdit,
  onClose,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [operatingAreaName, setOperatingAreaName] = useState("");
  const [operatingAreaNameTouched, setOperatingAreaNameTouched] =
    useState(false);

  const [operatingAreaId, setOperatingAreaId] = useState("0");

  const [saleLocationList, setSaleLocationList] = useState<SaleLocation[]>([]);
  const [templateScheduleList, setTemplateScheduleList] = useState<TemplateSchedule[]>([]);
  const [selectedSaleLocations, setSelectedSaleLocations] = useState<SaleLocation[]>([]);

  const [loading, setLoading] = useState(false);

  const isOperatingAreaNameValid = operatingAreaName.trim().length > 0;
  const isFormValid = isOperatingAreaNameValid;

  // Fetch locations when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const saleLocationsResponse: any = await AxiosClientGet(
          "/Home/locationlist",
          true
        );
        setSaleLocationList(saleLocationsResponse);
      } catch (err) {
        console.error(err);
        setSubmitError("Kunne ikke hente lokationer");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  // Load existing data if editing
  useEffect(() => {
    if (operatingAreaToEdit) {
      setOperatingAreaId(operatingAreaToEdit.id.toString());
      setOperatingAreaName(operatingAreaToEdit.name);
      setSelectedSaleLocations(operatingAreaToEdit.locations);
      setTemplateScheduleList(operatingAreaToEdit.templateSchedules);
    } else {
      setOperatingAreaId("0");
      setOperatingAreaName("");
      setSelectedSaleLocations([]);
      setTemplateScheduleList([]);
    }
    setOperatingAreaNameTouched(false);
    setSubmitting(false);
  }, [operatingAreaToEdit]);

  const addLocation = (saleLocation: SaleLocation) => {
    if (selectedSaleLocations.find((l) => l.id === saleLocation.id)) return; // prevent duplicates

    setSelectedSaleLocations([...selectedSaleLocations, saleLocation]);
    setTemplateScheduleList([
      ...templateScheduleList,
      {
        id: 0,
        locationname: saleLocation.locationname,
        operationareaid: 0,
        dayofweek: 1,
        starttime: "09:00",
        endtime: "10:00",
        locationid: saleLocation.id,
      },
    ]);
  };

  const removeLocation = (index: number) => {
    setSelectedSaleLocations((prev) => prev.filter((_, i) => i !== index));
    setTemplateScheduleList((prev) => prev.filter((_, i) => i !== index));
  };

  const updateScheduleField = (
    index: number,
    field: keyof TemplateSchedule,
    value: any
  ) => {
    setTemplateScheduleList((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = async () => {
    const OperatingAreaData = {
      id: operatingAreaToEdit ? operatingAreaToEdit.id : 0,
      name: operatingAreaName,
      locationids: selectedSaleLocations.map((loc) => loc.id),
      templateschedules: templateScheduleList,
    };

    try {
      setSubmitting(true);
      await AxiosClientPost(
        "/Admin/addorupdateoperatingarea",
        OperatingAreaData,
        false
      );
      onClose();
    } catch (error) {
      console.error(error);
      setSubmitError("Der opstod en fejl ved gemning");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-customBlue rounded-xl shadow-lg w-full max-w-4xl p-6">
        <h2 className="text-xl font-bold text-[white] mb-4">Område</h2>

        {/* Name field */}
        <div className="mb-6">
          <label
            htmlFor="operatingareaname"
            className="block font-medium text-gray-700"
          >
            Navn
          </label>
          <input
            id="operatingareaname"
            type="text"
            value={operatingAreaName}
            onChange={(e) => setOperatingAreaName(e.target.value)}
            onBlur={() => setOperatingAreaNameTouched(true)}
            placeholder="Indtast navn"
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#5470a9] focus:border-[#5470a9] ${!isOperatingAreaNameValid && operatingAreaNameTouched
                ? "border-red-500"
                : "border-gray-300"
              }`}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Available locations */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Vælg lokation</h3>
            {loading ? (
              <p className="text-gray-500">Indlæser...</p>
            ) : (
              <ul className="space-y-2">
                {saleLocationList.map((location) => (
                  <li key={location.id}>
                    <button
                      onClick={() => addLocation(location)}
                      className={`w-full px-3 py-2 rounded-md text-left transition ${selectedSaleLocations.find((l) => l.id === location.id)
                          ? "bg-[LightGray] text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                      {location.locationname}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Selected locations with schedules */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Valgte lokationer</h3>
            {selectedSaleLocations.length === 0 && (
              <p className="text-[gray-500]">Ingen valgt</p>
            )}
            <ul className="space-y-3">
              {selectedSaleLocations.map((loc, index) => {
                const schedule = templateScheduleList[index];
                return (
                  <li
                    key={loc.id}
                    className="border rounded-lg p-3 bg-[LightGray] shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{loc.locationname}</span>
                      <button
                        onClick={() => removeLocation(index)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Fjern
                      </button>
                    </div>

                    {/* Inline schedule editor */}
                    {schedule && (
                      <div className="flex flex-wrap gap-2 items-center">
                        <select
                          value={schedule.dayofweek}
                          onChange={(e) =>
                            updateScheduleField(
                              index,
                              "dayofweek",
                              Number(e.target.value)
                            )
                          }
                          className="border rounded-md p-2"
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
                          onChange={(e) =>
                            updateScheduleField(
                              index,
                              "starttime",
                              e.target.value
                            )
                          }
                          className="border rounded-md p-2"
                        />

                        <input
                          type="time"
                          value={schedule.endtime}
                          onChange={(e) =>
                            updateScheduleField(
                              index,
                              "endtime",
                              e.target.value
                            )
                          }
                          className="border rounded-md p-2"
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {submitError && <p className="text-red-600 mt-4">{submitError}</p>}

        <div className="flex gap-4 mt-10">
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

export default OperatingAreaCreateEdit;
