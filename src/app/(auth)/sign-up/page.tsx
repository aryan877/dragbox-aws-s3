'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { signUpSchema } from '@/schemas/signUpSchema';
import { useSignUp } from '@clerk/nextjs';
import { z } from 'zod';

export default function SignUpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const { signUp, setActive } = useSignUp();

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const handleSignUpSubmit: SubmitHandler<
    z.infer<typeof signUpSchema>
  > = async (data) => {
    if (!signUp) {
      return;
    }
    setIsSubmitting(true);
    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setVerifying(true);
    } catch (error) {
      alert(`Sign up failed: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async (e) => {
    if (!signUp) {
      return;
    }
    e.preventDefault();
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/dashboard');
      } else {
        alert('Verification failed. Please try again.');
      }
    } catch (error) {
      alert(`Verification failed: ${error}`);
    }
  };

  if (verifying) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Verify Your Email</h2>
            <p>Please enter the verification code sent to your email.</p>
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Verification Code</span>
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="input input-bordered"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Verify
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Join Dragbox</h2>
          <p>Sign up to start managing your files effortlessly</p>
          <form
            noValidate
            onSubmit={handleSubmit(handleSignUpSubmit)}
            className="space-y-4"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                {...register('email')}
                className={`input input-bordered ${
                  errors.email ? 'input-error' : ''
                }`}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
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
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
          <div className="text-center mt-4">
            <p>
              Already have an account?{' '}
              <Link href="/sign-in" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
