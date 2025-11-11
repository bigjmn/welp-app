import { commonColors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useTheme";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import ThemedText from "./ThemedText";

interface PrimaryButtonProps {
    style?: StyleProp<ViewStyle>;
    name: string;
    [key: string]: any;
  }

interface UnderlinedButtonProps {
    style?: StyleProp<ViewStyle>;
    name: string;
    isActive:boolean;
    [key: string]: any;
  }
interface ThemedButtonProps {
    style?: StyleProp<ViewStyle>;
    [key: string]: any;
  }
 export function ThemedButton({ style, ...props }: ThemedButtonProps) {

  
    return (
      <Pressable 
        style={({ pressed }) => [styles.btn, pressed && styles.pressed, style]} 
        {...props}
      />
    )
  }
export function PrimaryButton({ style, name, ...props }: PrimaryButtonProps){
    return (
        <Pressable 
        style={({ pressed }) => [styles.btn, pressed && styles.pressed, style]} 
        {...props}
      >
        <ThemedText style={{color: "#fff"}}>{name}</ThemedText>
      </Pressable>
    )
}

export function UnderlinedButton({style, name, isActive, ...props}:UnderlinedButtonProps){
  const { colors } = useTheme()

  return (
    <Pressable 
    style={({pressed}) => [styles.ulineBtn, pressed && styles.pressed, style]}
    {...props}
    >
      <ThemedText variant="medium" style={{color: isActive ? colors.secondary : colors.text, textDecorationLine:"underline" }}>
        {name}
      </ThemedText>

    </Pressable>
  )

}
  const styles = StyleSheet.create({
    btn: {
      backgroundColor: commonColors.primary,
      padding: 10,
      borderRadius: 6,
      marginVertical: 5,
      alignItems: "center",
      
    },
    pressed: {
      opacity: 0.5
    },
    ulineBtn: {
      padding: 10,
      borderRadius: 6,
      marginVertical: 5,
      alignItems: "center",
    }
  })
  
