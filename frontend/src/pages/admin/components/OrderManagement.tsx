"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/api/adminApi";
import type { AdminOrder } from "@/types/admin-order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, AlertTriangle, UserCheck } from "lucide-react";
import { getStatusConfig } from "@/types/order-status";

export function OrderManagement() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bombFilter, setBombFilter] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    fetchOrders();
  }, [bombFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAllOrders(bombFilter);
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBomb = async (orderId: number) => {
    try {
      await adminApi.confirmBombOrder(orderId);
      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error("Failed to confirm bomb order:", error);
    }
  };

  const handleUnflagUser = async (userId: number) => {
    try {
      await adminApi.unflagUser(userId);
      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error("Failed to unflag user:", error);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_id.toString().includes(searchTerm) ||
      order.user_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const config = getStatusConfig(status);
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.icon && <span className="mr-1">{config.icon}</span>}
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Order Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search orders by ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="assigned">Assigned to Shipper</SelectItem>
                  <SelectItem value="delivering">Delivering</SelectItem>
                  <SelectItem value="success">Delivery Successful</SelectItem>
                  <SelectItem value="failed_1">
                    Delivery Failed (1st attempt)
                  </SelectItem>
                  <SelectItem value="failed_2">
                    Delivery Failed (2nd attempt)
                  </SelectItem>
                  <SelectItem value="redelivery">Redelivery</SelectItem>
                  <SelectItem value="bomb">Customer No-show</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={bombFilter === undefined ? "all" : bombFilter.toString()}
                onValueChange={(value) =>
                  setBombFilter(value === "all" ? undefined : value === "true")
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Bomb filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All orders</SelectItem>
                  <SelectItem value="true">Bomb orders only</SelectItem>
                  <SelectItem value="false">Non-bomb orders</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Boom Count</TableHead>
                  <TableHead>Flagged</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.order_id}>
                      <TableCell className="font-medium">
                        #{order.order_id}
                      </TableCell>
                      <TableCell>{order.user_name}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{formatDateTime(order.created_at)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.boom_count > 0 ? "destructive" : "secondary"
                          }
                        >
                          {order.boom_count}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.is_flagged ? (
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1 w-fit"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            Flagged
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Normal</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConfirmBomb(order.order_id)}
                              className="text-orange-600 border-orange-600 hover:bg-orange-50"
                            >
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Confirm Bomb
                            </Button>
                          {order.is_flagged && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnflagUser(order.user_id)}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <UserCheck className="h-3 w-3 mr-1" />
                              Unflag User
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
