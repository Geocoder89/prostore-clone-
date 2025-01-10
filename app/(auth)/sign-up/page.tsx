import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SignupForm from './sign-up-form';
export const metadata: Metadata = {
  title: 'Sign In',
};

interface SignUpPageProps {
  searchParams: Promise<{callbackUrl: string}>
}

const SignUpPage:React.FC<SignUpPageProps> = async (
 {searchParams}) => {
  
const {callbackUrl} = await searchParams

const session = await auth()
if (session) {
  redirect(callbackUrl || '/')
}
 

  return (
    <div className='w-full max-w-md mx-auto'>
      <Card>
        <CardHeader className='space-y-4'>
          <Link href='/' className='flex-center'>
            <Image
              src='/images/logo.svg'
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
              priority={true}
            />
          </Link>
          <CardTitle className='text-center'>Create an account</CardTitle>
          <CardDescription className='text-center'>
            Enter your information below to signup
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <SignupForm/>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;