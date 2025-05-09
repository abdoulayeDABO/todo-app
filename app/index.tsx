import { Alert, FlatList, StyleSheet, View, Text, LayoutAnimation } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AnimatedButton } from '../components/button';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from 'expo-router';
import { ListEmptyComponent, TodoItem } from '../components/todo';
import { Todo } from '../globals/types';
import { Colors } from '../globals/themes';




const Home = () => {
	const router = useRouter();
	const db = useSQLiteContext();
	const [todos, setTodos] = useState<Todo[]>([]);
	const [editing, setEditing] = useState(false)
	const [chechedForDelete, setCheckedForDelete] = useState<number[]>([]);

	const toggleEditing = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setCheckedForDelete([]);
		setEditing(!editing);
	}

	useFocusEffect(
		useCallback(() => {
			async function fetchTodos() {
				const result = await db.getAllAsync<Todo>('SELECT * FROM todos');
				setTodos(result);
			}
			fetchTodos();
		}, [todos])
	);

	const handleDeleteMultiple = async () => {
		if (chechedForDelete.length > 0) {
			Alert.alert(
				'Confirmation',
				'Voulez-vous vraiment supprimer ces tâches ?',
				[
					{
						text: 'Annuler',
						style: 'cancel'
					},
					{
						text: 'Oui',
						onPress: async () => {
							let success = true;
							await db.withTransactionAsync(async () => {
								for (const id of chechedForDelete) {
									const result = await db.runAsync('DELETE FROM todos WHERE id = ?', [id]);
									if (result.changes < 0) success = false
								}
							});
							if (success) {
								setTodos(todos.filter((todo) => !chechedForDelete.includes(todo.id)));
								setCheckedForDelete([]);
							}
						}
					}
				]
			)
		}
	}

	const onChecked = (id: number) => {
		if (chechedForDelete.includes(id)) {
			setCheckedForDelete(chechedForDelete.filter((item) => item !== id));
		} else {
			setCheckedForDelete([...chechedForDelete, id]);
		}
	}

	return (
		<View
			style={styles.container}
		>
			<Stack.Screen
				options={{
					title: '',
					headerShadowVisible: true,
					headerStyle: { backgroundColor: Colors.primary },
					headerTintColor: '#fff',
					headerTitleStyle: {
						fontWeight: 'bold'
					},
					headerLeft: () => <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#fff" }}>A faire</Text>
				}}
			/>

			<FlatList
				data={todos}
				// ListHeaderComponent={<Header />}
				// stickyHeaderIndices={[0]}
				style={{ backgroundColor: Colors.background }}
				ListEmptyComponent={<ListEmptyComponent />}
				renderItem={({ item }) => <TodoItem todo={item} editing={editing} onChecked={() => onChecked(item.id)} />}
				keyExtractor={(item) => item.id.toString()}
			/>

			{
				chechedForDelete.length > 0 && (
					<AnimatedButton
						icon="trash-outline"
						iconColor={Colors.background}
						onPress={handleDeleteMultiple}
						style={StyleSheet.flatten([styles.button, styles.deleteButton])}
						disabled={chechedForDelete.length === 0}
					/>
				)
			}

			<AnimatedButton
				icon="pencil"
				iconColor='#fff'
				onPress={toggleEditing}
				style={StyleSheet.flatten([styles.button, styles.editButton])}
			/>

			<AnimatedButton
				style={StyleSheet.flatten([styles.button, styles.addButton])}
				onPress={() => router.navigate('/addTodo')}
				icon="add"
				iconColor='#FFF'
			/>
		</View>
	)
}

export default Home

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	title: {
		fontSize: 30,
		fontWeight: "bold",
		marginTop: 20,
		marginLeft: 20
	},
	button: {
		backgroundColor: Colors.primary,
		position: "absolute",
		borderRadius: 50,
		padding: 15,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		right: 20,
	},
	addButton: {
		bottom: 40,
	},
	editButton: {
		bottom: 110
	},
	deleteButton: {
		backgroundColor: Colors.error,
		bottom: 180,
	}
})

