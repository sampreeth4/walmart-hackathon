import ProductGrid from "../components/ProductGrid"

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        {/* <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to GreenMart</h1> */}
        {/* <p className="text-xl text-gray-600">Shop sustainably with our eco-friendly products</p> */}
      </div>
      <ProductGrid />
    </div>
  )
}

export default HomePage
