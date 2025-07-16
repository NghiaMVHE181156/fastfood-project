"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import type { DeliveryLog } from "../../../types/order";
import { getStatusLabel } from "@/types/order-status";

interface OrderTimelineProps {
  deliveryLogs: DeliveryLog[];
}

export function OrderTimeline({ deliveryLogs }: OrderTimelineProps) {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Order Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deliveryLogs
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            )
            .map((log, index) => (
              <div key={log.log_id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      index === 0 ? "bg-orange-500" : "bg-gray-300"
                    }`}
                  />
                  {index < deliveryLogs.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {getStatusLabel(log.status)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDateTime(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{log.note}</p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
