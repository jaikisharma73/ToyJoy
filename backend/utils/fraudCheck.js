const fraudCheck = (order) => {
  let riskScore = 0;

  // Rule 1: Very expensive order
  if (order.totalAmount > 10000) riskScore += 40;

  // Rule 2: Too many payment attempts
  if (order.paymentAttempts > 3) riskScore += 30;

  // Rule 3: Multiple orders in short time (basic)
  const now = new Date();
  const orderTime = new Date(order.orderTime);
  const diffMinutes = (now - orderTime) / (1000 * 60);
  if (diffMinutes < 2) riskScore += 20;

  // Rule 4: Too many items
  if (order.items.length > 10) riskScore += 10;

  // Final Decision
  if (riskScore >= 50) return "High Risk";
  if (riskScore >= 30) return "Medium Risk";
  return "Low Risk";
};

export default fraudCheck;