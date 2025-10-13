import { TileGrid } from '@/components/home/TileGrid';
import { PrimaryButton, Spacer, ThemedText, ThemedView } from '@/components/ui';
import { StyleSheet } from "react-native";
export default function Index() {
  const handlePress = () => {
    console.log("going")

  }
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Hello World</ThemedText>
      <TileGrid />
      {/* <PrimaryButton name="increase" onPress={handlePress} />
      <ThemedText>{myCount}</ThemedText> */}
      <Spacer height={60} />
      <PrimaryButton style={{width:"80%"}} name="Let's Go!" onPress={handlePress} />

      
    </ThemedView>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  }
})
