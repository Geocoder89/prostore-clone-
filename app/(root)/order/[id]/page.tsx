import { getOrderById } from "@/lib/actions/order-actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShippingAddress } from "@/types";
import OrderDetailsTable from "../order-details-table";

export const metadata: Metadata = {
  title: 'Order Details'
}

interface orderDetailsProps {
  params: Promise<{id: string}>
}
const OrderDetailsPage: React.FC <orderDetailsProps> = async ({params}) => {
  const {id} = await params
  const order = await getOrderById(id)

  if(!order) notFound()
  return ( 
    <OrderDetailsTable order={
      {
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress 
      }
    }/>
  );
}
 
export default OrderDetailsPage;