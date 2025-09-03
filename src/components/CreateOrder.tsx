
import { FishShopFullDto } from '../types/FishShop';
import { TemplateSchedule } from '../types/TemplateSchedule';
import { OrderItem } from '../types/OrderItem';
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { Product } from '../types/Product';
import { AxiosClientGet } from '../types/AxiosClient';

export default function CreateOrder() {

    const location = useLocation();
    const { fishShop, templateScedule } = (location.state as { fishShop: FishShopFullDto; templateScedule: TemplateSchedule }) || {};
    const [products, setProducts] = useState<Product[]>([]);
    const [orderItemsProduct, setOrderItemsProduct] = useState<OrderItem[]>([]);
    const [customerName, setCustomerName] = useState<string>('');
    const [nameTouched, setNameTouched] = useState(false);

    const [allOrderItems, setAllOrderItems] = useState<OrderItem[]>([]);
    const [enteredQuantity, setEnteredQuantity] = useState<string[]>([]);

    const [phone, setPhone] = useState<string>('');
    const [phoneTouched, setPhoneTouched] = useState(false);

    const [email, setEmail] = useState<string>('');
    const [emailTouched, setEmailTouched] = useState(false);

    const [comment, setComment] = useState<string>('');  // <-- Added comment state
    const [error, setError] = useState<string | null>(null);
    const [reload, setReload] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

    var x = fishShop;
    var y = templateScedule


    useEffect(() => {

        const fetchProducts = async () => {

            try {
                const productsResponse: any = await AxiosClientGet('/Home/productlist', true);

                setProducts(productsResponse);

                const orderItemsProduct: OrderItem[] = productsResponse.map((product: any) => ({
                    quantity: 1,
                    productid: product.id,
                    producttype: product.producttype,
                    productnumber: product.productnumber,
                    productname: product.name,
                    productdescription: product.description,
                    details: '',
                    unitdiscountpercentage: product.discountpercentage,
                    discountedunitprice: product.discountprice,
                    unitprice: product.price,
                    orderid: 0,
                    selected: false
                }
                ));

                setOrderItemsProduct(orderItemsProduct);

                setLoading(false);

            } catch (err) {
                setError('Failed to load locations');
                setLoading(false);
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
        setCustomerName('');
        setNameTouched(false);
        setPhone('');
        setPhoneTouched(false);
        setEmail('');
        setEmailTouched(false);
        setComment('');  // Reset comment on open
        setSubmitError(null);
        setSubmitSuccess(null);
        setSubmitting(false);
    }, []);

    const toggleSelection = (index: number) => {
        const updated = [...allOrderItems];
        updated[index].selected = !updated[index].selected;
        setAllOrderItems(updated);
    };

    const updateQuantity = (index: number, quantity: string) => {

        if (quantity === '') {
            enteredQuantity[index] = '';
            const updated = [...allOrderItems];
            updated[index].quantity = 0;
            setAllOrderItems(updated);
            return
            return;
            // quantityAsNumber = 0;
        }

        let quantityAsNumber = Number(quantity);

        if (!isNaN(quantityAsNumber)) {
            enteredQuantity[index] = quantity;
            const updated = [...allOrderItems];
            updated[index].quantity = quantityAsNumber;
            setAllOrderItems(updated);
            return
        }


    };



    return (
        <>
            <div className="flex flex-col gap-60  bg-customBlue">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center mt-4"
                    style={{ textAlign: 'left', margin: '20px' }} // fixed column width
                >
                    {orderItemsProduct.map((item, index) => (
                        <div key={item.productid} className="pizza-item-container">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={item.selected}
                                    onChange={() => toggleSelection(index)}
                                    disabled={submitting}
                                />
                                <span>
                                    <strong>{item.productnumber + ' ' + item.productname}</strong>{' '}
                                    (Pris før rabat {item.discountedunitprice.toFixed(2).replaceAll('.', ',')} kr)
                                </span>
                            </label>

                            {item.selected && (
                                <div className="quantity-container">
                                    <input
                                        className="quantity-input"
                                        type="number"
                                        value={enteredQuantity[index]}
                                        onChange={(e) => updateQuantity(index, e.target.value)}
                                        disabled={submitting}
                                    />
                                    <span>
                                        {(item.unitprice * item.quantity).toFixed(2).replaceAll('.', ',')} kr
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>);
}

