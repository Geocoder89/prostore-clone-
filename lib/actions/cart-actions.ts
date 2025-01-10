'use server';
import { cookies } from 'next/headers';
import {
  convertToPlainObject,
  formatError,
  roundToTwoDecimalPlaces,
} from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '../validators';
import { cartItem } from '@/types';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

// Calculate cart prices

const calcPrice = (items: cartItem[]) => {
  const itemsPrice = roundToTwoDecimalPlaces(
      items.reduce((acc, item) => {
        return acc + Number(item.price) * item.qty;
      }, 0)
    ),
    shippingPrice = roundToTwoDecimalPlaces(itemsPrice > 100 ? 0 : 10),
    taxPrice = roundToTwoDecimalPlaces(0.15 * itemsPrice),
    totalPrice = roundToTwoDecimalPlaces(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};
export const addItemToCart = async (data: cartItem) => {
  try {
    // check for cart cookie

    const sessionCartId = (await cookies()).get('sessionCartId')?.value;

    if (!sessionCartId) {
      throw new Error('Cart session not found');
    }
    // get session and user Id

    const session = await auth();
    // if there is a user it is assigned if not it gives undefined
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // GET CART

    const cart = await getMyCart();

    // Parse and validate item

    const item = cartItemSchema.parse(data);

    // Find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error('Product not found');

    // if not anything in cart, add the new product into cart
    if (!cart) {
      // create new cart object

      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      // Add new cart to db

      await prisma.cart.create({
        data: newCart,
      });

      // revalidate the product page

      revalidatePath(`/product/${product.slug}`);

      // return success message
      return {
        success: true,
        message: `${product.name}added to Cart`,
      };
    } 
    //if product is already added, increase the quantity so multiple entries of item are not in the db
    else {
        const existingItem = (cart.items as cartItem[]).find((cartItem)=> cartItem.productId === item.productId)

        if(existingItem) {
          // check stock
          if(product.stock < existingItem.qty + 1) {
            throw new Error('Not enough stock')
          }
          // Increase the quantity

          (cart.items as cartItem[]).find((cartItem)=> cartItem.productId === item.productId)!.qty = existingItem.qty + 1
        } else{
          // if item does not exist in cart

          if(product.stock < 1) throw new Error('Not enough stock')
          // check stock

          // add item to cart.items

          cart.items.push(item)
        }

        // Save to db

        await prisma.cart.update({
          where: {
            id: cart.id
          },
          data: {
            items: cart.items as Prisma.CartUpdateitemsInput[],
            ...calcPrice(cart.items as cartItem[])
          }
        })
        revalidatePath(`/product/${product.slug}`)

        return {
          success: true,
          message: `${product.name} ${existingItem ? 'updated in' : 'added to'} cart`
        }
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const getMyCart = async () => {
  // check for cart cookie

  const sessionCartId = (await cookies()).get('sessionCartId')?.value;

  if (!sessionCartId) {
    throw new Error('Cart session not found');
  }
  // get session and user Id

  const session = await auth();
  // if there is a user it is assigned if not it gives undefined
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  console.log(userId);
  //  Get user cart from db

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // convert decimals and return

  return convertToPlainObject({
    ...cart,
    items: cart.items as cartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
};

// remove items from cart action

export const removeItemFromCart = async (productId: string)=>{
  try {
   // check for cart cookie

   const sessionCartId = (await cookies()).get('sessionCartId')?.value;

   if (!sessionCartId) {
     throw new Error('Cart session not found');
   }
   const product = await prisma.product.findFirst({
    where: {
      id: productId
    }
   })
   if(!product) {
    throw new Error('Product not found')
   }
  //  Get user's cart

  const cart = await getMyCart()

  if(!cart) {
    throw new Error('Cart not found')
  }

  // check for item

  const existingCartItem = (cart.items as cartItem[]).find((x)=> x.productId === productId)

  if(!existingCartItem) {
    throw new Error('Item not found')
  }

  // if one item remove completely
  if(existingCartItem.qty === 1) {
    cart.items = (cart.items as cartItem[]).filter((x)=> x.productId !== existingCartItem.productId)
  } else {
    // if the items is more than one decrease quantity

   (cart.items as cartItem[]).find((x)=> x.productId === productId)!.qty = existingCartItem.qty - 1
  }

  // update cart in db
  await prisma.cart.update({
    where:{
      id: cart.id
    },
    data: {
      items: cart.items as Prisma.CartUpdateitemsInput[],
      ...calcPrice(cart.items as cartItem[])
    }
  })

  revalidatePath(`/products/${product.slug}`)

  return {
    success: true,
    message: `${product.name} was removed from cart`
  }
  } catch (error) {
    return {
        success: false,
        message:formatError(error)
      }
  }
}
