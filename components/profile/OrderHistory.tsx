import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/hooks/useUser";
import { formatTimestamp } from "@/utils/formatters";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { ThemedText, ThemedView } from "../ui";
import EditReviewModal from "./EditReview";

export default function OrderHistory(){
    const [oidEditing, setOidEditing] = useState<string|null>(null)
    const swipeableRefs = useRef<Map<string, any>>(new Map())

    const closeModal = () => {
        setOidEditing(null)
        // Close the swipeable for the currently editing item
        if (oidEditing && swipeableRefs.current.has(oidEditing)) {
            swipeableRefs.current.get(oidEditing)?.close()
        }
    }

    const editOid = (oid:string) => setOidEditing(oid)

    const { user } = useUser()
    if (!user){
        return
    }
    const { orderHistory } = user

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemedView style={styles.container}>
                {oidEditing && <EditReviewModal oid={oidEditing} closeModal={closeModal} />}
                <FlatList
                    data={orderHistory}
                    keyExtractor={(item) => `${item.timestamp}`}
                    renderItem={({item}) => (
                        <HistoryTile
                            orderDetail={item}
                            editsetter={editOid}
                            onSwipeableRef={(ref) => {
                                if (ref) {
                                    swipeableRefs.current.set(item.oid, ref)
                                } else {
                                    swipeableRefs.current.delete(item.oid)
                                }
                            }}
                        />
                    )}
                    ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
                    contentContainerStyle={styles.listContent}
                />
            </ThemedView>
        </GestureHandlerRootView>
    )
}

function HistoryTile({orderDetail, editsetter, onSwipeableRef}:{orderDetail:HistoryItem, editsetter:(oid:string)=>void, onSwipeableRef:(ref:any)=>void}){
    const timestring = formatTimestamp(orderDetail.timestamp)
    const { colors } = useTheme()

    const handleEditReview = () => {
        console.log('Edit review for:', orderDetail.name)
        editsetter(orderDetail.oid)

        // TODO: Implement edit review functionality
    }

    const handleNeverShow = () => {
        console.log('Never show again:', orderDetail.name)
        // TODO: Implement hide functionality
    }

    const renderRightActions = (
        prog: SharedValue<number>,
        drag: SharedValue<number>
    ) => {
        const styleAnimation = useAnimatedStyle(() => {
            return {
                transform: [{ translateX: drag.value + 252 }],
            };
        });

        return (
            <Animated.View style={[styles.actionsContainer, styleAnimation]}>
                <Pressable
                    style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
                    onPress={handleEditReview}
                >
                    <Ionicons name="create-outline" size={20} color="white" />
                    <ThemedText style={styles.actionText}>Edit</ThemedText>
                </Pressable>
                <Pressable
                    style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                    onPress={handleNeverShow}
                >
                    <Ionicons name="eye-off-outline" size={20} color="white" />
                    <ThemedText style={styles.actionText}>Hide</ThemedText>
                </Pressable>
            </Animated.View>
        );
    };

    return (
        <ReanimatedSwipeable
            ref={onSwipeableRef}
            containerStyle={styles.swipeContainer}
            friction={2}
            enableTrackpadTwoFingerGesture
            rightThreshold={40}
            renderRightActions={renderRightActions}
        >
            <ThemedView style={[styles.tileStyle, {backgroundColor: colors.uiBackground}]}>
                <ThemedView style={styles.tileLeft}>
                    <Ionicons name="time-outline" size={16} color={colors.iconColor} style={styles.icon} />
                    <ThemedText variant="soft" style={styles.timeText}>{timestring}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.tileCenter}>
                    <ThemedText variant="medium" numberOfLines={1} ellipsizeMode="tail">
                        {orderDetail.name}
                    </ThemedText>
                </ThemedView>
                <ThemedView style={styles.tileRight}>
                    {(orderDetail.review && orderDetail.review.rating === "Pretty dece!") ? (
                        <ThemedView style={[styles.reviewBadge, { backgroundColor: '#10B981' }]}>
                            <Ionicons name="thumbs-up" size={14} color="white" />
                            <ThemedText style={styles.reviewText}>Dece!</ThemedText>
                        </ThemedView>
                    ) : (orderDetail.review && orderDetail.review.rating === "Eh.") ? (
                        <ThemedView style={[styles.reviewBadge, { backgroundColor: '#EF4444' }]}>
                            <Ionicons name="thumbs-down" size={14} color="white" />
                            <ThemedText style={styles.reviewText}>Eh.</ThemedText>
                        </ThemedView>
                    ) : null }
                </ThemedView>
            </ThemedView>
        </ReanimatedSwipeable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        paddingVertical: 8
    },
    separator: {
        height: 1,
        opacity: 0.1,
        marginVertical: 4
    },
    swipeContainer: {
        marginVertical: 4,
    },
    actionsContainer: {
        width: 252,
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 6,
    },
    actionButton: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 2,
        width: 120,
        height: 64
    },
    actionText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '600'
    },
    tileStyle: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: 72,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2
    },
    tileLeft: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'transparent',
        minWidth: 100
    },
    tileCenter: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingHorizontal: 12
    },
    tileRight: {
        backgroundColor: 'transparent',
        minWidth: 80,
        alignItems: 'flex-end'
    },
    icon: {
        marginRight: 2
    },
    timeText: {
        fontSize: 13
    },
    reviewBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12
    },
    reviewText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600'
    }
})