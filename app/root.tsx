import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import { useEffect } from 'react';
import type { Route } from './+types/root';
import './app.css';
import { HeaderMenu } from './components/HeaderMenu';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { currentUserAtom } from './data/userData';
import { onAuthChange } from './lib/auth';
import { contentsAtom } from './data/contentData';
import { getUserProfile, getContents } from './lib/firestore_utils'; // Import getContents

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [contents, setContents] = useAtom(contentsAtom);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in
        // 1. Fetch user profile
        const userProfile = await getUserProfile(firebaseUser.uid);
        setCurrentUser(userProfile);

        // 2. Fetch contents if not already in state (from sessionStorage)
        if (!contents) {
          console.log('Fetching contents from Firestore...');
          const contentsData = await getContents();
          setContents(contentsData);
          console.log('Contents set from Firestore.');
        } else {
          console.log('Contents already in state (from localStorage).');
        }
      } else {
        // User is logged out
        setCurrentUser(null);
        setContents(null); // Clear contents on logout
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setCurrentUser, contents, setContents]);

  return (
    <div className="relative">
      {currentUser && <HeaderMenu />}
      <Outlet />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
