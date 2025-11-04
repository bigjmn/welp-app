import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming
} from "react-native-reanimated";
import DrumRoll from "./DrumRoll";

export default function ResultCard() {
  const [isFetching, setIsFetching] = useState(true);
  const [showCard, setShowCard] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const showButtonsDelayed = useCallback(() => {
    setShowButtons(true);
  }, []);

  const showOff = () => {
    setShowCard(false)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsFetching(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleCountdownFinished = useCallback(() => {
    setShowCard(true);
    setShowButtons(false);
  }, []);

  return (
    <View style={styles.screen}>
      {!showCard && (
        <DrumRoll
          continueAnimating={isFetching}
          onFinished={handleCountdownFinished}
        />
      )}
      {showCard && (
        <>
          <DataFetchedCard unlockButtons={showButtonsDelayed} />
          <ButtonsColumn visible={showButtons} />
        </>
      )}
    </View>
  );
}

function DataFetchedCard({ unlockButtons }: { unlockButtons: () => void }) {
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
      <Text style={styles.cardText}>Data fetched</Text>
    </Animated.View>
  );
}

function ButtonsColumn({ visible }: { visible: boolean }) {
  const baseDelay = 600;
  const offsets = useMemo(() => [0, 160], []);
  const buttons = useMemo(
    () => [
      { label: "Retry Load", onPress: () => {} },
      { label: "Continue", onPress: () => {} },
    ],
    []
  );

  return (
    <View style={styles.buttonsWrapper}>
      {buttons.map((button, index) => (
        <SlidingButton
          key={button.label}
          label={button.label}
          onPress={button.onPress}
          visible={visible}
          delay={baseDelay + offsets[index]}
        />
      ))}
    </View>
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
        <Text style={styles.buttonText}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F8FF",
  },
  card: {
    width: 220,
    height: 140,
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
