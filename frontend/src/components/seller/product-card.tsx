"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, TrendingUp, Package, Calendar, BarChart3 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  stock: number
  category: string
  image: string
  expiryDate?: string
  isDynamicPricingEnabled: boolean
  greenScore?: number
  sales: number
}

interface ProductCardProps {
  product: Product
  onToggleDynamicPricing: (productId: string, enabled: boolean) => void
  onEdit: (productId: string) => void
  onDelete: (productId: string) => void
  onUpdatePrice: (productId: string, newPrice: number) => void
}

export default function ProductCard({
  product,
  onToggleDynamicPricing,
  onEdit,
  onDelete,
  onUpdatePrice,
}: ProductCardProps) {
  const [isEditingPrice, setIsEditingPrice] = useState(false)
  const [tempPrice, setTempPrice] = useState(product.price)

  const handleDynamicPricingToggle = (checked: boolean) => {
    onToggleDynamicPricing(product.id, checked)
  }

  const handlePriceUpdate = () => {
    onUpdatePrice(product.id, tempPrice)
    setIsEditingPrice(false)
  }

  const getStockStatus = () => {
    if (product.stock === 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (product.stock < 10) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  const getDynamicPriceReduction = () => {
    if (product.originalPrice && product.price < product.originalPrice) {
      const reduction = (((product.originalPrice - product.price) / product.originalPrice) * 100).toFixed(0)
      return `${reduction}% off`
    }
    return null
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant={getStockStatus().variant} className="text-xs">
              {getStockStatus().label}
            </Badge>
            {product.greenScore && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                🌱 {product.greenScore}/100
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(product.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Product</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(product.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Product</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.image || "/placeholder.svg?height=200&width=300"}
            alt={product.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover transition-transform group-hover:scale-105"
          />
          {getDynamicPriceReduction() && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-red-500 text-white">{getDynamicPriceReduction()}</Badge>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {isEditingPrice ? (
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={tempPrice}
                  onChange={(e) => setTempPrice(Number.parseFloat(e.target.value))}
                  className="w-20 h-8"
                  step="0.01"
                />
                <Button size="sm" onClick={handlePriceUpdate}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditingPrice(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">${product.price.toFixed(2)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsEditingPrice(true)} className="h-6 w-6 p-0">
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>{product.stock} units</span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span>{product.sales} sold</span>
          </div>
        </div>

        {product.expiryDate && (
          <div className="flex items-center space-x-2 text-sm text-orange-600">
            <Calendar className="h-4 w-4" />
            <span>Expires: {new Date(product.expiryDate).toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t bg-gray-50/50">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <Checkbox
              id={`dynamic-pricing-${product.id}`}
              checked={product.isDynamicPricingEnabled}
              onCheckedChange={handleDynamicPricingToggle}
            />
            <Label
              htmlFor={`dynamic-pricing-${product.id}`}
              className="text-sm font-medium cursor-pointer flex items-center space-x-2"
            >
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span>Dynamic Pricing</span>
            </Label>
          </div>

          {product.isDynamicPricingEnabled && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    AI Enabled
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Price adjusts based on expiry date and stock levels</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
