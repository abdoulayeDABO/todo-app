import { Stack } from "expo-router";
import DBProvider from "../context/DBContext";
// import { GestureHandlerRootView } from 'react-native-gesture-handler';s

export default function RootLayout() {
	return (
		// <GestureHandlerRootView>
		<DBProvider>
			<Stack
			//  screenOptions={{ headerShown: false }}
			>
				<Stack.Screen name="index" />
				<Stack.Screen name="addTodo" options={{ presentation: 'modal', headerShown: false }} />
			</Stack>
		</DBProvider>
		// </GestureHandlerRootView>
	);
}
