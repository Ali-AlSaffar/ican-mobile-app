import { Redirect, Slot } from 'expo-router';

const isLoggedIn = false; 

export default function AuthLayout() {
  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Slot />;
}
