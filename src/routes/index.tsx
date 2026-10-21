import React from "react"
import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import NavBar from "../components/NavBar/NavBar"
import { themes } from "../global/themes"

import Login from "../pages/Login/Login"
import Abertura from "../pages/Abertura/Abertura"
import Onboarding from "../pages/Onboarding/Onboarding"
import Cadastro from "../pages/Cadastro/Cadastro"
import Inicio from "../pages/Inicio/Inicio"
import Produtos from "../pages/Produtos/Produtos"
import Cobrar from "../pages/Cobrar/Cobrar"
import Pedidos from "../pages/Pedidos/Pedidos"
import Mais from "../pages/Mais/Mais"
import Estoque from "../pages/Estoque/Estoque"
import Encomendas from "../pages/Encomendas/Encomendas"
import Clientes from "../pages/Clientes/Clientes"
import NovoProduto from "../pages/NovoProduto/NovoProduto"
import DetalheEncomenda from "../pages/DetalheEncomenda/DetalheEncomenda"
import DetalheProduto from "../pages/DetalheProduto/DetalheProduto"

import { NavBarProvider, useNavBar } from "../contexts/NavBarContext"

export type RootStackParamList = {
    Abertura: undefined
    Onboarding: undefined
    Login: undefined
    Cadastro: undefined
    Main: undefined
    Estoque: undefined
    Encomendas: undefined
    Clientes: undefined
    NovoProduto: undefined
    DetalheEncomenda: { id: string }
    DetalheProduto: { id: string }  
}

export type RootTabParamList = {
    Inicio: undefined
    Produtos: undefined
    Cobrar: undefined
    Pedidos: undefined
    Mais: undefined
}

export type AppParamList = RootStackParamList & RootTabParamList

export type Destino = Exclude<
    keyof AppParamList,
    "Login" | "Cadastro" | "Main" | "DetalheEncomenda" | "DetalheProduto"
>

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<RootTabParamList>()

const tema = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: themes.colors["bege-claro"] },
}

function MainTabs() {
    const { cobranca } = useNavBar()

    return (
        <Tab.Navigator
            initialRouteName="Inicio"
            tabBar={(props) => <NavBar {...props} cobranca={cobranca} />}
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
        <NavBarProvider>
            <NavigationContainer theme={tema}>
                <Stack.Navigator
                    initialRouteName="Abertura"
                    screenOptions={{ headerShown: false, animation: "none" }}
                >
                    <Stack.Screen name="Abertura" component={Abertura} />
                    <Stack.Screen name="Onboarding" component={Onboarding} />
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Cadastro" component={Cadastro} />
                    <Stack.Screen name="Main" component={MainTabs} />
                    <Stack.Screen name="Estoque" component={Estoque} />
                    <Stack.Screen name="Encomendas" component={Encomendas} />
                    <Stack.Screen name="Clientes" component={Clientes} />
                    <Stack.Screen name="NovoProduto" component={NovoProduto} />
                    <Stack.Screen name="DetalheEncomenda" component={DetalheEncomenda} />
                    <Stack.Screen name="DetalheProduto" component={DetalheProduto} />
                </Stack.Navigator>
            </NavigationContainer>
        </NavBarProvider>
    )
}