import Navbar from "@/components/nav/Navbar";
import { ThemedView } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";

import { PrefsProvider } from "@/providers/PrefsProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { UserProvider } from "@/providers/UserProvider";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import 'react-native-get-random-values';
import "react-native-reanimated";
export default function RootLayout() {
  const { theme } = useTheme()
  

  const [loaded, error] = useFonts({
		'Ubuntu-Regular': require('../assets/fonts/Ubuntu-Regular.ttf'),
		'Ubuntu-Bold': require('../assets/fonts/Ubuntu-Bold.ttf'),
		'Ubuntu-Medium': require('../assets/fonts/Ubuntu-Medium.ttf'),
		'Ubuntu-Light': require('../assets/fonts/Ubuntu-Light.ttf'),
		'Ubuntu-LightItalic': require('../assets/fonts/Ubuntu-LightItalic.ttf'),
		'Ubuntu-BoldItalic': require('../assets/fonts/Ubuntu-BoldItalic.ttf'),
		'Ubuntu-MediumItalic': require('../assets/fonts/Ubuntu-MediumItalic.ttf'),
	})
  return (
    <ThemeProvider>
      <UserProvider>
        <PrefsProvider>        
        <StatusBar  />
        
        <ThemedView safe={true} style={{flex:1}}>
          <Navbar />
        
        <Stack>
          <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
        </Stack>
        </ThemedView>
      </PrefsProvider>
      </UserProvider>

    </ThemeProvider>
    

  
)
}
