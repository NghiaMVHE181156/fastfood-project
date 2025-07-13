"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Shipper } from "@/types/admin-management"

const mockShippers: Shipper[] = [
  {
    shipper_id: 1,
    user_name: "shipper_acc01",
    full_name: "Lê Văn Ship",
    email: "ship01@fastfood.vn",
    phone: "0909777888",
    created_at: "2025-07-11 13:22:39",
  },
  {
    shipper_id: 2,
    user_name: "shipper_acc02",
    full_name: "Mai Thị Giao",
    email: "ship02@fastfood.vn",
    phone: "0911222333",
    created_at: "2025-07-11 13:22:39",
  },
]

export function ShippersManagement() {
  const [shippers, setShippers] = useState<Shipper[]>(mockShippers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingShipper, setEditingShipper] = useState<Shipper | null>(null)
  const [formData, setFormData] = useState({
    user_name: "",
    full_name: "",
    email: "",
    phone: "",
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingShipper) {
      setShippers(
        shippers.map((shipper) =>
          shipper.shipper_id === editingShipper.shipper_id ? { ...shipper, ...formData } : shipper,
        ),
      )
    } else {
      const newShipper: Shipper = {
        shipper_id: Math.max(...shippers.map((s) => s.shipper_id)) + 1,
        ...formData,
        created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      }
      setShippers([...shippers, newShipper])
    }
    setIsDialogOpen(false)
    setEditingShipper(null)
    setFormData({ user_name: "", full_name: "", email: "", phone: "" })
  }

  const handleEdit = (shipper: Shipper) => {
    setEditingShipper(shipper)
    setFormData({
      user_name: shipper.user_name,
      full_name: shipper.full_name,
      email: shipper.email,
      phone: shipper.phone,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (shipperId: number) => {
    setShippers(shippers.filter((shipper) => shipper.shipper_id !== shipperId))
  }

  const openAddDialog = () => {
    setEditingShipper(null)
    setFormData({ user_name: "", full_name: "", email: "", phone: "" })
    setIsDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Shippers Management</CardTitle>
            <CardDescription>Manage delivery personnel accounts</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Shipper
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingShipper ? "Edit Shipper" : "Add New Shipper"}</DialogTitle>
                <DialogDescription>
                  {editingShipper ? "Update shipper information" : "Create a new shipper account"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="user_name">Username</Label>
                    <Input
                      id="user_name"
                      value={formData.user_name}
                      onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingShipper ? "Update" : "Create"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shippers.map((shipper) => (
              <TableRow key={shipper.shipper_id}>
                <TableCell className="font-medium">{shipper.shipper_id}</TableCell>
                <TableCell>{shipper.user_name}</TableCell>
                <TableCell>{shipper.full_name}</TableCell>
                <TableCell>{shipper.email}</TableCell>
                <TableCell>{shipper.phone}</TableCell>
                <TableCell>{formatDate(shipper.created_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(shipper)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(shipper.shipper_id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
