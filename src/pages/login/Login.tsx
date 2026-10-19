
import React from "react"
import { Text, Pressable } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import type { RootStackParamList } from "../../routes/Routes"
import AppLayout from "../../components/AppLayout/AppLayout"

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">

export default function Login() {
    const navigation = useNavigation<NavigationProp>()

    function entrar() {
        navigation.replace("Main")
    }

    return (
        <AppLayout>
            <Text>Login</Text>

            <Pressable onPress={entrar}>
                <Text>Entrar</Text>
            </Pressable>
        </AppLayout>
    )
}
