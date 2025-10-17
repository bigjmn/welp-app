import { useTheme } from '@/hooks/useTheme';
import { StyleProp, TextInput, TextStyle } from 'react-native';
interface ThemedTextInputProps {
  style?: StyleProp<TextStyle>;
  [key: string]: any;
}
export default function ThemedTextInput({ style, ...props }: ThemedTextInputProps) {
  const {theme, colors} = useTheme()

  return (
    <TextInput 
    autoCapitalize='none'
      style={[
        {
          backgroundColor: colors.uiBackground, 
          color: colors.text,
          padding: 20,
          borderRadius: 6,
          width: '80%',
          borderColor: "#8FD6B6"
          
        }, 
        style
      ]}
      {...props}
    />
  )
}

