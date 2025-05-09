import { useState } from "react";
import { View, Text, StyleSheet } from "react-native"
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Todo } from "../globals/types";
import { Colors } from "../globals/themes";


interface TodoItemProps {
	todo: Todo;
	editing: boolean;
	onChecked?: () => void;
}

const TodoItem = ({ todo, editing, onChecked }: TodoItemProps) => {

	const styles = StyleSheet.create({
		item: {
			flexDirection: "row",
			alignItems: "center",
			padding: 20,
			backgroundColor: "#fff",
			borderBottomColor: "#E5E5E5",
			borderBottomWidth: 1,
			gap: 10,
		},
	})


	return (
		<View style={styles.item}>
			{
				editing && (
					<BouncyCheckbox
						hitSlop={25}
						// isChecked={localChecked}
						disableText
						fillColor={Colors.primary}
						unFillColor="#fff"
						size={22}
						// useBuiltInState={false}
						iconStyle={{ borderColor: Colors.primary }}
						onPress={onChecked}
					/>
				)
			}
			<Text numberOfLines={1} style={{ fontSize: 18, fontWeight: '500' }}>{todo.title}</Text>
		</View>
	);
}


const Header = () => {
	return (
		<View style={{ backgroundColor: "#fff", padding: 20 }}>
			<Text style={{ fontSize: 32, fontWeight: "bold" }}>A faire</Text>
		</View>
	)
}

const ListEmptyComponent = () => {
	return (
		<View>
			<Text numberOfLines={1} style={{ textAlign: "center", fontSize: 22, fontWeight: '500', marginTop: 30 }}>Aucune tâche à afficher</Text>
		</View>
	)
}


export {
	TodoItem,
	Header,
	ListEmptyComponent
}
