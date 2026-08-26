
import { CheckCircle2, Clock, Truck, XCircle } from "lucide-react";

const OrderStatus = ({ status, paymentInfo }) => {
  const getStatusBadge = (orderStatus) => {
    switch (orderStatus) {
      case "Delivered":
        return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 size={16} /> };
      case "Shipped":
        return { bg: "bg-blue-50 text-blue-700 border-blue-200", icon: <Truck size={16} /> };
      case "Processing":
        return { bg: "bg-amber-50 text-amber-700 border-amber-200", icon: <Clock size={16} /> };
      default:
        return { bg: "bg-red-50 text-red-700 border-red-200", icon: <XCircle size={16} /> };
    }
  };

  const badge = getStatusBadge(status);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 font-medium">Order Status</span>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
          {badge.icon} {status}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-sm text-slate-500 font-medium">Payment Status</span>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${paymentInfo?.status === "succeeded" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
          {paymentInfo?.status === "succeeded" ? "PAID" : "NOT PAID"}
        </span>
      </div>
    </div>
  );
};

export default OrderStatus;