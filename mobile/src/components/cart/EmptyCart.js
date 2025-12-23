import { ShoppingCart } from "lucide-react"

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <ShoppingCart size={48} />
      <p className="mt-2">Tu carrito está vacío</p>
    </div>
  )
}
