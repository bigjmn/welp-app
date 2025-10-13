import NavLayout from "@/components/nav/NavLayout";
import { ThemedView } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
export default function RootLayout() {
  const { theme } = useTheme()
  return (
    <ThemeProvider>
      <StatusBar  />
      <ThemedView safe={true} style={{flex:1}}>
      <NavLayout />
      <Stack>
        <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
      </Stack>
      </ThemedView>

    </ThemeProvider>
    

  
)
}
