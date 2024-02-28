'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { truncate } from '@/helpers/truncate';
import { useClerk } from '@clerk/nextjs';

function Navbar() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="navbar bg-base-100 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="navbar-start">
        <a href="#" className="btn btn-ghost normal-case text-xl">
          Dragbox
        </a>
      </div>
      <div className="navbar-end">
        {isSignedIn ? (
          <>
            <span className="mr-4">
              Welcome,{' '}
              {truncate(
                user.firstName ||
                  user.username ||
                  user.emailAddresses[0].emailAddress
              )}
            </span>
            <button
              className="btn btn-active btn-primary"
              onClick={() => {
                signOut();
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/sign-in" className="btn">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
