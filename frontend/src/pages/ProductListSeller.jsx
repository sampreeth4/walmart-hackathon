"use client"

import products from "../../data/products"
import ProductCardSeller from "../components/seller/ProductCardSeller"
import { useState } from "react"

const initialProducts = products.map((product) => ({
  ...product,
  dynamicPricing: product.dynamicPricing || false,
  initialPrice: product.initialPrice || product.price,
  timeToExpiry: product.timeToExpiry || 5,
  reductionPerDay: product.reductionPerDay || 0.05,
}))

const ProductListSeller = () => {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id))
  }

  const handleToggleDynamicPricing = (id, enabled) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === id ? { ...product, dynamicPricing: enabled } : product)),
    )

    // Here you would typically make an API call to update the backend
    console.log(`Dynamic pricing ${enabled ? "enabled" : "disabled"} for product ${id}`)
  }

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const dynamicPricingCount = products.filter((p) => p.dynamicPricing).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Manage Your Products</h2>
          <p className="text-gray-600 text-lg">Optimize your inventory with AI-powered dynamic pricing</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-gray-800">{products.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Dynamic Pricing</p>
                <p className="text-3xl font-bold text-green-600">{dynamicPricingCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">🤖</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg. Savings</p>
                <p className="text-3xl font-bold text-purple-600">15%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCardSeller
              key={product.id}
              product={product}
              onDelete={handleDelete}
              onToggleDynamicPricing={handleToggleDynamicPricing}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl text-gray-300 mb-4 block">🔍</span>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductListSeller
