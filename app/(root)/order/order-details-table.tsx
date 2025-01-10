'use client'

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatUUID } from "@/lib/utils";
import { Order } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface OrderDetailsTableProps {
  order: Order
}
const OrderDetailsTable: React.FC<OrderDetailsTableProps> = ({order}) => {

  const {shippingAddress,
    orderItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
    id,
  } = order
  return ( <>
  <h1 className="py-4 text-2xl">
    Order {formatUUID(id)}
    <div className="grid md:grid-cols-3 md:gap-5">
      <div className="col-span-2 space-y-4 overflow-x-auto">
        <Card>
          <CardContent className="p-4 gap-4">
          <h2 className="text-xl pb-4">Payment Method</h2>
          <p className="mb-2">{paymentMethod}</p>
          {
            isPaid ? (<Badge variant='secondary'>
              Paid at {formatDateTime(paidAt!).dateTime}
            </Badge>) : (<Badge variant='destructive'>
              Not Paid
            </Badge>)
          }
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 gap-4">
          <h2 className="text-xl pb-4">Shipping Address</h2>
          <p>{shippingAddress.fullName}</p>
          <p>{shippingAddress.streetAddress}, {shippingAddress.city} </p>
         <p>{shippingAddress.postalCode}, {shippingAddress.country}</p>
          {
            isDelivered ? (<Badge variant='secondary'>
              Paid at {formatDateTime(deliveredAt!).dateTime}
            </Badge>) : (<Badge variant='destructive'>
              Not Delivered
            </Badge>)
          }
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 gap-4">
            <h2 className="text-xl pb-4">Order Items</h2>
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderItems.map((item)=> (
                <TableRow key={item.slug}>
                  <TableCell>
                    <Link href={`/product/${item.slug}`} className="flex items-center">
                    <Image src={item.image} alt={item.name} width={50} height={50} />
                    <span className="px-2"></span>
                    </Link>

                    
                  </TableCell>

                  <TableCell>
                    <span className="px-2">{item.qty}</span>
                  </TableCell>

                  <TableCell className="text-right">
                    ${item.price}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </CardContent>
        </Card>
      </div>


            <div>
            <Card>
              <CardContent className='p-4 gap-4 space-y-4'>
                  <div className="flex justify-between">
                    <div>
                      Items:
                    </div>
                    <div>{formatCurrency(itemsPrice)}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      Tax:
                    </div>
                    <div>{formatCurrency(taxPrice)}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      Shipping:
                    </div>
                    <div>{formatCurrency(shippingPrice)}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      Total:
                    </div>
                    <div>{formatCurrency(totalPrice)}</div>
                  </div>
              </CardContent>
              </Card>
            </div>
          
    </div>
  </h1>
  </> );
}
 
export default OrderDetailsTable;