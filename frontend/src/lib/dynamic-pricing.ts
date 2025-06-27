// Dynamic pricing calculation logic
export interface DynamicPricingParams {
  originalPrice: number
  stock: number
  expiryDate?: string
  salesVelocity: number
  demandScore?: number
}

export function calculateDynamicPrice(params: DynamicPricingParams): number {
  const { originalPrice, stock, expiryDate, salesVelocity, demandScore = 1 } = params

  let adjustedPrice = originalPrice

  // Stock-based adjustment
  if (stock < 5) {
    adjustedPrice *= 0.8 // 20% discount for very low stock
  } else if (stock < 10) {
    adjustedPrice *= 0.9 // 10% discount for low stock
  }

  // Expiry-based adjustment
  if (expiryDate) {
    const daysUntilExpiry = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry <= 1) {
      adjustedPrice *= 0.5 // 50% discount for items expiring today/tomorrow
    } else if (daysUntilExpiry <= 3) {
      adjustedPrice *= 0.7 // 30% discount for items expiring in 2-3 days
    } else if (daysUntilExpiry <= 7) {
      adjustedPrice *= 0.85 // 15% discount for items expiring in a week
    }
  }

  // Sales velocity adjustment
  if (salesVelocity < 0.5) {
    adjustedPrice *= 0.9 // 10% discount for slow-moving items
  }

  // Demand-based adjustment
  adjustedPrice *= demandScore

  // Ensure minimum price (e.g., 30% of original)
  const minimumPrice = originalPrice * 0.3

  return Math.max(adjustedPrice, minimumPrice)
}

export async function updateProductDynamicPricing(productId: string) {
  // This would typically fetch product data from your database
  // and update the price based on current conditions

  try {
    const response = await fetch(`/api/products/${productId}`)
    const product = await response.json()

    if (product.isDynamicPricingEnabled) {
      const newPrice = calculateDynamicPrice({
        originalPrice: product.originalPrice || product.price,
        stock: product.stock,
        expiryDate: product.expiryDate,
        salesVelocity: product.salesVelocity || 1,
        demandScore: product.demandScore || 1,
      })

      // Update the product price
      await fetch(`/api/products/${productId}/price`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price: newPrice }),
      })

      return newPrice
    }
  } catch (error) {
    console.error("Error updating dynamic pricing:", error)
    throw error
  }
}
