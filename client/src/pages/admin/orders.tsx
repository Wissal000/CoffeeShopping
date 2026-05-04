import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import OrderDrawer from "../../components/OrderDrawer";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

type OrderStatus = "PENDING" | "PAID" | "PREPARING" | "DELIVERED" | "CANCELLED";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  address: string;
  phone: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}

const API = "http://localhost:8000";

const getStatusStyle = (status: OrderStatus) => {
  switch (status) {
    case "PAID":
      return "bg-green-500/10 text-green-400 border border-green-500/20";
    case "PREPARING":
      return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "DELIVERED":
      return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
    case "CANCELLED":
      return "bg-red-500/10 text-red-400 border border-red-500/20";
    default:
      return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
  }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  /* ================= UPDATE ================= */
  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      const res = await axios.patch(`${API}/api/orders/${id}/status`, {
        status,
      });

      const updated = res.data;

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: updated.status } : o)),
      );

      setSelectedOrder((prev) =>
        prev ? { ...prev, status: updated.status } : prev,
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    axios
      .get(`${API}/api/orders`)
      .then((res) => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* ===== HEADER ===== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
            <p className="text-gray-400 text-sm mt-1">
              Monitor, manage and update customer orders
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full md:w-[260px]">
            <input
              placeholder="Search orders..."
              className="w-full pl-4 pr-4 py-2.5 rounded-lg 
            bg-white/[0.04] border border-white/10 
            text-sm placeholder:text-gray-500
            focus:outline-none focus:border-yellow-400 focus:bg-white/[0.06]
            transition"
            />
          </div>
        </div>

        {/* ===== STATS ===== */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Orders",
              value: orders.length,
            },
            {
              label: "Revenue",
              value: `${orders
                .filter((o) => o.status === "PAID")
                .reduce((a, b) => a + b.total, 0)
                .toFixed(0)} MAD`,
            },
            {
              label: "Pending",
              value: orders.filter((o) => o.status === "PENDING").length,
            },
            {
              label: "Delivered",
              value: orders.filter((o) => o.status === "DELIVERED").length,
            },
          ].map((card, i) => (
            <div
              key={i}
              className="relative p-5 rounded-xl 
            bg-white/[0.03] border border-white/10 
            hover:border-white/20 hover:bg-white/[0.05]
            transition"
            >
              <p className="text-xs text-gray-500">{card.label}</p>
              <p className="text-2xl font-semibold mt-1">{card.value}</p>

              {/* subtle glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-400/0 to-orange-400/0 hover:from-yellow-400/5 hover:to-orange-400/5 transition pointer-events-none" />
            </div>
          ))}
        </div>

        {/* ===== TABLE CARD ===== */}
        <div className="rounded-xl border border-white/10 bg-[#0d0d0e] overflow-hidden">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-5 px-6 py-3 text-[11px] text-gray-500 uppercase tracking-wider border-b border-white/10">
            <span>Order</span>
            <span>Customer</span>
            <span>Total</span>
            <span>Status</span>
            <span>Date</span>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="p-10 text-center text-gray-500">
              Loading orders...
            </div>
          )}

          {/* ROWS */}
          {!loading && orders.length === 0 && (
            <div className="p-10 text-center text-gray-500">No orders yet</div>
          )}

          {!loading &&
            orders.map((order, index) => (
              <motion.div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="group grid grid-cols-5 items-center px-6 py-4 
              border-b border-white/5 
              hover:bg-white/[0.04] 
              cursor-pointer transition"
              >
                {/* ORDER */}
                <span className="font-medium text-white/80 group-hover:text-white">
                  #{order.id.slice(0, 6)}
                </span>

                {/* CUSTOMER */}
                <span className="text-gray-300 group-hover:text-white">
                  {order.customerName}
                </span>

                {/* TOTAL */}
                <span className="font-semibold text-yellow-400">
                  {order.total.toFixed(2)} MAD
                </span>

                {/* STATUS */}
                <span>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-medium border ${getStatusStyle(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </span>

                {/* DATE */}
                <span className="text-gray-500 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </motion.div>
            ))}
        </div>
      </div>

      {/* DRAWER */}
      <OrderDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={updateStatus}
      />
    </div>
  );
};

export default AdminOrders;
