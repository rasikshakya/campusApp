import { Tabs } from "expo-router";
import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const [userRole, setUserRole] = useState<string | null>(null);

	// Fetch the user's role from the secure vault when the layout loads
	useEffect(() => {
		async function fetchRole() {
			try {
				const role = await SecureStore.getItemAsync("user_role");
				setUserRole(role);
			} catch (error) {
				console.error("Failed to load user role", error);
			}
		}
		fetchRole();
	}, []);

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerShown: true,
				tabBarButton: HapticTab,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Campus Map",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="map.fill" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="lost-found"
				options={{
					title: "Lost & Found",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="magnifyingglass" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="reports"
				options={{
					title: "Reports",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="list.bullet" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="person.fill" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="admin-dash"
				options={{
					title: "Admin",
					// THE FIX: If they are an admin, link to the dash. Otherwise, null hides the tab completely.
					href: userRole === "admin" ? "/admin-dash" : null,
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="shield.lefthalf.fill" color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
