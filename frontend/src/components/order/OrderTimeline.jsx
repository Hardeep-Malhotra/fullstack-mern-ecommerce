import { CheckCircle2 } from "lucide-react";

const OrderTimeline = ({ history, statusHistory }) => {
  // Gracefully pick whichever prop is provided
  const timelineData = history || statusHistory || [];

  if (!timelineData || timelineData.length === 0) {
    return (
      <div className="bg-slate-50 rounded-xl p-4 text-center text-xs text-slate-400">
        No tracking status history available.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {timelineData.map((item, index) => (
        <div
          key={`${item.status}-${index}`}
          className="relative flex items-start gap-4"
        >
          {/* Dot Icon */}
          <div className="absolute -left-6 top-0.5 bg-white rounded-full p-0.5 text-orange-500">
            <CheckCircle2 size={18} className="fill-orange-100" />
          </div>

          {/* Timeline Content */}
          <div className="flex-1 bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-slate-800">
                {item.status}
              </h4>
              <span className="text-[11px] font-medium text-slate-400">
                {item.updatedAt
                  ? new Date(item.updatedAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </span>
            </div>
            {item.comment && (
              <p className="text-xs text-slate-500 mt-0.5">{item.comment}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTimeline;
