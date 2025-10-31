import PlaceCard from "@/components/results/CardFlip";
import DrumRoll from "@/components/results/DrumRoll";
import { ThemedText, ThemedView } from "@/components/ui";
import { useUser } from "@/hooks/useUser";
import { useWelpSearch } from "@/hooks/useWelpSearch";
import { shufflePrefs } from "@/utils/randomizers";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming
} from "react-native-reanimated";
// }

export default function Result(){
    const [result, setResult] = useState<ResultData|null>(null)
    const [weightedResults, setWeightedResults] = useState<ResultData[]|null>(null)
    const [resultIdx, setResultIdx] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const { serviceType, searchInput }:{serviceType:ServiceType,searchInput:string} = useLocalSearchParams()
    const { getResults } = useWelpSearch()
    const { user } = useUser()

    const [showCard, setShowCard] = useState(false);
    const [showButtons, setShowButtons] = useState(false);

  const showButtonsDelayed = useCallback(() => {
    setShowButtons(true);
  }, []);

    useEffect(() => {
        if (!user){
            return
        }
        if (weightedResults){
            console.log(weightedResults.length)
            setResultIdx(x => x+1)
            return
        }
        const {preferUnseen, orderHistory} = user
        getResults(serviceType, searchInput)
        .then((resultOb) => {
            if (resultOb.errMessage !== null){
                throw Error(resultOb.errMessage)
            }
            const shuffledResults = shufflePrefs(orderHistory, resultOb.resultList, preferUnseen)
            setWeightedResults(shuffledResults)
        }).catch((e) => console.log(e))
        .finally(() => {
            setIsLoading(false)
        })
    }, [serviceType, searchInput])
    const handleReject = () => {
        console.log('rejection handler')
    }
    const handleAccept = () => {
        console.log('accept handler')
    }
    const handleCountdownFinished = useCallback(() => {
    setShowCard(true);
    setShowButtons(false);
  }, []);

    return (
        <ThemedView style={styles.screen}>
            <ThemedText>Welp, you're getting...</ThemedText>
            {(!showCard) ? (
                <DrumRoll 
                    continueAnimating={isLoading} 
                    onFinished={handleCountdownFinished} 
                    />
                ) : (weightedResults && weightedResults.length > resultIdx) ? (
                    <>
                    <DataFetchedCard unlockButtons={showButtonsDelayed} result={weightedResults[resultIdx]} />
                    <ButtonsColumn visible={showButtons} />
                    </>
                ) : 
                (<ThemedText>Nothing!</ThemedText>)}
            
        </ThemedView>
    )


}


function DataFetchedCard({ unlockButtons, result }: { unlockButtons: () => void, result:ResultData }) {
  const rotation = useSharedValue(-180);
  const scale = useSharedValue(0.4);

  useEffect(() => {
    rotation.value = withTiming(
      0,
      {
        duration: 750,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        "worklet";
        if (finished) {
          runOnJS(unlockButtons)();
        }
      }
    );
    scale.value = withTiming(1, {
      duration: 750,
      easing: Easing.out(Easing.cubic),
    });
  }, [rotation, scale, unlockButtons]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <PlaceCard result={result} />
    </Animated.View>
  );
}

function ButtonsColumn({ visible }: { visible: boolean }) {
  const baseDelay = 600;
  const offsets = useMemo(() => [0, 160], []);
  const buttons = useMemo(
    () => [
      { label: "Welp, I tried it", onPress: () => {} },
      { label: "No welping way.", onPress: () => {} },
    ],
    []
  );

  return (
    <ThemedView style={styles.buttonsWrapper}>
      {buttons.map((button, index) => (
        <SlidingButton
          key={button.label}
          label={button.label}
          onPress={button.onPress}
          visible={visible}
          delay={baseDelay + offsets[index]}
        />
      ))}
    </ThemedView>
  );
}

type SlidingButtonProps = {
  label: string;
  visible: boolean;
  delay: number;
  onPress: () => void;
};

function SlidingButton({
  label,
  visible,
  delay,
  onPress,
}: SlidingButtonProps) {
  const { width } = useWindowDimensions();
  const offscreen = width + 120;
  const translate = useSharedValue(offscreen);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translate.value = withDelay(
        delay,
        withSpring(0, {
          damping: 18,
          stiffness: 90,
          mass: 1,
        })
      );
      opacity.value = withDelay(
        delay,
        withTiming(1, {
          duration: 450,
          easing: Easing.out(Easing.cubic),
        })
      );
    } else {
      translate.value = offscreen;
      opacity.value = 0;
    }
  }, [delay, offscreen, opacity, translate, visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translate.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.buttonWrapper, animatedStyle]}>
      <Pressable onPress={onPress} style={styles.button}>
        <ThemedText style={styles.buttonText}>{label}</ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    
  },
  card: {
    width: 320,
    height: 350,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#161616",
    backfaceVisibility: "hidden",
  },
  buttonsWrapper: {
    marginTop: 24,
    width: "70%",
  },
  buttonWrapper: {
    marginTop: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#646CFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
