'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signUpDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signUpUser} from '@/lib/actions/user-actions';
import { useSearchParams } from 'next/navigation';
const SignupForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: '',
  });
  const searchParams = useSearchParams()

  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button className="w-full" variant="default" disabled={pending}>
        {pending ? 'Submitting....' : 'Sign up'}
      </Button>
    );
  };
  return (
    <form action={action}>
      <input type='hidden' name='callbackUrl' value={callbackUrl}/>
      <div className="space-y-6">

      <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
           
            autoComplete="name"
            defaultValue={signUpDefaultValues.name}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
           
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
           
            autoComplete="password"
            defaultValue={signUpDefaultValues.confirmPassword}
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
           
            autoComplete="confirmPassword"
            defaultValue={signUpDefaultValues.password}
          />
        </div>

        <div>{<SignInButton />}</div>
        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
        <div className="text-sm text-center text-muted-foreground">
         Already have an account?{' '}
          <Link href="/signin" target="_self" className="link">
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignupForm;
