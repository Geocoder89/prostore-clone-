import CartTable from "./cart-table"
import { getMyCart } from "@/lib/actions/cart-actions";
export const metadata= {
  title: 'Shopping Cart'
}
const CartPage = async () => {
  const cartResponse = await getMyCart()
  return ( <>
  <CartTable cart={cartResponse}/>
  </> );
}
 
export default CartPage;