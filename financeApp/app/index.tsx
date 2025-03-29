import { Redirect } from 'expo-router';

// This is the root index file that will be shown first when app starts
// Immediately redirect to auth/sign-in
export default function Index() {
  return <Redirect href="/auth/sign-in" />;
}
