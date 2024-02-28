import { NextResponse } from 'next/server';
import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/sign-in', '/sign-up', '/', '/api/uploadthing'],
  afterAuth(auth, req) {
    // Check if the request is for the /api/uploadthing route
    const isUploadThingRoute = req.url.includes('/api/uploadthing');

    // Handle users who aren't authenticated and trying to access a protected route
    if (!auth.userId && !auth.isPublicRoute && !isUploadThingRoute) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    // If the user is logged in and trying to access a public route (excluding /api/uploadthing), redirect them to the dashboard
    if (auth.userId && auth.isPublicRoute && !isUploadThingRoute) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    // Allow users to proceed if they are visiting a public route or if they are authenticated and accessing a protected route
    return NextResponse.next();
  },
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
