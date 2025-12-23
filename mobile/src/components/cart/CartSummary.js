import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CartSummary({ subtotal, shipping, discount, total, onCheckout }) {
  return (
    <Card className="p-4">
      <CardContent className="p-0 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Envío</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Descuento</span>
          <span>-${discount.toFixed(2)}</span>
        </div>
        <hr />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Button className="w-full mt-4" onClick={onCheckout}>
          Proceder al Pago
        </Button>
      </CardContent>
    </Card>
  )
}
