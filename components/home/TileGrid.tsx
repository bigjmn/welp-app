import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { PrimaryButton, Spacer, ThemedText, ThemedTextInput, ThemedView } from "../ui";

const SERVICES: ServiceType[] = ["Delivery", "Restaurant", "Bar", "Search"];

// Service icons
const bar = require("@/assets/service_icons/bar.png");
const bargray = require("@/assets/service_icons/bargray.png");
const dish = require("@/assets/service_icons/dish.png");
const dishgray = require("@/assets/service_icons/dishgray.png");
const search = require("@/assets/service_icons/search.png");
const searchgray = require("@/assets/service_icons/searchgray.png");
const delivery = require("@/assets/service_icons/delivery.png");
const deliverygray = require("@/assets/service_icons/deliverygray.png");

type Layout = { x: number; y: number; width: number; height: number; cx: number; cy: number };

const CELL = 110;
const GAP = 10;
const DURATION = 260;
const FILL_INSET = 2;
const FILL_SIZE = CELL - FILL_INSET * 2;

export function TileGrid() {
    const [serviceType, setServiceType] = useState<ServiceType>("Delivery");
    const [searchInput, setSearchInput] = useState<string>("");
    const [layouts, setLayouts] = useState<Record<number, Layout>>({});

    const router = useRouter();
    const { colors } = useTheme();

    // Map services to indices
    const serviceIndex = SERVICES.indexOf(serviceType);

    // Per-cell animation values
    const fill = [0, 1, 2, 3].map((i) => useSharedValue(i === serviceIndex ? 1 : 0));
    const wobble = [0, 1, 2, 3].map(() => useSharedValue(0));
    const topOpac = [0, 1, 2, 3].map((i) => useSharedValue(i === serviceIndex ? 1 : 0));

    // Index shared values
    const activeIdx = useSharedValue(serviceIndex);
    const prevIdx = useSharedValue(serviceIndex);

    // Direction & distance
    const dirX = useSharedValue(0);
    const dirY = useSharedValue(0);
    const angle = useSharedValue(0);
    const dist = useSharedValue(0);

    // Blob kinematics
    const startX = useSharedValue(0);
    const startY = useSharedValue(0);
    const progress = useSharedValue(0);
    const blobOpacity = useSharedValue(0);

    const goToResults = () => {
        router.replace({ pathname: '/result', params: { serviceType, searchInput } });
    };

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
            topOpac[next].value = withTiming(1, { duration: DURATION, easing: Easing.out(Easing.cubic) });

            // Animate blob progress
            progress.value = withTiming(1, {
                duration: DURATION + 120,
                easing: Easing.inOut(Easing.cubic),
            });
            blobOpacity.value = withDelay(DURATION + 140, withTiming(0, { duration: 120 }));

            // Wobble at destination
            kickWobble(next, DURATION + 140);

            // Update service type
            setServiceType(SERVICES[next]);
        },
        [layouts, activeIdx, prevIdx, dirX, dirY, angle, dist, startX, startY, progress, blobOpacity, fill, topOpac]
    );

    const onPress = (i: number) => {
        const currentIdx = SERVICES.indexOf(serviceType);
        if (i !== currentIdx) triggerTransfer(i);
    };

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
                backgroundColor: colors.primary
            };
        });

    const wobbleStyle = (i: number) =>
        useAnimatedStyle(() => ({
            transform: [{ rotate: `${wobble[i].value}deg` }],
        }));

    const topImageSeen = (i: number) =>
        useAnimatedStyle(() => ({
            opacity: topOpac[i].value,
        }));

    const blobContainerStyle = useAnimatedStyle(() => {
        const p = progress.value;
        const d = dist.value;
        const span = d * (1 - Math.abs(0.5 - p) * 2);
        const spanNorm = d > 0 ? span / d : 0;

        const baseT = FILL_SIZE * 0.9;
        const minT = FILL_SIZE * 0.4;
        const thickness = Math.max(minT, baseT * (1 - 0.35 * spanNorm));

        const cx = startX.value + dirX.value * d * p;
        const cy = startY.value + dirY.value * d * p;

        const width = Math.max(thickness, span);
        const height = thickness;

        return {
            opacity: blobOpacity.value,
            position: "absolute",
            zIndex: 1,
            left: cx - width / 2,
            top: cy - height / 2,
            width,
            height,
            transform: [{ rotate: `${angle.value}rad` }],
        } as any;
    });

    const blobBarStyle = useAnimatedStyle(() => {
        const p = progress.value;
        const d = dist.value;
        const span = d * (1 - Math.abs(0.5 - p) * 2);
        const spanNorm = d > 0 ? span / d : 0;
        const baseT = FILL_SIZE * 0.9;
        const minT = FILL_SIZE * 0.4;
        const thickness = Math.max(minT, baseT * (1 - 0.35 * spanNorm));

        const barWidth = Math.max(0, span - thickness);

        return {
            position: "absolute",
            left: thickness / 2,
            right: thickness / 2,
            height: thickness,
            backgroundColor: colors.primary,
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
            backgroundColor: colors.primary,
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
            backgroundColor: colors.primary,
        };
    });

    const getServiceIcon = (service: ServiceType, colored: boolean) => {
        switch (service) {
            case "Bar":
                return colored ? bar : bargray;
            case "Delivery":
                return colored ? delivery : deliverygray;
            case "Restaurant":
                return colored ? dish : dishgray;
            case "Search":
                return colored ? search : searchgray;
            default:
                return bargray;
        }
    };

    const containerStyle = useMemo(
        () => ({ width: CELL * 2 + GAP, height: CELL * 2 + GAP }),
        []
    );

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.grid, containerStyle]}>
                {SERVICES.map((service, i) => {
                    const row = Math.floor(i / 2);
                    const col = i % 2;
                    const top = row * (CELL + GAP);
                    const left = col * (CELL + GAP);

                    return (
                        <Animated.View
                            key={i}
                            style={[
                                styles.cellWrap,
                                { top, left, width: CELL, height: CELL, zIndex: 4 },
                                wobbleStyle(i),
                            ]}
                            onLayout={onCellLayout(i)}
                        >
                            <Pressable style={styles.cellPress} onPress={() => onPress(i)}>
                                <View style={styles.cellBase}>
                                    <View style={styles.imageWrapper}>
                                        <Image
                                            source={getServiceIcon(service, false)}
                                            style={{ width: "100%", height: "100%" }}
                                        />
                                        <ThemedText variant="italic" style={{position:'absolute',bottom:3, textAlign:"center",width:"100%", color: service === serviceType ? "white" : colors.text}}>{service}</ThemedText>
                                    </View>
                                    <Animated.View style={[styles.imageWrapper, { zIndex: 3 }, topImageSeen(i)]}>
                                        <Image
                                            source={getServiceIcon(service, true)}
                                            style={{ width: "100%", height: "100%", zIndex: 4 }}
                                        />
                                    </Animated.View>
                                </View>
                                <Animated.View style={[styles.fill, cellFillStyle(i)]} />
                            </Pressable>
                        </Animated.View>
                    );
                })}

                {/* Gooey traveling blob */}
                <Animated.View pointerEvents="none" style={blobContainerStyle}>
                    <Animated.View style={blobBarStyle} />
                    <Animated.View style={blobCapLeftStyle} />
                    <Animated.View style={blobCapRightStyle} />
                </Animated.View>
            </View>

            <Spacer height={20} />
            {serviceType === "Search" ? (
                <ThemedView style={styles.searchSection}>
                    <ThemedTextInput
                        value={searchInput}
                        onChangeText={setSearchInput}
                        placeholder="What are you looking for?"
                        placeholderTextColor={colors.iconColor}
                        style={styles.searchInput}
                    />
                </ThemedView>
            ) : (
                <Spacer height={45} />
            )}
            <Spacer height={16} />
            <ThemedView style={styles.searchSection}>
            <PrimaryButton style={{ width: "80%" }} name="Let's Go!" onPress={goToResults} />
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width: "100%"
    },
    grid: {
        position: "relative"
    },
    cellWrap: {
        position: "absolute"
    },
    cellPress: {
        flex: 1,
        overflow: "hidden",
        borderRadius: 20
    },
    cellBase: {
        flex: 1,
        borderWidth: 2,
        borderColor: "#A78BFA",
        borderRadius: 20,
        zIndex: 4,
        shadowColor: '#8B5CF6',
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 3 },
    },
    imageWrapper: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 3
    },
    fill: {
        position: "absolute",
        inset: 0,
        borderRadius: 18,
    },
    searchSection: {
        width: "100%",
        paddingHorizontal: 20,
        alignItems:"center"
    },
    searchInput: {
        width: "80%",
        height: 50,
        alignSelf:"center",
        borderWidth: 2,
        padding: 15,
        fontSize: 16,
        textAlignVertical: 'center',
        borderRadius: 16,
    }
})