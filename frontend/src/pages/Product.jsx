"use client"

import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import products from "../data/products"

const calculateDynamicPrice = (product) => {
  if (!product.dynamicPricing || product.timeToExpiry == null || product.reductionPerDay == null) {
    return product.price
  }

  const daysPassed = Math.max(0, 10 - product.timeToExpiry)
  const discount = (product.initialPrice || product.price) * product.reductionPerDay * daysPassed
  const discountedPrice = (product.initialPrice || product.price) - discount
  const minPrice = (product.initialPrice || product.price) * 0.4

  return Math.max(discountedPrice, minPrice)
}

const Product = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const found = products.find((p) => p.id === Number.parseInt(id))
    if (found) {
      setProduct({
        ...found,
        dynamicPricing: found.dynamicPricing || false,
        initialPrice: found.initialPrice || found.price,
        timeToExpiry: found.timeToExpiry || 5,
        reductionPerDay: found.reductionPerDay || 0.05,
        greenScore: found.greenScore || Math.floor(Math.random() * 40) + 60,
      })
    }
  }, [id])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50">
        <div className="text-center">
          <span className="text-6xl text-gray-300 mb-4 block">📦</span>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Product not found</h2>
          <p className="text-gray-500">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const dynamicPrice = calculateDynamicPrice(product)
  const hasDiscount = product.dynamicPricing && dynamicPrice < (product.initialPrice || product.price)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-12 relative">
              <span className="text-8xl text-gray-400">📦</span>

              {hasDiscount && (
                <div className="absolute top-6 left-6">
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-2 rounded-full animate-pulse">
                    {Math.round(
                      (((product.initialPrice || product.price) - dynamicPrice) /
                        (product.initialPrice || product.price)) *
                        100,
                    )}
                    % OFF
                  </span>
                </div>
              )}

              {product.dynamicPricing && (
                <div className="absolute top-6 right-6">
                  <span className="bg-blue-500 text-white text-sm font-bold px-3 py-2 rounded-full">
                    🤖 Smart Price
                  </span>
                </div>
              )}

              {product.greenScore && (
                <div className="absolute bottom-6 left-6">
                  <span className="bg-green-500 text-white text-sm font-bold px-3 py-2 rounded-full">
                    🌱 Eco Score: {product.greenScore}/100
                  </span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="md:w-1/2 p-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">{product.description}</p>

              {/* Product Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Packaging:</span>
                  <span className="text-gray-800 font-semibold">{product.packaging || "Eco-friendly"}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Shipping:</span>
                  <span className="text-gray-800 font-semibold">{product.shipping || "Standard"}</span>
                </div>

                {product.greenScore && (
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-green-600 font-medium">🌱 Environmental Impact:</span>
                    <span className="text-green-700 font-bold">{product.greenScore}/100</span>
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="text-4xl font-bold text-green-600">${dynamicPrice.toFixed(2)}</span>
                      {hasDiscount && (
                        <span className="text-2xl text-gray-400 line-through">
                          ${(product.initialPrice || product.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {product.dynamicPricing && (
                      <p className="text-sm text-blue-600 mt-2">🤖 AI-optimized pricing for best value</p>
                    )}
                  </div>

                  {hasDiscount && (
                    <div className="text-right">
                      <span className="bg-red-500 text-white text-lg font-bold px-4 py-2 rounded-full">
                        Save ${((product.initialPrice || product.price) - dynamicPrice).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105 text-lg">
                🛒 Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product
