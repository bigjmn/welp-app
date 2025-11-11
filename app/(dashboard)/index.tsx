import FinderOptions from '@/components/home/FinderOptions';
import { TileGrid } from '@/components/home/TileGrid';
import { Spacer, ThemedLogo, ThemedText, ThemedView } from '@/components/ui';
import { StyleSheet } from "react-native";

export default function Index() {
  
  return (
    <ThemedView style={styles.container}>
      <Spacer height={20} />
      <ThemedLogo />
      {/* <ThemedText variant={"title"}>Welp.</ThemedText> */}
      <ThemedText variant={"italic"}>No options. Just answers.</ThemedText>
      <FinderOptions />
        

      
      
      <TileGrid />
      {/* <PrimaryButton name="increase" onPress={handlePress} />
      <ThemedText>{myCount}</ThemedText> */}
      
      
      

      
    </ThemedView>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  }
})
