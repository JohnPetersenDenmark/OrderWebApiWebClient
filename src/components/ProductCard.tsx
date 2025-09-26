import { ShoppingCart } from "lucide-react";
import { OrderItem } from "../types/OrderItem";
import config from "../config";
import { useCart } from "./CartContext";
interface OrderItemProps {
  orderItem: OrderItem;
}

const ProductCard: React.FC<OrderItemProps> = ({ orderItem }) => {
  const { cart, addToCart, removeFromCart } = useCart();

  const quantity = cart[orderItem.productid]?.quantity || 0;
  const total = quantity * orderItem.unitprice;

  return (
    <div className="max-w-sm rounded-2xl shadow-md bg-white p-4">
      <div className="inline-block bg-customBlue text-white text-xs font-semibold px-2 py-1 rounded">
        {orderItem.badge}
      </div>

      <img
        className="w-96 h-72 object-cover rounded-xl my-3"
        src={config.API_BASE_URL + orderItem.imageurl}
        alt={orderItem.productname}
      />

      <div className="flex items-center justify-between mt-4 mb-10">
        <div>
          <h3 className="font-semibold text-lg">Kategori</h3>
          <p className="text-gray-500"></p>

          <div className="mt-2 text-sm">
            {orderItem.productcategories && orderItem.productcategories.map((category) => (
              <p>
                {category.categoryname}
              </p>
            ))}
          </div>
        </div>

        <div className="mr-5">
          <h3 className="font-semibold text-lg">Type</h3>
          <p className="text-gray-500"></p>

          <div className="mt-2 text-sm">
            {orderItem.producttypes && orderItem.producttypes.map((type) => (
              <p>
                {type.name}
              </p>

            ))}
          </div>
        </div>
      </div>

      <div className="items-center justify-between mt-4 mb-10">
        <div className="mr-5">
          <h3 className="font-semibold text-lg">Mærkning</h3>
          <p className="flex-1 text-gray-500"></p>

          <div className="flex mt-2 text-sm">
            {orderItem.productlabels && orderItem.productlabels.map((label) => (
              <div className="flex-1">               
                <img
                  className="w-5 h-5 object-cover rounded-xl my-3"
                  src={config.API_BASE_URL + label.imageurl}
                  alt={label.labelname}
                />
              </div>

            ))}
          </div>
        </div>
      </div>

      <h3 className="font-semibold text-lg">{orderItem.productname}</h3>
      <p className="text-gray-500">{orderItem.weight}</p>

      <div className="mt-2">
        <p className="text-2xl font-bold">{orderItem.unitprice.toFixed(2)} kr</p>
        <p className="text-sm text-gray-500">
          {orderItem.pricePerKg} kr/kg
        </p>
      </div>


      <div className="flex items-center justify-between mt-4">
        {quantity === 0 ? (
          <button
            onClick={() => addToCart(orderItem)}
            className="flex items-center gap-2 bg-hoverYellowLight text-white px-4 py-2 rounded-xl hover:bg-green-800"
          >
            <ShoppingCart size={18} /> Læg i kurv
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => removeFromCart(orderItem.productid.toString())}
              className="px-3 py-1 bg-gray-200 rounded-lg"
            >
              -
            </button>
            <span className="font-semibold">{quantity}</span>
            <button
              onClick={() => addToCart(orderItem)}
              className="px-3 py-1 bg-gray-200 rounded-lg"
            >
              +
            </button>
            <span className="ml-2 text-sm text-gray-600">
              {total.toFixed(2)} kr
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;