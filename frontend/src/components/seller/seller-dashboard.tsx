"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, TrendingUp, Package, DollarSign } from "lucide-react"
import ProductCard from "./product-card"

// Mock data - replace with actual API calls
const mockProducts = [
  {
    id: "1",
    name: "Organic Bananas",
    description: "Fresh organic bananas from local farms. Perfect for smoothies and snacks.",
    price: 2.99,
    originalPrice: 3.99,
    stock: 45,
    category: "Fruits",
    image: "/placeholder.svg?height=200&width=300",
    expiryDate: "2024-01-15",
    isDynamicPricingEnabled: true,
    greenScore: 85,
    sales: 234,
  },
  {
    id: "2",
    name: "Eco-Friendly Water Bottle",
    description: "Reusable stainless steel water bottle. BPA-free and dishwasher safe.",
    price: 24.99,
    stock: 12,
    category: "Accessories",
    image: "/placeholder.svg?height=200&width=300",
    isDynamicPricingEnabled: false,
    greenScore: 92,
    sales: 89,
  },
  {
    id: "3",
    name: "Whole Grain Bread",
    description: "Freshly baked whole grain bread with organic ingredients.",
    price: 3.49,
    originalPrice: 4.99,
    stock: 8,
    category: "Bakery",
    image: "/placeholder.svg?height=200&width=300",
    expiryDate: "2024-01-10",
    isDynamicPricingEnabled: true,
    greenScore: 78,
    sales: 156,
  },
  {
    id: "4",
    name: "Bamboo Toothbrush Set",
    description: "Sustainable bamboo toothbrushes. Pack of 4 with different colors.",
    price: 12.99,
    stock: 25,
    category: "Personal Care",
    image: "/placeholder.svg?height=200&width=300",
    isDynamicPricingEnabled: false,
    greenScore: 95,
    sales: 67,
  },
]

export default function SellerDashboard() {
  const [products, setProducts] = useState(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const handleToggleDynamicPricing = async (productId: string, enabled: boolean) => {
    // Update local state
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, isDynamicPricingEnabled: enabled } : product)),
    )

    // Here you would make an API call to update the backend
    try {
      const response = await fetch(`/api/products/${productId}/dynamic-pricing`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDynamicPricingEnabled: enabled }),
      })

      if (!response.ok) {
        throw new Error("Failed to update dynamic pricing")
      }

      // If enabled, trigger dynamic pricing calculation
      if (enabled) {
        await fetch(`/api/products/${productId}/calculate-dynamic-price`, {
          method: "POST",
        })
      }
    } catch (error) {
      console.error("Error updating dynamic pricing:", error)
      // Revert the change if API call fails
      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, isDynamicPricingEnabled: !enabled } : product)),
      )
    }
  }

  const handleEdit = (productId: string) => {
    console.log("Edit product:", productId)
    // Implement edit functionality
  }

  const handleDelete = (productId: string) => {
    console.log("Delete product:", productId)
    // Implement delete functionality
  }

  const handleUpdatePrice = async (productId: string, newPrice: number) => {
    setProducts((prev) => prev.map((product) => (product.id === productId ? { ...product, price: newPrice } : product)))

    // API call to update price
    try {
      await fetch(`/api/products/${productId}/price`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price: newPrice }),
      })
    } catch (error) {
      console.error("Error updating price:", error)
    }
  }

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter === "all" || product.category === categoryFilter),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price
        case "stock":
          return b.stock - a.stock
        case "sales":
          return b.sales - a.sales
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const categories = [...new Set(products.map((p) => p.category))]
  const totalProducts = products.length
  const dynamicPricingEnabled = products.filter((p) => p.isDynamicPricingEnabled).length
  const lowStockProducts = products.filter((p) => p.stock < 10).length
  const totalRevenue = products.reduce((sum, p) => sum + p.price * p.sales, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-muted-foreground">Manage your products and pricing</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{totalProducts}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-r from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dynamic Pricing</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{dynamicPricingEnabled}</div>
              <p className="text-xs text-green-600">products enabled</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-r from-orange-50 to-orange-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{lowStockProducts}</div>
              <p className="text-xs text-orange-600">need attention</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-r from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">${totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onToggleDynamicPricing={handleToggleDynamicPricing}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUpdatePrice={handleUpdatePrice}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
