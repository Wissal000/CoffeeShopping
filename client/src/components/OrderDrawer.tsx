import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

/* ================= TYPES ================= */
type OrderStatus = "PENDING" | "PAID" | "PREPARING" | "DELIVERED" | "CANCELLED";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  address: string;
  phone: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
}

interface Props {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderStatus) => Promise<void>;
}

/* ================= STYLES ================= */
const statuses: OrderStatus[] = ["PENDING", "PAID", "PREPARING", "DELIVERED"];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "PAID":
      return "text-green-400";
    case "PREPARING":
      return "text-blue-400";
    case "DELIVERED":
      return "text-purple-400";
    case "CANCELLED":
      return "text-red-400";
    default:
      return "text-yellow-400";
  }
};

/* ================= COMPONENT ================= */
const OrderDrawer = ({ order, onClose, onUpdateStatus }: Props) => {
  const [loadingStatus, setLoadingStatus] = useState<OrderStatus | null>(null);

  if (!order) return null;

  const handleUpdate = async (status: OrderStatus) => {
    try {
      setLoadingStatus(status);
      await onUpdateStatus(order.id, status);
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoadingStatus(null);
    }
  };

  return (
    <AnimatePresence>
      {order && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* DRAWER */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 h-full w-full md:w-[420px]
            bg-[#0b0705] border-l border-white/10 z-50
            p-6 flex flex-col"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase">Order</p>
                <h2 className="text-xl font-semibold">
                  #{order.id.slice(0, 8)}
                </h2>
              </div>

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* STATUS DISPLAY */}
            <div className="mb-6">
              <p className="text-xs text-gray-400 mb-2">Current Status</p>
              <div
                className={`text-lg font-semibold ${getStatusColor(order.status)}`}
              >
                {order.status}
              </div>
            </div>

            {/* 🔥 SEGMENTED STATUS CONTROL */}
            <div className="mb-6">
              <p className="text-xs text-gray-400 mb-3">Update Status</p>

              <div className="flex bg-white/5 p-1 rounded-xl">
                {statuses.map((status) => (
                  <button
                    key={status}
                    disabled={loadingStatus !== null}
                    onClick={() => handleUpdate(status)}
                    className={`flex-1 py-2 text-xs rounded-lg transition
                      ${
                        order.status === status
                          ? "bg-yellow-400 text-black font-semibold"
                          : "text-gray-400 hover:text-white"
                      }`}
                  >
                    {loadingStatus === status ? "..." : status}
                  </button>
                ))}
              </div>

              {/* CANCEL */}
              {order.status !== "CANCELLED" && (
                <button
                  onClick={() => handleUpdate("CANCELLED")}
                  disabled={loadingStatus !== null}
                  className="mt-3 w-full py-2 text-sm rounded-lg
                  bg-red-500/10 text-red-400 border border-red-500/20
                  hover:bg-red-500/20 transition"
                >
                  Cancel Order
                </button>
              )}
            </div>

            {/* CUSTOMER */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5">
              <p className="font-medium">{order.customerName}</p>
              <p className="text-xs text-gray-400">{order.customerEmail}</p>
              <p className="text-xs text-gray-400">{order.address}</p>
              <p className="text-xs text-gray-400">{order.phone}</p>
            </div>

            {/* ITEMS */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm p-3 rounded-lg bg-white/5"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-yellow-400">
                    {(item.price * item.quantity).toFixed(2)} MAD
                  </span>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="pt-4 border-t border-white/10 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-yellow-400">
                {order.total.toFixed(2)} MAD
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderDrawer;
