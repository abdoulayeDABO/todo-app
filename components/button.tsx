import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
	FadeIn,
	FadeOut
} from 'react-native-reanimated';
import * as Haptics from "expo-haptics";

type ButtonProps = {
	label?: string;
	icon?: keyof typeof Ionicons.glyphMap;
	disabled?: boolean;
	style?: ViewStyle;
	labelStyle?: TextStyle;
	iconColor?: string;
	iconSize?: number;
	hitSlop?: number;
	onPress: () => void;
};

const Button = ({ label, style, icon, labelStyle, iconColor, iconSize = 32, ...rest }: ButtonProps) => {

	const styles = StyleSheet.create({
		button: {
			color: "#FFFFFF",
			padding: 10,
			borderRadius: 5,
			alignItems: "center",
			cursor: "pointer",
		},
		labelStyle: {
			fontSize: 18,
			fontWeight: "bold",
		},
	});

	return (
		<TouchableOpacity
			{...rest}
			activeOpacity={0.5}
			style={[styles.button, style]}
		>
			{label && <Text style={[styles.labelStyle, labelStyle]}>{label}</Text>}
			{icon && <Ionicons name={icon} size={iconSize} color={iconColor} />}
		</TouchableOpacity>
	);
}


const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedButton = ({ style, icon, iconColor, iconSize = 32, ...rest }: ButtonProps) => {
	const styles = StyleSheet.create({
		button: {
			color: "#FFFFFF",
			padding: 10,
			borderRadius: 5,
			alignItems: "center",
			cursor: "pointer",
		},
		labelStyle: {
			fontSize: 18,
			fontWeight: "bold",
		},
	});


	const scale = useSharedValue<number>(1);

	const animatedStyles = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	const onPressIn = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		scale.value = withTiming(0.93333, { duration: 100 });
	};

	const onPressOut = () => {
		scale.value = withSpring(1, { duration: 90 });
	};

	return (
		<Animated.View
			entering={FadeIn}
			exiting={FadeOut}
		>
			<AnimatedPressable
				{...rest}
				onPressIn={onPressIn}
				onPressOut={onPressOut}
				activeOpacity={0.9}
				style={[styles.button, style, animatedStyles]}
			>
				<Ionicons name={icon} size={iconSize} color={iconColor} />
			</AnimatedPressable>
		</Animated.View>
	);
}


export {
	Button,
	AnimatedButton
};
