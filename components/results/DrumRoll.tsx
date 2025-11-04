import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
    withTiming,
} from "react-native-reanimated";
type DrumRollProps = {
  continueAnimating: boolean;
  duration?: number;
  onFinished?: () => void;
};

const GIF_URI = "https://media1.tenor.com/m/Q2cTls958ckAAAAC/drumroll.gif";
const SPRING_CONFIG = { stiffness: 220, damping: 20, mass: 1 };
const ENTRY_OFFSET = -280;
const EXIT_OFFSET = 320;
const RESET_PAUSE_MS = 260;

export default function DrumRoll({
  continueAnimating,
  duration = 3000,
  onFinished,
}: DrumRollProps) {
  const progress = useSharedValue(0);
  const shouldRepeat = useSharedValue(continueAnimating ? 1 : 0);
  const isAnimatingRef = useRef(false);
  const startCycleRef = useRef<() => void>(() => {});
  const translateX = useSharedValue(ENTRY_OFFSET);
  const scale = useSharedValue(1);
  const exitDelay = Math.max(0, duration - 600);
  const nextCycleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearNextCycleTimeout = () => {
    if (nextCycleTimeout.current) {
      clearTimeout(nextCycleTimeout.current);
      nextCycleTimeout.current = null;
    }
  };

  const scheduleNextCycle = () => {
    clearNextCycleTimeout();
    nextCycleTimeout.current = setTimeout(() => {
      if (shouldRepeat.value === 1) {
        startCycleRef.current();
      }
    }, RESET_PAUSE_MS);
  };

  const handleCycleComplete = (shouldContinue: number) => {
    isAnimatingRef.current = false;
    clearNextCycleTimeout();
    if (shouldContinue === 1) {
      scheduleNextCycle();
      return;
    }

    onFinished?.();
  };

  startCycleRef.current = () => {
    if (isAnimatingRef.current) {
      return;
    }

    isAnimatingRef.current = true;
    clearNextCycleTimeout();
    progress.value = 0;
    progress.value = withTiming(
      1,
      { duration, easing: Easing.linear },
      (finished) => {
        "worklet";
        if (finished) {
          runOnJS(handleCycleComplete)(shouldRepeat.value);
        }
      }
    );
    translateX.value = withSequence(
      withTiming(ENTRY_OFFSET, { duration: 0 }),
      withSpring(0, { ...SPRING_CONFIG, damping: 25, stiffness: 180 }),
      withSpring(EXIT_OFFSET, { ...SPRING_CONFIG, damping: 21, stiffness: 190 }),
    //   withDelay(
    //     exitDelay,
    //     withSpring(EXIT_OFFSET, { ...SPRING_CONFIG, damping: 21, stiffness: 190 })
    //   ),
    //   withDelay(RESET_PAUSE_MS, withTiming(ENTRY_OFFSET, { duration: 0 }))
    );
    scale.value = withSequence(
      withTiming(0.9, { duration: 0 }),
      withSpring(1, { ...SPRING_CONFIG, damping: 25, stiffness: 180 }),
      withDelay(
        exitDelay,
        withSpring(0.92, { ...SPRING_CONFIG, damping: 21, stiffness: 190 })
      ),
      withDelay(RESET_PAUSE_MS, withTiming(0.9, { duration: 0 }))
    );
  };

  useEffect(() => {
    startCycleRef.current();
  }, []);

  useEffect(() => {
    shouldRepeat.value = continueAnimating ? 1 : 0;
    if (continueAnimating && !isAnimatingRef.current) {
      startCycleRef.current();
    }
  }, [continueAnimating, shouldRepeat]);

  useEffect(() => {
    return () => {
      clearNextCycleTimeout();
    };
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }, { scale: scale.value }],
    };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const pulse = 0.04 * Math.sin(progress.value * Math.PI * 2);
    return {
      transform: [{ scale: 1 + pulse }],
    };
  });

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {/* <Animated.Image
        source={{ uri: GIF_URI }}
        style={[styles.gif, imageAnimatedStyle]}
        resizeMode="contain"
      /> */}
      <RollingDrum />
    </Animated.View>
  );
}

function RollingDrum(){
    const drumpic = require("@/assets/drgif.gif")
    return (
        <Image 
            source={require("@/assets/drg2.gif")}
            autoplay
            style={{width:200,height:200}}
            contentFit="contain"
            />
    )
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  gif: {
    width: 200,
    height: 200,
  },
});
