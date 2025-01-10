'use server';
import {
  PaymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signupFormSchema,
} from '../validators';
import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { formatError } from '../utils';
import { PaymentMethod, ShippingAddress } from '@/types';
// Sign in the user with credentials

export const signInWithCredentials = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', user);

    return {
      success: true,
      message: 'Signed in successfully',
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: 'Invalid email or password',
    };
  }
};

//  Sign user out

export const signOutUser = async () => {
  await signOut();
};

// sign up user

export const signUpUser = async (prevState: unknown, formData: FormData) => {
  try {
    const user = signupFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });
    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);

    // add user to db

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });
    return {
      success: true,
      message: 'User registered successfully',
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error),
    };
  }
};

// Get user by id

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) throw new Error('User not found');
  return user;
};

// update the user's address

export const updateUserAddress = async (data: ShippingAddress) => {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) {
      throw new Error('User not found');
    }

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: { address },
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

// Update users payment method

export const updateUserPaymentMethod = async (data: PaymentMethod) => {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error('User not found');

    const paymentMethod = PaymentMethodSchema.parse(data)

    await prisma.user.update({
      where: {id: currentUser.id},
      data: {
        paymentMethod: paymentMethod.type
      }
    })

    return {
      success: true,
      message: 'User updated successfully'
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};
