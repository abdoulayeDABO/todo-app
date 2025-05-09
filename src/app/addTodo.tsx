import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '../components/button';
import { StatusBar } from 'expo-status-bar';
import { useSQLiteContext } from 'expo-sqlite';
import { router } from 'expo-router';
import { Colors } from '../globals/themes';


const addTodo = () => {
	const [todo, setTodo] = React.useState("");
	const db = useSQLiteContext();

	const handleSubmit = async () => {
		try {
			if (!todo) return;
			const result = await db.runAsync("INSERT INTO todos (title) VALUES (?)", [todo]);
			if (result.changes > 0) {
				setTodo("");
				router.back();
			}
		} catch (error) {
			console.log("Error inserting todo: ", error);
		}
	}


	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style="light" />
			<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
				<Text style={{ fontSize: 22, fontWeight: 600 }}>Nouveau</Text>
				<Button
					disabled={todo.length === 0}
					label="Valider"
					icon='checkmark-sharp'
					iconSize={24}
					onPress={handleSubmit}
					style={StyleSheet.flatten([{ flexDirection: 'row-reverse', justifyContent: "center", alignItems: "center", gap: 5 }, todo.length === 0 ? { opacity: 0.5 } : {}])}
					iconColor={Colors.primary}
					labelStyle={{ color: Colors.primary, fontSize: 18, fontWeight: "bold" }}
				/>
			</View>

			<TextInput
				placeholder="Titre de la tâche"
				style={{
					borderWidth: 1,
					borderColor: "#ccc",
					padding: 13,
					marginBottom: 20,
					borderRadius: 5,
					fontSize: 20,
				}}
				cursorColor={"#000"}
				selectionColor={"#000"}
				onChangeText={(text) => setTodo(text)}
				onSubmitEditing={handleSubmit}
				returnKeyType='done'
				value={todo}
			/>

		</SafeAreaView>
	)
}


export default addTodo

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: "100%",
		backgroundColor: "#fff",
		padding: 20,
	},
})
