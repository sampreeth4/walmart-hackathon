"use client"

import { useNavigate } from "react-router-dom"

const ProductCardSeller = ({ product, onDelete, onToggleDynamicPricing }) => {
  const navigate = useNavigate()

  const handleEdit = (e) => {
    e.stopPropagation()
    navigate(`/seller/edit/${product.id}`)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm("Are you sure you want to delete this product?")) {
      onDelete(product.id)
    }
  }

  const handleCardClick = () => {
    navigate(`/seller/product/${product.id}`)
  }

  const handleDynamicPricingToggle = (e) => {
    e.stopPropagation()
    onToggleDynamicPricing(product.id, !product.dynamicPricing)
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

  const dynamicPrice = calculateDynamicPrice(product)
  const hasDiscount = product.dynamicPricing && dynamicPrice < (product.initialPrice || product.price)

  return (
    <div
      className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-green-200"
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
        <span className="text-gray-400 text-5xl group-hover:scale-110 transition-transform duration-300">📦</span>
        {hasDiscount && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {Math.round(
                (((product.initialPrice || product.price) - dynamicPrice) / (product.initialPrice || product.price)) *
                  100,
              )}
              % OFF
            </span>
          </div>
        )}
        {product.dynamicPricing && (
          <div className="absolute top-3 right-3">
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
              🤖 AI
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-green-600">${dynamicPrice.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-lg text-gray-400 line-through">
                ${(product.initialPrice || product.price).toFixed(2)}
              </span>
            )}
          </div>
          {product.dynamicPricing && (
            <p className="text-xs text-blue-600 mt-1">
              Dynamic pricing enabled • Min: ${((product.initialPrice || product.price) * 0.4).toFixed(2)}
            </p>
          )}
        </div>

        {/* Dynamic Pricing Toggle */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Dynamic Pricing</span>
              <span className="text-xs text-gray-500">🤖</span>
            </div>
            <button
              onClick={handleDynamicPricingToggle}
              className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ease-in-out ${
                product.dynamicPricing ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${
                  product.dynamicPricing ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
          {product.dynamicPricing && (
            <p className="text-xs text-green-600 mt-2">Price adjusts based on expiry and demand</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-md"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCardSeller
