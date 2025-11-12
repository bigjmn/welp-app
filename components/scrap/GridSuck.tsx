// SuckingSquares.tsx (updated blob + minimal changes elsewhere)
import { Image } from "expo-image";
import React, { useCallback, useMemo, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming,
} from "react-native-reanimated";

const grayBar = require("@/assets/service_icons/bargray.png")
const bar = require("@/assets/service_icons/bar.png")

type Layout = { x: number; y: number; width: number; height: number; cx: number; cy: number };

const PURPLE = "#8B5CF6";
const GRAY_BG = "#F3F4F6";
const GRAY = "#D1D5DB";

const CELL = 110;
const GAP = 4;
const DURATION = 260;

export default function SuckingSquares() {
  const [active, setActive] = useState(0);
  const [layouts, setLayouts] = useState<Record<number, Layout>>({});

  // Per-cell values
  const fill = [0, 1, 2, 3].map((i) => useSharedValue(i === 0 ? 1 : 0));
  const wobble = [0, 1, 2, 3].map(() => useSharedValue(0));

  const topOpac = [0, 1, 2, 3].map((i) => useSharedValue(i === 0 ? 1 : 0));

  // Index shared values (safe in worklets)
  const activeIdx = useSharedValue(0);
  const prevIdx = useSharedValue(0);

  // Direction & distance (prev -> next)
  const dirX = useSharedValue(0);
  const dirY = useSharedValue(0);
  const angle = useSharedValue(0);    // radians
  const dist = useSharedValue(0);     // px

  // Blob (pill) kinematics
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const progress = useSharedValue(0); // 0..1 along path
  const blobOpacity = useSharedValue(0);

  // Constants for “fill” inside a cell
  const FILL_INSET = 2; // matches borderRadius visual gap in .fill
  const FILL_SIZE = CELL - FILL_INSET * 2;

  const onCellLayout = useCallback(
    (i: number) =>
      (e: LayoutChangeEvent) => {
        const { x, y, width, height } = e.nativeEvent.layout;
        setLayouts((prev) => ({
          ...prev,
          [i]: { x, y, width, height, cx: x + width / 2, cy: y + height / 2 },
        }));
      },
    []
  );

  const kickWobble = (i: number, delayMs: number) => {
    wobble[i].value = withDelay(
      delayMs,
      withSequence(
        withTiming(-7, { duration: 90, easing: Easing.out(Easing.quad) }),
        withTiming(6, { duration: 100, easing: Easing.out(Easing.quad) }),
        withTiming(-3, { duration: 90, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 100, easing: Easing.out(Easing.quad) })
      )
    );
  };

  const triggerTransfer = useCallback(
    (next: number) => {
      const prev = activeIdx.value;
      if (next === prev) return;
      const Lprev = layouts[prev];
      const Lnext = layouts[next];
      if (!Lprev || !Lnext) return;

      prevIdx.value = prev;
      activeIdx.value = next;

      // Direction / distance
      const dx = Lnext.cx - Lprev.cx;
      const dy = Lnext.cy - Lprev.cy;
      const d = Math.max(1, Math.hypot(dx, dy));
      dist.value = d;
      dirX.value = dx / d;
      dirY.value = dy / d;
      angle.value = Math.atan2(dy, dx);

      // Blob start & progress
      startX.value = Lprev.cx;
      startY.value = Lprev.cy;
      progress.value = 0;
      blobOpacity.value = 1;

      // Animate fills
      fill[prev].value = withTiming(0, { duration: DURATION, easing: Easing.out(Easing.cubic) });
      fill[next].value = withDelay(
        120,
        withTiming(1, { duration: DURATION, easing: Easing.out(Easing.cubic) })
      );
      topOpac[prev].value = withTiming(0, { duration: DURATION, easing: Easing.out(Easing.cubic) });
      topOpac[next].value = withTiming(1, { duration: DURATION, easing: Easing.out(Easing.cubic) })

      // Animate blob progress (0→1)
      progress.value = withTiming(1, {
        duration: DURATION + 120,
        easing: Easing.inOut(Easing.cubic),
      });
      // Fade out at end
      blobOpacity.value = withDelay(DURATION + 140, withTiming(0, { duration: 120 }));

      // Wobble at destination
      kickWobble(next, DURATION + 140);

      setActive(next);
    },
    [layouts, activeIdx, prevIdx, dirX, dirY, angle, dist, startX, startY, progress, blobOpacity, fill]
  );

  const onPress = (i: number) => {
    if (i !== active) triggerTransfer(i);
  };

  // Purple cell fill (with slight tug)
  const cellFillStyle = (i: number) =>
    useAnimatedStyle(() => {
      const s = fill[i].value;
      const isPrev = i === prevIdx.value;
      const isNext = i === activeIdx.value;
      const nudge = (1 - s) * 18;
      const tx = (isPrev ? dirX.value : isNext ? -dirX.value : 0) * nudge;
      const ty = (isPrev ? dirY.value : isNext ? -dirY.value : 0) * nudge;
      return {
        transform: [{ translateX: tx }, { translateY: ty }, { scale: s }],
        opacity: s,
      };
    });

  const wobbleStyle = (i: number) =>
    useAnimatedStyle(() => ({
      transform: [{ rotate: `${wobble[i].value}deg` }],
    }));

  /**
   * Gooey pill blob:
   * - At progress=0/1: looks like a circle (thickness-only).
   * - Mid-flight: stretches (length grows toward distance), thickness squashes.
   * - Always rotated to travel angle and centered at the traveling point.
   */
  const blobContainerStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const d = dist.value;
    // How much of the distance the blob spans (triangular: 0→max at 0.5→0)
    const span = d * (1 - Math.abs(0.5 - p) * 2); // 0..d
    const spanNorm = d > 0 ? span / d : 0;

    // Thickness squashes as span grows, but never thinner than ~40% of fill
    const baseT = FILL_SIZE * 0.9;
    const minT = FILL_SIZE * 0.4;
    const thickness = Math.max(minT, baseT * (1 - 0.35 * spanNorm));

    // Current center travels from start to end
    const cx = startX.value + dirX.value * d * p;
    const cy = startY.value + dirY.value * d * p;

    // Pill dimensions: width = max(thickness, span), height = thickness
    const width = Math.max(thickness, span);
    const height = thickness;

    return {
      opacity: blobOpacity.value,
      position: "absolute",
      zIndex:1,
      left: cx - width / 2,
      top: cy - height / 2,
      width,
      height,
      transform: [{ rotate: `${angle.value}rad` }],
    } as any;
  });

  const topImageSeen = (i:number) =>
     useAnimatedStyle(() => {
        return {
            opacity: topOpac[i].value
        }
  })

  // Middle bar stretches between caps
  const blobBarStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const d = dist.value;
    const span = d * (1 - Math.abs(0.5 - p) * 2);
    const spanNorm = d > 0 ? span / d : 0;
    const baseT = FILL_SIZE * 0.9;
    const minT = FILL_SIZE * 0.4;
    const thickness = Math.max(minT, baseT * (1 - 0.35 * spanNorm));

    // Bar fills space between the two circular caps
    const barWidth = Math.max(0, span - thickness);

    return {
      position: "absolute",
      left: thickness / 2,
      right: thickness / 2,
      height: thickness,
      backgroundColor: PURPLE,
      // If span is small, caps overlap; hide bar smoothly
      width: barWidth <= 0 ? 0 : undefined,
      opacity: barWidth <= 0 ? 0 : 1,
    } as any;
  });

  const blobCapLeftStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const d = dist.value;
    const span = d * (1 - Math.abs(0.5 - p) * 2);
    const spanNorm = d > 0 ? span / d : 0;
    const baseT = FILL_SIZE * 0.9;
    const minT = FILL_SIZE * 0.4;
    const thickness = Math.max(minT, baseT * (1 - 0.35 * spanNorm));

    return {
      position: "absolute",
      left: 0,
      width: thickness,
      height: thickness,
      borderRadius: thickness / 2,
      backgroundColor: PURPLE,
    };
  });

  const blobCapRightStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const d = dist.value;
    const span = d * (1 - Math.abs(0.5 - p) * 2);
    const spanNorm = d > 0 ? span / d : 0;
    const baseT = FILL_SIZE * 0.9;
    const minT = FILL_SIZE * 0.4;
    const thickness = Math.max(minT, baseT * (1 - 0.35 * spanNorm));

    return {
      position: "absolute",
      right: 0,
      width: thickness,
      height: thickness,
      borderRadius: thickness / 2,
      backgroundColor: PURPLE,
    };
  });

  const containerStyle = useMemo<ViewStyle>(
    () => ({ width: CELL * 2 + GAP, height: CELL * 2 + GAP }),
    []
  );

  return (
    <View style={styles.wrapper}>
        
      <View style={[styles.grid, containerStyle]}>
        
        {[0, 1, 2, 3].map((i) => {
          const row = Math.floor(i / 2);
          const col = i % 2;
          const top = row * (CELL + GAP);
          const left = col * (CELL + GAP);
          return (
            <Animated.View
              key={i}
              style={[styles.cellWrap, { top, left, width: CELL, height: CELL, zIndex:4 }, wobbleStyle(i)]}
              onLayout={onCellLayout(i)}
            >
              <Pressable style={styles.cellPress} onPress={() => onPress(i)}>
                <View style={styles.cellBase}>
                    <View style={styles.imageWrapper}>
                        <Image source={grayBar} style={{width:"100%", height:"100%"}} />

                    </View>
                    <Animated.View style={[styles.imageWrapper, {zIndex:3}, topImageSeen(i)]}>
                        <Image source={bar} style={{width:"100%", height:"100%", zIndex:4}} />

                    </Animated.View>
                    
                </View>
                <Animated.View style={[styles.fill, cellFillStyle(i)]} />
              </Pressable>
            </Animated.View>
          );
        })}

        {/* Gooey traveling pill */}
        <Animated.View pointerEvents="none" style={blobContainerStyle}>
          <Animated.View style={blobBarStyle} />
          <Animated.View style={blobCapLeftStyle} />
          <Animated.View style={blobCapRightStyle} />
        </Animated.View>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", justifyContent: "center", padding: 24 },
  grid: { position: "relative" },
  cellWrap: { position: "absolute" },
  cellPress: { flex: 1, overflow: "hidden", borderRadius: 16 },
  cellBase: {
    flex: 1,
    
    
    borderWidth: 2,
    borderColor: GRAY,
    borderRadius: 16,
    zIndex:4
  },
  imageWrapper: {
    width:"100%",
    height:"100%",
    position:"absolute",
    top:0,
    left:0,
    zIndex:3

  },
  fill: { position: "absolute", inset: 0, backgroundColor: PURPLE, borderRadius: 14 },
});
