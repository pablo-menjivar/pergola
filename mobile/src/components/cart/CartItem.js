import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CartItem({ item, onRemove }) {
  return (
    <Card className="flex items-center gap-4 p-4">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-xl"
      />
      <CardContent className="flex-1 p-0">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-gray-500">${item.price.toFixed(2)}</p>
      </CardContent>
      <Button
        variant="destructive"
        onClick={() => onRemove(item.id)}
      >
        Quitar
      </Button>
    </Card>
  )
}
