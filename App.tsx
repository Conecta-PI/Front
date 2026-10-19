import React from "react"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { useFonts } from "expo-font"
import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
} from "@expo-google-fonts/poppins"

import Routes from "./src/routes/Routes"

export default function App() {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
    })

    if (!fontsLoaded) {
        return null
    }

    return (
        <SafeAreaProvider>
            <StatusBar style="dark" />
            <Routes />
        </SafeAreaProvider>
    )
}