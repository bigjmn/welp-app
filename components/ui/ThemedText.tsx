import { StyleProp, Text, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
interface ThemedTextProps {
    style?: StyleProp<TextStyle>; 
    variant?: TextVariant;
    [key: string]: any; 
}
const ThemedText = ({ style, ...props}: ThemedTextProps) => {
    const { theme, colors } = useTheme()

    const textColor = colors.text 

    


    return (
        <Text 
            style={[{color: textColor}, style]}
            {...props}
            />
    )
}

export default ThemedText