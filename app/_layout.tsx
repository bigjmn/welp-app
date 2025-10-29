import { ThemedView } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { UserProvider } from "@/providers/UserProvider";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import 'react-native-get-random-values';
export default function RootLayout() {
  const { theme } = useTheme()
  return (
    <ThemeProvider>
      <UserProvider>
      <StatusBar  />
      <ThemedView safe={true} style={{flex:1}}>
      
      <Stack>
        <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
      </Stack>
      </ThemedView>
      </UserProvider>

    </ThemeProvider>
    

  
)
}
