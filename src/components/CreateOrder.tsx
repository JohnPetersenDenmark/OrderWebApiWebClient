
import { FishShopFullDto } from '../types/FishShop';
import { TemplateSchedule } from '../types/TemplateSchedule';
import { OrderItem } from '../types/OrderItem';
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { Product } from '../types/Product';
import { AxiosClientGet, AxiosClientPost } from '../types/AxiosClient';
import { useNavigate } from "react-router-dom";
import ProductCard from './ProductCard';
import Cart from './Cart';
import CustomerDetails from './CustomerDetails';
import PickupLocation from './PickupLocation';
import { Order } from '../types/Order';
import { useCart } from './CartContext';


export default function CreateOrder() {

    const location = useLocation();
    const { fishShop, templateScedule } = (location.state as { fishShop: FishShopFullDto; templateScedule: TemplateSchedule }) || {};
    const [products, setProducts] = useState<Product[]>([]);
    const [orderItemsProduct, setOrderItemsProduct] = useState<OrderItem[]>([]);
    const [customerName, setCustomerName] = useState<string>('');
    const [nameTouched, setNameTouched] = useState(false);

    //  const [allOrderItems, setAllOrderItems] = useState<OrderItem[]>([]);
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
    const { cart } = useCart();

const isFormValid = true;

    useEffect(() => {

        const fetchProducts = async () => {

            try {
                const productsResponse: any = await AxiosClientGet('/Home/productlist', true);

                setProducts(productsResponse);

                const tmpOrderItemsProduct: OrderItem[] = productsResponse.map((product: any) => ({
                    quantity: 1,
                    productid: product.id,
                    producttype: product.producttype,
                    productnumber: product.productnumber,
                    productname: product.name,
                    imageurl: product.imageurl,
                    productdescription: product.description,
                    details: '',
                    unitdiscountpercentage: product.discountpercentage,
                    discountedunitprice: product.discountprice,
                    unitprice: product.price,
                    orderid: 0,
                    selected: false,
                    badge: product.badge,
                    weight: product.weight,
                    shelfLife: product.shelflife,
                    pricePerKg: product.priceperkilo
                }
                ));

                setOrderItemsProduct(tmpOrderItemsProduct);

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

    /*   const toggleSelection = (index: number) => {
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
  
  
      }; */

    function handleMenuSelection(menuItem: number) {
        setSelectedMenuPoint(menuItem);
        if (menuItem === 1) {
            navigate("/home")
        }
    }

    const SubmitOrder = async () => {
        setSubmitting(true);

        const customerOrderCodeAsString = Math.floor(1000 + Math.random() * 9000).toString();

        const orderData: Order = {
            id: 0,
            customerName: customerName.trim(),
            customerorderCode: customerOrderCodeAsString,
            phone: phone,
            email: email,
            locationId: templateScedule.locationid,
            createddatetime: new Date().toISOString(),
            modifieddatetime: new Date().toISOString(),
            payeddatetime: new Date().toISOString(),
            locationname: 'aaaa',
            locationstartdatetime: '',
            locationenddatetime: '',
            locationbeautifiedstartdatetime: 'aaa',
            locationbeautifiedTimeInterval: 'aaaa',
            totalPrice: 0,
            // totalPrice: parseFloat(getTotal()),

            comment: comment.trim(),
            orderlines: Object.values(cart)

        };

        try {
            let response: any;
            response = await AxiosClientPost('/Home/createorder', orderData, false);

        } catch (error) {

            setSubmitError('Kunne ikke sende bestillingen. Prøv igen senere.');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };


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


                <div className="flex-[5] grid grid-cols-4 gap-6  bg-customGreyLight text-xl"
                >
                    {orderItemsProduct.map((orderItem, index) => (
                        <ProductCard orderItem={orderItem} />
                    ))}
                </div>
                <div className="flex-[1] mr-20">

                    <div className="mt-10">
                        <Cart />
                    </div>

                    <div className="mt-10">
                        <CustomerDetails />
                    </div>

                    <div className="mt-10">
                        <label htmlFor="comment" className="text-xl">Kommentarer til bestillingen:</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Skriv eventuelle ønsker eller bemærkninger her..."
                            spellCheck='false'
                            rows={3}
                            className="text-xl"
                            disabled={submitting}
                        />
                    </div>

                    <div className="mt-10">
                        <button
                            onClick={SubmitOrder}
                            disabled={submitting}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor:
                                    isFormValid && !submitting ? '#5470a9' : 'grey',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor:
                                    isFormValid && !submitting ? 'pointer' : 'not-allowed',
                                marginRight: '0.5rem',
                            }}
                        >
                            Ok
                        </button>
                    </div>

                    <div className="mt-10">
                        <PickupLocation templateScedule={templateScedule} />
                    </div>

                </div>
            </div >
        </>
    );
}

