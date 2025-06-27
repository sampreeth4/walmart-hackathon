"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import products from "../../data/products"

const initialProducts = products

const SellerProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const found = initialProducts.find((p) => p.id === Number.parseInt(id))
    if (found) {
      setProduct({
        ...found,
        dynamicPricing: found.dynamicPricing || false,
        initialPrice: found.initialPrice || found.price,
        timeToExpiry: found.timeToExpiry || 5,
        reductionPerDay: found.reductionPerDay || 0.05,
      })
    }
  }, [id])

  const handleEdit = () => {
    navigate(`/seller/edit/${product.id}`)
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      alert("Product deleted!")
      navigate("/seller/products")
    }
  }

  const handleDonate = () => {
    alert(`Donated "${product.name}" to NGOs!`)
  }

  const toggleDynamicPricing = () => {
    setProduct((prev) => ({
      ...prev,
      dynamicPricing: !prev.dynamicPricing,
    }))
  }

  const calculateDynamicPrice = (p) => {
    if (!p.dynamicPricing || p.timeToExpiry == null || p.reductionPerDay == null) {
      return p.price
    }

    const daysPassed = Math.max(0, 10 - p.timeToExpiry)
    const discount = (p.initialPrice || p.price) * p.reductionPerDay * daysPassed
    const discountedPrice = (p.initialPrice || p.price) - discount
    const minPrice = (p.initialPrice || p.price) * 0.4

    return Math.max(discountedPrice, minPrice)
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50">
        <div className="text-center">
          <span className="text-6xl text-red-400 mb-4 block">❌</span>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Product not found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const dynamicPrice = calculateDynamicPrice(product)
  const hasDiscount = product.dynamicPricing && dynamicPrice < (product.initialPrice || product.price)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12">
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-green-100 text-lg">{product.description}</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Price Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <span className="text-gray-600 block text-sm font-medium mb-2">Current Price</span>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-green-600">${dynamicPrice.toFixed(2)}</span>
                  {hasDiscount && (
                    <span className="text-lg text-gray-400 line-through">
                      ${(product.initialPrice || product.price).toFixed(2)}
                    </span>
                  )}
                </div>
                {product.dynamicPricing && (
                  <p className="text-sm text-green-600 mt-2">
                    🤖 AI-optimized • Min: ${((product.initialPrice || product.price) * 0.4).toFixed(2)}
                  </p>
                )}
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <span className="text-gray-600 block text-sm font-medium mb-2">Shipping</span>
                <span className="text-xl font-semibold text-blue-700">{product.shipping || "Standard"}</span>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <span className="text-gray-600 block text-sm font-medium mb-2">Packaging</span>
                <span className="text-xl font-semibold text-purple-700">{product.packaging || "Eco-friendly"}</span>
              </div>
            </div>

            {/* Dynamic Pricing Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl mb-8 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Dynamic Pricing</h3>
                    <p className="text-gray-600 text-sm">AI-powered price optimization</p>
                  </div>
                </div>
                <button
                  onClick={toggleDynamicPricing}
                  className={`w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300 ease-in-out ${
                    product.dynamicPricing ? "bg-green-500" : "bg-gray-400"
                  }`}
                >
                  <div
                    className={`bg-white w-6 h-6 rounded-full shadow transform transition-transform duration-300 ${
                      product.dynamicPricing ? "translate-x-8" : ""
                    }`}
                  />
                </button>
              </div>

              {product.dynamicPricing && (
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-700 mb-2">Active Features:</h4>
                  <ul className="text-sm text-green-600 space-y-1">
                    <li>✅ Expiry-based pricing adjustments</li>
                    <li>✅ Stock level optimization</li>
                    <li>✅ Demand-based pricing</li>
                    <li>✅ Minimum price protection</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center sm:space-x-6 space-y-4 sm:space-y-0">
              <button
                onClick={handleEdit}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105"
              >
                ✏️ Edit Product
              </button>
              <button
                onClick={handleDelete}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105"
              >
                🗑️ Delete Product
              </button>
              <button
                onClick={handleDonate}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105"
              >
                💝 Donate to NGOs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerProduct
