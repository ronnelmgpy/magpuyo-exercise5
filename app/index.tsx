// app/index.tsx
// Fixes "Unmatched Route" on web (localhost:8081)
import { Redirect } from "expo-router";
export default function Index() {
  return <Redirect href="/login" />;
}
