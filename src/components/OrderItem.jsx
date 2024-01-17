import React from "react";

const OrderItem = ({ order }) => {
  const { products, totalPrice } = order;

  return (
    <div className="flex flex-col border-b py-3">
      {products.map((productInfo) => (
        <div key={productInfo.product._id} className="flex items-center mb-2">
          <div className="flex-shrink-0 w-16 h-16">
            <img
              src={productInfo.product.image[0]}
              alt={productInfo.product.name}
              className="w-full h-full object-contain mx-auto"
            />
          </div>
          <div className="ml-3 flex-grow">
            <p className="text-sm font-medium">{productInfo.product.name}</p>
            <p className="text-xs">Quantity: {productInfo.quantity}</p>
          </div>
          <div className="text-sm">${productInfo.price.toFixed(2)}</div>
        </div>
      ))}
      <div className="flex items-center mb-2">
        <div className="flex-grow"></div>
        <div className="text-sm font-semibold">
          Total Price: ${totalPrice.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
