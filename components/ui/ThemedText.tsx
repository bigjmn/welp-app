import { StyleProp, Text, TextStyle } from 'react-native';
import { defaultStyle, italicStyle, voteAnswerStyle } from '../../constants/TextTypeStyles';
import { useTheme } from '../../hooks/useTheme';
interface ThemedTextProps {
    style?: StyleProp<TextStyle>; 
    title?: boolean;
    variant?: TextVariant;
    [key: string]: any; 
}
const ThemedText = ({ style, title = false, variant="regular", ...props}: ThemedTextProps) => {
    const { theme, colors } = useTheme()

    const textColor = title ? colors.title : colors.text 

    if (variant === "title"){
        return (
            <Text 
                style={[{color: textColor, fontFamily: "Ubuntu-Bold", fontWeight: 700, fontSize:50}, style]}
                {...props}
                />
        )
    }

    if (variant === "header"){
        return (
            <Text 
                style={[{color: textColor, fontFamily: "Ubuntu-Medium", fontWeight: 500, fontSize:30}, style]}
                {...props}
                />
        )
    }
    if (variant === "tabText"){
        return (
            <Text 
                style={[{color: textColor, fontFamily: "Ubuntu-Medium", fontWeight: 500, fontSize:16}, style]}
                {...props}
                />
        )
    }
    if (variant === "dateText"){
        return (
            <Text 
                style={[{color: textColor, fontFamily: "Ubuntu-Light", fontWeight: 300, fontSize:10}, style]}
                {...props}
                />
        )
    }
    if (variant === "promptText"){
        return (
            <Text 
                style={[{color: textColor}, defaultStyle, style]}
                {...props}
                />
        )
    }
    if (variant === "voteAnswer"){
        return <Text style={[voteAnswerStyle, style]}
        {...props}
        />
    }
    if (variant === "italicStyle"){
        return (
            <Text 
                style={[{color: textColor}, italicStyle, style]}
                {...props}
                />
        )

    }


    return (
        <Text 
            style={[{color: textColor, fontFamily: "Ubuntu-Light", fontWeight:300, fontSize: 14}, style]}
            {...props}
            />
    )
}

export default ThemedText