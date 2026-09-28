import CircuitBreaker from "opossum";
import ErrorHandler from "./ErrorHandlers.js";

const defaultOptions = {
  timeout: 5000, 
  errorThresholdPercentage: 50, 
  resetTimeout: 10000, 
};

export const createCircuitBreaker = (actionFunction, customOptions = {}) => {
  const options = { ...defaultOptions, ...customOptions };
  const breaker = new CircuitBreaker(actionFunction, options);

  // Fallback Handling
  breaker.fallback(() => {
    throw new ErrorHandler(
      "Payment Gateway is currently unresponsive or overloaded. Please try again after some time.",
      503,
    );
  });

  // Logging / Debugging
  breaker.on("open", () =>
    console.warn("⚠️ CIRCUIT BREAKER: OPEN - Razorpay API unreachable"),
  );
  breaker.on("halfOpen", () =>
    console.log("🟡 CIRCUIT BREAKER: HALF-OPEN - Testing Razorpay API..."),
  );
  breaker.on("close", () =>
    console.log("🟢 CIRCUIT BREAKER: CLOSED - Service Operational"),
  );

  return breaker;
};
