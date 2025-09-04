
import { FishShopFullDto } from '../types/FishShop';
import { TemplateSchedule } from '../types/TemplateSchedule';
import { OrderItem } from '../types/OrderItem';
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { Product } from '../types/Product';
import { AxiosClientGet } from '../types/AxiosClient';
import { useNavigate } from "react-router-dom";
import ProductCard from './ProductCard';
import Cart from './Cart';


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
    const [selectedMenuPoint, setSelectedMenuPoint] = useState(0);
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

    const navigate = useNavigate();


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
                    imageurl : product.imageurl,
                    productdescription: product.description,
                    details: '',
                    unitdiscountpercentage: product.discountpercentage,
                    discountedunitprice: product.discountprice,
                    unitprice: product.price,
                    orderid: 0,
                    selected: false,
                    badge: "This Badge",
                    weight : "100g",
                    shelfLife : "2 dage",
                    pricePerKg : 120
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

    function handleMenuSelection(menuItem: number) {
        setSelectedMenuPoint(menuItem);
        if (menuItem === 1) {
            navigate("/home")
        }
    }


    return (
        <>
            <div className="flex flex-col gap-30  bg-customBlue text-left">
                <div className="flex">
                    {/* Column 1 */}
                    <div className="flex-1  text-white p-4 text-left">
                        <img src="/images/jjfisk_logo.svg" alt="Logo" height={100} width={100} />
                    </div>

                    {/* Column 2 with nested row */}
                    <div className="flex-1 text-white p-4">
                        <div className="grid grid-cols-5 gap-2 text-left">
                            <div className="text-2xl p-2">
                                <span
                                    onClick={() => handleMenuSelection(1)}
                                    className={`cursor-pointer hover:text-hoverYellow ${selectedMenuPoint == 1 ? 'text-hoverYellow' : 'text-white'}`} >
                                    FORSIDE
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-6 bg-customGreyLight text-left mt-10" >
                <div className="flex-[1] ml-10">Menu</div>


                <div className="flex-[5] flex gap-6 bg-customGreyLight text-xl"
                >
                    {orderItemsProduct.map((orderItem, index) => (
                       <ProductCard  orderItem={orderItem} />
                    ))}
                </div>
                <div className="flex-[1] mr-10">
                    <Cart />
                </div>
            </div >
        </>
    );
}

