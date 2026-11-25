import React from "react"
import { DefaultTheme, NavigationContainer, NavigatorScreenParams } from "@react-navigation/native"
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
import DetalheCliente from "../pages/Clientes/DetalheCliente"
import NovoProduto from "../pages/NovoProduto/NovoProduto"
import DetalheEncomenda from "../pages/DetalheEncomenda/DetalheEncomenda"
import DetalheProduto from "../pages/DetalheProduto/DetalheProduto"
import RecuperarSenha from "../pages/RecuperarSenha/RecuperarSenha"
import CodigoSeguranca from "../pages/CodigoSeguranca/CodigoSeguranca"
import NovaSenha from "../pages/NovaSenha/NovaSenha"
import RecuperacaoSucesso from "../pages/RecuperacaoSucesso/RecuperacaoSucesso"
import Financeiro from "../pages/Financeiro/Financeiro"
import ListaCompras from "../pages/ListaCompras/ListaCompras"
import Fornecedores from "../pages/Fornecedores/Fornecedores"
import FichaTecnica from "../pages/FichaTecnica/FichaTecnica"
import Relatorios from "../pages/Relatorios/Relatorios"
import Configuracoes from "../pages/Configuracoes/Configuracoes"
import NovaEncomenda from "../pages/NovaEncomenda/NovaEncomenda"
import EditarPerfil from "../pages/EditarPerfil/EditarPerfil"
import TermosUso from "../pages/TermosUso/TermosUso"

import { NavBarProvider, useNavBar } from "../contexts/NavBarContext"

export type RootStackParamList = {
    Abertura: undefined
    Onboarding: undefined
    Login: undefined
    Cadastro: undefined
    RecuperarSenha: undefined
    CodigoSeguranca: { email: string; mensagem?: string }
    NovaSenha: { email: string; codigo: string }
    RecuperacaoSucesso: undefined
    Main: NavigatorScreenParams<RootTabParamList> | undefined
    Estoque: undefined
    Encomendas: undefined
    Clientes: { mostrarInativos?: boolean } | undefined
    DetalheCliente: { id: string }
    NovoProduto: { id?: string } | undefined
    DetalheEncomenda: { id: string }
    DetalheProduto: { id: string }
    Financeiro: undefined
    ListaCompras: undefined
    Fornecedores: undefined
    FichaTecnica: undefined
    Relatorios: undefined
    Configuracoes: undefined
    NovaEncomenda: { clienteId: string; clienteNome: string }
    TermosUso: { onAceitar: () => void }
    EditarPerfil: undefined
}

export type RootTabParamList = {
    Inicio: undefined
    Produtos: { mostrarInativos?: boolean } | undefined
    Cobrar: { produtoId?: string } | undefined
    Pedidos: {
        filtro?: "todos" | "pendente" | "pago" | "cancelado"
    } | undefined
    Mais: undefined
}

export type AppParamList = RootStackParamList & RootTabParamList

export type Destino = Exclude<
    keyof AppParamList,
    "Login" | "Cadastro" | "Main" | "DetalheEncomenda" | "DetalheProduto" | "DetalheCliente" | "NovaEncomenda"
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
                    <Stack.Screen name="RecuperarSenha" component={RecuperarSenha} />
                    <Stack.Screen name="CodigoSeguranca" component={CodigoSeguranca} />
                    <Stack.Screen name="NovaSenha" component={NovaSenha} />
                    <Stack.Screen name="RecuperacaoSucesso" component={RecuperacaoSucesso} />
                    <Stack.Screen name="Main" component={MainTabs} />
                    <Stack.Screen name="Estoque" component={Estoque} />
                    <Stack.Screen name="Encomendas" component={Encomendas} />
                    <Stack.Screen name="Clientes" component={Clientes} />
                    <Stack.Screen name="DetalheCliente" component={DetalheCliente} />
                    <Stack.Screen name="NovoProduto" component={NovoProduto} />
                    <Stack.Screen name="DetalheEncomenda" component={DetalheEncomenda} />
                    <Stack.Screen name="DetalheProduto" component={DetalheProduto} />
                    <Stack.Screen name="Financeiro" component={Financeiro} />
                    <Stack.Screen name="ListaCompras" component={ListaCompras} />
                    <Stack.Screen name="Fornecedores" component={Fornecedores} />
                    <Stack.Screen name="FichaTecnica" component={FichaTecnica} />
                    <Stack.Screen name="Relatorios" component={Relatorios} />
                    <Stack.Screen name="Configuracoes" component={Configuracoes} />
                    <Stack.Screen name="NovaEncomenda" component={NovaEncomenda} />
                    <Stack.Screen name="TermosUso" component={TermosUso} />
                    <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
                </Stack.Navigator>
            </NavigationContainer>
        </NavBarProvider>
    )
}