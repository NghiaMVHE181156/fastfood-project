"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus, STATUS_GROUPS } from "@/types/order-status";

interface StatusFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function StatusFilter({ value, onValueChange }: StatusFilterProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>
        <SelectItem value={OrderStatus.PREPARING}>Preparing</SelectItem>
        <SelectItem value={OrderStatus.ASSIGNED}>Assigned to Shipper</SelectItem>
        <SelectItem value={OrderStatus.DELIVERING}>Delivering</SelectItem>
        <SelectItem value={OrderStatus.SUCCESS}>Delivery Successful</SelectItem>
        <SelectItem value={OrderStatus.FAILED_1}>Delivery Failed (1st attempt)</SelectItem>
        <SelectItem value={OrderStatus.FAILED_2}>Delivery Failed (2nd attempt)</SelectItem>
        <SelectItem value={OrderStatus.REDELIVERY}>Redelivery</SelectItem>
        <SelectItem value={OrderStatus.BOMB}>Customer No-show</SelectItem>
      </SelectContent>
    </Select>
  );
}
