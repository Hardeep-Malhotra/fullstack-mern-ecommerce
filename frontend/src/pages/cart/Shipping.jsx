import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { saveShippingInfo } from "../../redux/slices/cartSlice";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { shippingInfo, savedAddresses } = useSelector(
    (state) => state.cart || {}
  );
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth || { isAuthenticated: true }
  );

  const savedDraft = JSON.parse(localStorage.getItem("shippingDraft") || "{}");

  // 1. ADDED NAME STATE
  const [name, setName] = useState(
    shippingInfo?.name || savedDraft.name || user?.name || ""
  );
  const [address, setAddress] = useState(
    shippingInfo?.address || savedDraft.address || ""
  );
  const [city, setCity] = useState(shippingInfo?.city || savedDraft.city || "");
  const [state, setState] = useState(
    shippingInfo?.state || savedDraft.state || ""
  );
  const [country] = useState("India");
  const [pinCode, setPinCode] = useState(
    shippingInfo?.pinCode || savedDraft.pinCode || ""
  );
  const [phoneNo, setPhoneNo] = useState(
    shippingInfo?.phoneNo || savedDraft.phoneNo || ""
  );
  const [addressType, setAddressType] = useState(
    shippingInfo?.addressType || "Home"
  );

  const [loadingPincode, setLoadingPincode] = useState(false);
  const [deliveryEstimate, setDeliveryEstimate] = useState(null);
  const [selectedSavedId, setSelectedSavedId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to proceed with shipping");
      navigate("/login", { replace: true, state: { from: location.pathname } });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  // Draft update me name include kiya
  useEffect(() => {
    const draft = { name, address, city, state, country, pinCode, phoneNo, addressType };
    localStorage.setItem("shippingDraft", JSON.stringify(draft));
  }, [name, address, city, state, country, pinCode, phoneNo, addressType]);

  const calculateDeliveryEstimate = useCallback((code) => {
    if (!code || code.length !== 6) {
      setDeliveryEstimate(null);
      return;
    }
    const today = new Date();
    const isExpress =
      code.startsWith("11") || code.startsWith("40") || code.startsWith("56");
    const daysToAdd = isExpress ? 2 : 4;

    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + daysToAdd);

    const formattedDate = deliveryDate.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    setDeliveryEstimate({
      date: formattedDate,
      type: isExpress ? "⚡ Express Delivery" : "🚚 Standard Delivery",
    });
  }, []);

  const fetchPincodeDetails = useCallback(async (code) => {
    try {
      setLoadingPincode(true);
      const res = await fetch(`https://api.postalpincode.in/pincode/${code}`);
      const data = await res.json();

      if (data[0] && data[0].Status === "Success") {
        const details = data[0].PostOffice[0];
        setCity(details.District);
        setState(details.State);
        setErrors((prev) => ({ ...prev, pinCode: null }));
      } else {
        toast.error("Invalid PIN code");
      }
    } catch (err) {
      console.error("Pincode lookup error:", err);
    } finally {
      setLoadingPincode(false);
    }
  }, []);

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPinCode(value);
    setSelectedSavedId(null);

    if (value.length === 6) {
      fetchPincodeDetails(value);
      calculateDeliveryEstimate(value);
    } else {
      setDeliveryEstimate(null);
    }
  };

  const handleSelectSavedAddress = (item, index) => {
    setSelectedSavedId(index);
    setName(item.name || user?.name || "");
    setAddress(item.address);
    setCity(item.city);
    setState(item.state);
    setPinCode(item.pinCode);
    setPhoneNo(item.phoneNo);
    setAddressType(item.addressType || "Home");
    setErrors({});

    if (item.pinCode && item.pinCode.length === 6) {
      calculateDeliveryEstimate(item.pinCode);
    }
    toast.success("Saved address loaded!");
  };

  const validateForm = () => {
    let newErrors = {};

    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = "Full name must be at least 3 characters long";
    }
    if (!address.trim() || address.trim().length < 8) {
      newErrors.address = "Address must be at least 8 characters long";
    }
    if (!city.trim()) newErrors.city = "City is required";
    if (!state.trim()) newErrors.state = "State is required";

    if (!/^\d{6}$/.test(pinCode)) {
      newErrors.pinCode = "Enter a valid 6-digit PIN code";
    }

    if (!/^[6-9]\d{9}$/.test(phoneNo)) {
      newErrors.phoneNo = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all details correctly");
      return;
    }

    const shippingData = { name, address, city, state, country, pinCode, phoneNo, addressType };

    dispatch(saveShippingInfo(shippingData));
    localStorage.removeItem("shippingDraft");

    toast.success("Shipping details confirmed!");
    navigate("/order/confirm");
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-orange-50/40 via-slate-50 to-slate-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 animate-[fadeUp_0.4s_ease-out]">
          <h1 className="text-3xl font-black text-slate-900">
            Shipping Information
          </h1>
          <p className="mt-2 text-slate-500">
            Select saved address or enter new delivery details
          </p>
        </div>

        {/* STEPPER */}
        <div className="flex items-center justify-center mb-8 animate-[fadeUp_0.4s_ease-out_0.05s_backwards]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold shadow-md shadow-orange-200 animate-[pulse_2s_ease-in-out_infinite]">
              1
            </div>
            <span className="text-xs font-semibold text-orange-600">Shipping</span>
            <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-orange-500 to-orange-300 animate-[fillBar_0.8s_ease-out_0.2s_backwards]" />
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold">
              2
            </div>
            <span className="text-xs font-semibold text-slate-400">Confirm</span>
            <div className="w-16 h-1 bg-slate-200 rounded-full" />
            <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold">
              3
            </div>
            <span className="text-xs font-semibold text-slate-400">Payment</span>
          </div>
        </div>

        {/* SAVED ADDRESSES SECTION */}
        {savedAddresses && savedAddresses.length > 0 && (
          <div className="mb-8 animate-[fadeUp_0.4s_ease-out_0.1s_backwards]">
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              Select Saved Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedAddresses.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSavedAddress(item, idx)}
                  style={{ animationDelay: `${idx * 60}ms` }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 animate-[fadeUp_0.35s_ease-out_backwards] ${
                    selectedSavedId === idx
                      ? "border-orange-500 bg-orange-50/50 shadow-md shadow-orange-100 scale-[1.01]"
                      : "border-slate-200 bg-white hover:border-orange-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                      {item.addressType === "Work" ? "🏢 Work" : "🏠 Home"}
                    </span>
                    {selectedSavedId === idx && (
                      <span className="text-xs font-bold text-orange-600 animate-[popIn_0.25s_ease-out]">
                        ✓ Selected
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {item.name || user?.name}
                  </p>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-2 mt-0.5">
                    {item.address}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {item.city}, {item.state} - {item.pinCode}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    📞 {item.phoneNo}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 animate-[fadeUp_0.4s_ease-out_0.15s_backwards]"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-5">
            Delivery Details
          </h2>

          {/* ADDRESS TYPE TAGS */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Save Address As
            </label>
            <div className="flex gap-3">
              {["Home", "Work"].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setAddressType(type)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    addressType === type
                      ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm scale-[1.02]"
                      : "border-slate-300 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50/40"
                  }`}
                >
                  {type === "Home"
                    ? "🏠 Home (All Day Delivery)"
                    : "🏢 Work (Deliver 9 AM - 6 PM)"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* NEW FULL NAME FIELD */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Recipient Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSelectedSavedId(null);
                }}
                placeholder="Enter recipient's full name"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.name ? "border-red-500" : "border-slate-300"
                } outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1 animate-[fadeUp_0.2s_ease-out]">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address (House No, Flat, Area, Landmark)
              </label>
              <textarea
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setSelectedSavedId(null);
                }}
                placeholder="Enter complete address details"
                rows="3"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.address ? "border-red-500" : "border-slate-300"
                } outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none transition-all duration-200`}
              />
              {errors.address && (
                <p className="text-xs text-red-500 mt-1 animate-[fadeUp_0.2s_ease-out]">
                  {errors.address}
                </p>
              )}
            </div>

            {/* PIN Code */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                PIN Code{" "}
                {loadingPincode && (
                  <span className="text-xs text-orange-500 inline-flex items-center gap-1">
                    <span className="w-3 h-3 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></span>
                    Checking...
                  </span>
                )}
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                value={pinCode}
                onChange={handlePincodeChange}
                placeholder="e.g. 135001"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.pinCode ? "border-red-500" : "border-slate-300"
                } outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200`}
              />
              {errors.pinCode && (
                <p className="text-xs text-red-500 mt-1 animate-[fadeUp_0.2s_ease-out]">
                  {errors.pinCode}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.city ? "border-red-500" : "border-slate-300"
                } outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200`}
              />
              {errors.city && (
                <p className="text-xs text-red-500 mt-1 animate-[fadeUp_0.2s_ease-out]">
                  {errors.city}
                </p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Enter state"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.state ? "border-red-500" : "border-slate-300"
                } outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200`}
              />
              {errors.state && (
                <p className="text-xs text-red-500 mt-1 animate-[fadeUp_0.2s_ease-out]">
                  {errors.state}
                </p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={country}
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 outline-none"
              />
            </div>

            {/* Phone */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400 font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength="10"
                  value={phoneNo}
                  onChange={(e) => {
                    setPhoneNo(e.target.value.replace(/\D/g, ""));
                    setSelectedSavedId(null);
                  }}
                  placeholder="9876543210"
                  className={`w-full pl-14 pr-4 py-3 rounded-xl border ${
                    errors.phoneNo ? "border-red-500" : "border-slate-300"
                  } outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200`}
                />
              </div>
              {errors.phoneNo && (
                <p className="text-xs text-red-500 mt-1 animate-[fadeUp_0.2s_ease-out]">
                  {errors.phoneNo}
                </p>
              )}
            </div>
          </div>

          {/* DYNAMIC DELIVERY ESTIMATE BANNER */}
          {deliveryEstimate && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-800 animate-[fadeUp_0.35s_ease-out]">
              <div className="flex items-center gap-3">
                <span className="text-2xl animate-[float_2.5s_ease-in-out_infinite]">📦</span>
                <div>
                  <p className="text-xs font-semibold uppercase text-emerald-600">
                    {deliveryEstimate.type}
                  </p>
                  <p className="text-sm font-bold">
                    Guaranteed Delivery by {deliveryEstimate.date}
                  </p>
                </div>
              </div>
              <span className="text-xs bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-md font-semibold">
                FREE
              </span>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="mt-8 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Continue to Order Review →
          </button>
        </form>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fillBar {
          from { transform: scaleX(0); transform-origin: left; }
          to { transform: scaleX(1); transform-origin: left; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

export default Shipping;