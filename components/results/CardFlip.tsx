import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { PrimaryChip, Spacer, ThemedText, ThemedView } from '../ui';
const RegularContent = ({result}:ResultCardProps) => {
    const { name, imageUrl } = result 
    const { colors } = useTheme()
  return (
    <ThemedView style={[regularContentStyles.card, {backgroundColor: colors.uiBackground}]}>
        <Image 
            style={regularContentStyles.image}
            source={imageUrl}
            contentFit='cover'
        />
        <ThemedView style={regularContentStyles.content}>

        
      <ThemedText variant='header2'>{name}</ThemedText>
      <ThemedView style={{display:'flex', width:"100%", flexWrap:"wrap",flexDirection:'row',alignItems:'center',backgroundColor:"transparent"}}>
        {result.categories.map((rescat, i) => (
            <PrimaryChip
                name={rescat}
                key={i}
                />
        ))}
      </ThemedView>
      </ThemedView>
      <ThemedText variant='italicStyle'>(flip for details)</ThemedText>
    </ThemedView>
  );
};

const regularContentStyles = StyleSheet.create({
  card: {
    flex: 1,
    // backgroundColor: '#b6cff7',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  image: {
        
        
        width: "100%",
        height: 240,
        
        borderTopLeftRadius:10,
        borderTopRightRadius:10
    },
  text: {
    color: Colors.primary,
  },
  content: {
    padding: 20,
    gap: 16,
  }
});

const FlippedContent = ({result}:ResultCardProps) => {
    const { name, url, categories, displayAddress, displayPhone } = result
    const { colors } = useTheme()
  return (
    <View style={[flippedContentStyles.card, {backgroundColor: colors.uiBackground}]}>
        <ThemedView style={[flippedContentStyles.cardHead]}>
            <ThemedText style={flippedContentStyles.headertext} variant={"header"}>{name}</ThemedText>
        </ThemedView>
        <Spacer height={5} />
        <ThemedView style={flippedContentStyles.line} />
        <Spacer height={5} />
        <ThemedView style={flippedContentStyles.cardRow}>
            <ThemedText style={flippedContentStyles.text}>{categories.join(', ')}</ThemedText>
        </ThemedView>
        <Spacer height={5} />
        <ThemedView style={flippedContentStyles.line} />
        <Spacer height={5} />
        <ThemedView style={flippedContentStyles.cardRow}>
            <Ionicons name="location" color={colors.iconColor} size={24} />
            <Spacer width={10} />
            <ThemedText style={flippedContentStyles.text}>{displayAddress}</ThemedText>
        </ThemedView>
        <Spacer height={5} />
        <ThemedView style={flippedContentStyles.line} />
        <Spacer height={5} />
        
        <ThemedView style={flippedContentStyles.cardRow}>
            <Ionicons name="call" color={colors.iconColor} size={24} />
            <Spacer width={10} />
            <ThemedText style={flippedContentStyles.text}>{displayPhone}</ThemedText>
        </ThemedView>
        <Spacer height={5} />
    </View>
  );
};

const flippedContentStyles = StyleSheet.create({
  card: {
    flex: 1,
    
    borderRadius: 16,
    
    alignItems: 'flex-start',
    padding:6,
  },
  cardHead: {
    display:'flex',
    flexDirection:'row',
    padding:8,
    justifyContent:'center',
    width:"100%",
    backgroundColor:"transparent"


  },
  headertext:{
    color:Colors.primary,
    textDecorationLine:"underline"
  },
  text: {
    color: Colors.primary,
    fontSize:18
  },
  cardRow: {
    display:'flex',
    flexDirection:'row',
    padding:3,
    alignItems:"center",
    backgroundColor:"transparent"
   

  },
  line: {
    
    width:"90%",
    
    height: 2, // Thickness of the line
    backgroundColor: '#e2e2e2', // Color of the line
  },
});

interface FlipCardProps {
    isFlipped:SharedValue<boolean>;
    direction?:string;
    duration?:number;
    RegularContent:React.ReactNode;
    FlippedContent:React.ReactNode;
    cardStyle:Record<string,any>;
}
const FlipCard = ({
  isFlipped,
  cardStyle,
  direction = 'y',
  duration = 500,
  RegularContent,
  FlippedContent,
}:FlipCardProps) => {
  const isDirectionX = direction === 'x';

  const regularCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration });

    return {
      transform: [
        isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
      ],
    };
  });

  const flippedCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration });

    return {
      transform: [
        isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
      ],
    };
  });

  return (
    <View>
      <Animated.View
        style={[
          flipCardStyles.regularCard,
          cardStyle,
          regularCardAnimatedStyle,
        ]}>
        {RegularContent}
      </Animated.View>
      <Animated.View
        style={[
          flipCardStyles.flippedCard,
          cardStyle,
          flippedCardAnimatedStyle,
        ]}>
        {FlippedContent}
      </Animated.View>
    </View>
  );
};

const flipCardStyles = StyleSheet.create({
  regularCard: {
    position: 'absolute',
    zIndex: 1,
  },
  flippedCard: {
    zIndex: 2,
  },
});


export default function PlaceCard({result}:ResultCardProps) {
  const isFlipped = useSharedValue(false);

  const handlePress = () => {
    isFlipped.value = !isFlipped.value;
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
        <FlipCard
        isFlipped={isFlipped}
        cardStyle={styles.flipCard}
        FlippedContent={<FlippedContent result={result} />}
        RegularContent={<RegularContent result={result} />}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 500,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:10,
    padding:6
  },
  buttonContainer: {
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#b58df1',
    padding: 12,
    borderRadius: 48,
  },
  toggleButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  flipCard: {
    width: 300,
    height: 330,
    borderRadius:10,
    backfaceVisibility: 'hidden',
  },
});
