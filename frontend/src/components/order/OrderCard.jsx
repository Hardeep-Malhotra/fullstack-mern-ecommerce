
import { useNavigate } from "react-router-dom";
import OrderStatus from "./OrderStatus";
import { ArrowRight,  } from "lucide-react";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Order ID
          </p>
          <p className="text-sm font-bold text-slate-900 font-mono">
            #{order._id?.slice(-8).toUpperCase()}
          </p>
        </div>
        <OrderStatus status={order.orderStatus} />
      </div>

      {/* Items Preview */}
      <div className="py-4 space-y-3">
        {order.orderItems?.map((item) => (
          <div key={item.product || item._id} className="flex items-center gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-800 truncate">
                {item.name}
              </h4>
              <p className="text-xs text-slate-500">
                ₹{item.price} × {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-medium block">Total Amount</span>
          <strong className="text-base font-extrabold text-orange-600">
            ₹{Number(order.totalPrice).toLocaleString("en-IN")}
          </strong>
        </div>

        <button
          onClick={() => navigate(`/order/${order._id}`)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-xl transition-all duration-200"
        >
          View Details <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default OrderCard;