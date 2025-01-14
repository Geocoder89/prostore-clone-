'use server'

import { isRedirectError } from "next/dist/client/components/redirect-error"
import { convertToPlainObject, formatError } from "../utils"
import { auth } from "@/auth"
import { getMyCart } from "./cart-actions"
import { getUserById } from "./user-actions"
import { InsertOrderSchema } from "../validators"
import { prisma } from "@/db/prisma"
import { cartItem } from "@/types"

// Create the order and create the order items

export const createOrder = async ()=> {

  try {
    // get session

    const session = await auth()

    if(!session) throw new Error('User is not authenticated')

    const cart = await getMyCart()
    const userId = session?.user?.id

    if(!userId){
      throw new Error('User not found')
    }
    const user = await getUserById(userId)

    if(!cart || cart.items.length === 0) {
      return {success: false, message: 'Your cart is empty', redirectTo: '/cart'}
    }
    if(!user.address) {
      return {success: false, message: 'No Shpping address', redirectTo: '/shipping-address'}
    }
    if(!user.paymentMethod) {
      return {success: false, message: 'No Payment method', redirectTo: '/payment-method'}
    }

    // created order object

    const order = InsertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      shippingPrice: cart.shippingPrice,
      itemsPrice: cart.itemsPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice
    })

    // create a transaction to create order and order items in db

  const insertedOrderId =  await prisma.$transaction(async(tx)=>{
      //  create order 

      const insertedOrder = await tx.order.create({
        data: order
      })

      // Create order items from the cart items

      for (const item of cart.items as cartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id
          }
        })
      }

      // clear cart

      await tx.cart.update({
        where: {id: cart.id},
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0
        }
      })
      return insertedOrder.id
    })

    if(!insertedOrderId){
      throw new Error('Order not created')
    }

    return {
      success: true,
      message: 'Order Created',
      redirectTo: `/order/${insertedOrderId}`
    }
  } catch (error) {
    if(isRedirectError(error)) throw error

    return {
      success: false,
      message: formatError(error)
    }
  }
}

// Get by order by id

export const getOrderById = async (orderId: string)=> {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId
    },
    include: {
      orderItems: true,
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  })

  return convertToPlainObject(data)
}