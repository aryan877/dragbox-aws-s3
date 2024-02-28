'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/schemas/signInSchema';
import { useSignIn } from '@clerk/nextjs';

export default function SignInForm() {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    if (!isLoaded) return;

    try {
      const completeSignIn = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      if (completeSignIn.status === 'complete') {
        await setActive({ session: completeSignIn.createdSessionId });
        router.push('/dashboard');
      } else {
        console.error('Sign-in incomplete:', completeSignIn.status);
        alert('Sign-in incomplete. Please try again.');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      alert(`Sign-in error: ${error}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Welcome Back to Dragbox</h2>
          <p>Sign in to access and manage your files</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email/Username</span>
              </label>
              <input
                type="text"
                {...register('identifier')}
                className={`input input-bordered ${
                  errors.identifier ? 'input-error' : ''
                }`}
              />
              {errors.identifier && (
                <span className="text-red-500">
                  {errors.identifier.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                {...register('password')}
                className={`input input-bordered ${
                  errors.password ? 'input-error' : ''
                }`}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Sign In
            </button>
          </form>
          <div className="text-center mt-4">
            <p>
              Not a member yet?{' '}
              <Link href="/sign-up" className="link link-primary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
