import React from 'react';
import { useCart } from './CartContext';

/* interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
} */

/* interface CartProps {
  cartItems: Pizza[];
  onRemove: (index: number) => void;
} */

export default function Cart() {

const { cart } = useCart();

  const items = Object.values(cart);
  const grandTotal = items.reduce(
    (sum, item) => sum + item.unitprice * item.quantity,
    0
  );

   return (
    <div className="text-2xl p-4 bg-gray-50 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2">🛒 Din kurv</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Kurven er tom</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li
              key={item.productid}
              className="text-xl flex justify-between py-2 border-b"
            >
              <span>
                {item.productname} x {item.quantity}
              </span>
              <span>{(item.unitprice * item.quantity).toFixed(2)} kr</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 font-semibold">Total: {grandTotal.toFixed(2)} kr</div>
    </div>
  );
}