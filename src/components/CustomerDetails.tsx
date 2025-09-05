
import { useState } from 'react';


export default function CustomerDetails() {

    const [customerName, setCustomerName] = useState<string>('');
    const [nameTouched, setNameTouched] = useState(false);

    const [phone, setPhone] = useState<string>('');
    const [phoneTouched, setPhoneTouched] = useState(false);

    const [email, setEmail] = useState<string>('');
    const [emailTouched, setEmailTouched] = useState(false);

    const isNameValid = customerName.trim().length > 0;
    const isPhoneValid = phone.trim().length > 0;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);

    const isFormValid = isNameValid && isPhoneValid && isEmailValid ;


    const [submitting, setSubmitting] = useState(false);

    return (
        <div className="text-2xl p-4 bg-gray-50 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-2">
                Kontaktinfo:
            </h2>
            {/* Customer name */}
            <label htmlFor="customerName" className="text-xl"></label>
            <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                onBlur={() => setNameTouched(true)}
                placeholder="Indtast dit navn"
                className="text-xl"
                disabled={submitting}
            />
            {!isNameValid && nameTouched && (
                <p className="text-xl" style={{ color: 'red', marginTop: '0.25rem' }}>Navn må ikke være tomt.</p>
            )}

            <label htmlFor="phone" className="text-xl">Telefonnummer:</label>
            <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => setPhoneTouched(true)}
                placeholder="+451234567890 eller 12345678"
                className="text-xl"
                maxLength={12}
                disabled={submitting}
            />
            {!isPhoneValid && phoneTouched && (
                <p className="text-xl" style={{ color: 'red', marginTop: '0.25rem' }}>
                    Telefonnummer skal være enten 8 cifre eller '+' efterfulgt af 10 cifre.
                </p>
            )}

            {/* Email */}
            <label htmlFor="email" className="text-xl">Email:</label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                placeholder="Indtast din email"
                className="text-xl"
                disabled={submitting}
            />
            {!isEmailValid && emailTouched && (
                <p className="text-xl" style={{ color: 'red', marginTop: '0.25rem' }}>Indtast venligst en gyldig emailadresse.</p>
            )}
           
        </div>
    );
}