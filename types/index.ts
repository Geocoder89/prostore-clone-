import {z} from 'zod'
import { insertProductSchema,insertCartSchema, cartItemSchema, shippingAddressSchema, PaymentMethodSchema, insertOrderItemSchema, InsertOrderSchema} from '@/lib/validators'



export type Product =z.infer<typeof insertProductSchema> & {
id: string;
rating: string;
createdAt: Date;
}

export type Cart = z.infer<typeof insertCartSchema>;
export type cartItem = z.infer<typeof cartItemSchema>
export type ShippingAddress = z.infer<typeof shippingAddressSchema>
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>
export type OrderItem = z.infer<typeof insertOrderItemSchema>
export type Order = z.infer<typeof InsertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  
  paidAt: Date | null;
  isDelivered: boolean
  deliveredAt: Date | null
  orderItems: OrderItem[]
  user: {name: string; email: string}
}