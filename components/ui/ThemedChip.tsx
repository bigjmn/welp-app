import { commonColors } from "@/constants/Colors";
import { Chip } from "@rneui/base";
import { StyleProp, ViewStyle } from "react-native";
interface PrimaryChipProps {
    style?: StyleProp<ViewStyle>;
    name: string; 
    [key: string]: any; 
}
export function PrimaryChip({ style, name, ...props} : PrimaryChipProps) {
    return (
        <Chip
            title={name}
            color={commonColors.primary}
            containerStyle={{margin:4}}
            
            {...props}
            />
    )
}