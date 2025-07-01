import { Redirect, Slot } from 'expo-router';

const isLoggedIn = false; 

export default function TabsLayout() {
  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Slot />;
}
