"use client"

import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"

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

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.stopPropagation()
    e.preventDefault()
    addToCart(product)
  }

  const dynamicPrice = calculateDynamicPrice(product)
  const hasDiscount = product.dynamicPricing && dynamicPrice < (product.initialPrice || product.price)

  return (
    <div className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-green-200">
      <Link to={`/product/${product.id}`} className="block">
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
          <span className="text-gray-400 text-5xl group-hover:scale-110 transition-transform duration-300">📦</span>

          {hasDiscount && (
            <div className="absolute top-3 left-3">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
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
                🤖 Smart Price
              </span>
            </div>
          )}

          {product.greenScore && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                🌱 Eco {product.greenScore}/100
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
        </div>
      </Link>

      <div className="px-5 pb-5 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-green-600">${dynamicPrice.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-lg text-gray-400 line-through">
                ${(product.initialPrice || product.price).toFixed(2)}
              </span>
            )}
          </div>
          {product.dynamicPricing && <p className="text-xs text-blue-600 mt-1">🤖 AI-optimized price</p>}
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard
