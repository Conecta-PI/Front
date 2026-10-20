import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import NavBar from "../components/NavBar/NavBar"

import Login from "../pages/Login/Login"
import Inicio from "../pages/Inicio/Inicio"
import Produtos from "../pages/Produtos/Produtos"
import Cobrar from "../pages/Cobrar/Cobrar"
import Pedidos from "../pages/Pedidos/Pedidos"
import Mais from "../pages/Mais/Mais"
import Cadastro from "../pages/Cadastro/Cadastro"

export type RootStackParamList = {
    Login: undefined
    Cadastro: undefined
    Main: undefined
}

export type RootTabParamList = {
    Inicio: undefined
    Produtos: undefined
    Cobrar: undefined
    Pedidos: undefined
    Mais: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<RootTabParamList>()

function MainTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Inicio"
            tabBar={(props) => <NavBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Inicio" component={Inicio} />
            <Tab.Screen name="Produtos" component={Produtos} />
            <Tab.Screen name="Cobrar" component={Cobrar} />
            <Tab.Screen name="Pedidos" component={Pedidos} />
            <Tab.Screen name="Mais" component={Mais} />
        </Tab.Navigator>
    )
}


export default function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Cadastro" component={Cadastro} />
                <Stack.Screen name="Main" component={MainTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}