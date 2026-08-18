export function formatPrice(price: number): string {
  return `₹${price.toFixed(0)}`;
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PLACED: "Order Placed",
    ACCEPTED: "Accepted",
    PREPARING: "Preparing",
    READY: "Ready for Pickup",
    COLLECTED: "Collected",
    CANCELLED: "Cancelled",
  };
  return labels[status] || status;
}

export function getStatusEmoji(status: string): string {
  const emojis: Record<string, string> = {
    PLACED: "📋",
    ACCEPTED: "✅",
    PREPARING: "👨‍🍳",
    READY: "🔔",
    COLLECTED: "🎉",
    CANCELLED: "❌",
  };
  return emojis[status] || "📦";
}

export function calculateEstimatedTime(
  activeOrders: number,
  avgPrepTime: number
): number {
  // Simple estimation: active orders * avg prep time / parallel capacity
  const parallelCapacity = 3; // Kitchen can handle 3 orders in parallel
  return Math.ceil((activeOrders * avgPrepTime) / parallelCapacity);
}

export function getWaitLevel(minutes: number): "low" | "medium" | "high" {
  if (minutes <= 10) return "low";
  if (minutes <= 20) return "medium";
  return "high";
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function generateToken(): number {
  // Generate a token number between 100-999
  return Math.floor(Math.random() * 900) + 100;
}
