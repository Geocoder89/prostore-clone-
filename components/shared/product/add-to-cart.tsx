'use client'
import { useTransition } from "react";
import { Cart, cartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus,Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { addItemToCart,removeItemFromCart } from "@/lib/actions/cart-actions";


interface CartItemProps {
  cart?: Cart
  item: cartItem
}
const AddToCart:React.FC<CartItemProps> = ({cart,item}) => {
  const router = useRouter()
  const {toast} = useToast()
  const [isPending, startTransition] = useTransition()
  const handleAddToCart = async ()=>{

    startTransition(async()=>{
      const response = await addItemToCart(item)

      if(!response.success) {
        toast({
          variant: 'destructive',
          description: response.message
        })
        return
      }
  
      // Handle success add to cart
      toast({
        description: response.message,
        action: (
          <ToastAction className="bg-primary text-white hover:bg-gray-800" altText="Go to Cart" onClick={()=> router.push('/cart')}>
            Go to Cart
          </ToastAction>
        )
      })
    })
   
  }
  // handle remove from cart

  const handleRemoveFromCart  = async ()=>{

    startTransition(async ()=> {
      const response = await removeItemFromCart(item.productId)

      toast({
        variant:  response.success ? 'default' : 'destructive',
        description: response.message
      })
      return 
    })
  
  }

  // check if item is in cart

  const existingItems = cart && cart.items.find((x)=> x.productId === item.productId)
  return ( 
    existingItems ? (
      <div>
        <Button type="button" variant='outline' onClick={handleRemoveFromCart}>
       
        {isPending ? (<Loader className="w-4 h-4 animate-spin"/>) : ( <Minus className="h-4 w-4"/>)}
        </Button>
        <span className="px-2">{existingItems.qty}</span>
        <Button type="button" variant='outline' onClick={handleAddToCart}>
        {isPending ? (<Loader className="w-4 h-4 animate-spin"/>) : ( <Plus className="h-4 w-4"/>)}
        </Button>
      </div>
    ) : (
      <Button className="w-full" type="button" onClick={handleAddToCart}>{isPending ? (<Loader className="w-4 h-4 animate-spin"/>) : ( <Plus className="h-4 w-4"/>)} Add to Cart</Button>
    )
  )
}
 
export default AddToCart;