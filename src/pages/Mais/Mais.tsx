import React from "react"
import { ActivityIndicator, ScrollView, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { CommonActions, NavigationProp, useNavigation } from "@react-navigation/native"

import { style } from "./style"
import { themes } from "../../global/themes"
import { usePerfil } from "../../hooks/usePerfil"
import type { AppParamList, Destino } from "../../routes"

import AppLayout from "../../components/AppLayout/AppLayout"
import Secao from "../../components/Secao/"
import LinhaInfo from "../../components/LinhaInfo/"
import ItemMenu from "../../components/ItemMenu/"
import Button from "../../components/Button/Button"

type IconName = React.ComponentProps<typeof Ionicons>["name"]

const MENU: { icone: IconName; texto: string; destino: Destino }[] = [
    { icone: "people-outline", texto: "Clientes", destino: "Clientes" },
    { icone: "calendar-outline", texto: "Encomendas", destino: "Encomendas" },
    { icone: "wallet-outline", texto: "Financeiro", destino: "Financeiro" },
    { icone: "cart-outline", texto: "Lista de compras", destino: "ListaCompras" },
    { icone: "storefront-outline", texto: "Fornecedores", destino: "Fornecedores" },
    { icone: "document-text-outline", texto: "Ficha técnica", destino: "FichaTecnica" },
    { icone: "bar-chart-outline", texto: "Relatórios", destino: "Relatorios" },
]

export default function Mais() {
    const navigation = useNavigation<NavigationProp<AppParamList>>()
    const { perfil } = usePerfil()

    function sair() {
        // TODO: limpar a sessão (token) antes de sair
        navigation.dispatch(
            CommonActions.reset({ index: 0, routes: [{ name: "Login" }] })
        )
    }

    return (
        <AppLayout
            header={{
                tipo: "perfil",
                nome: perfil?.nome,
                negocio: perfil?.negocio,
                premium: perfil?.premium,
                onEditar: () => {
                    // TODO: abrir a tela de edição de perfil
                },
            }}
        >
            {!perfil ? (
                <View style={style.carregando}>
                    <ActivityIndicator color={themes.colors["dourado"]} size="large" />
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={style.conteudo}
                >
                    {/* resumo */}
                    <View style={[style.card, style.resumo]}>
                        <View style={style.resumoItem}>
                            <Text style={style.resumoNumero}>{perfil.resumo.pedidos}</Text>
                            <Text style={style.resumoRotulo}>Pedidos</Text>
                        </View>

                        <View style={[style.resumoItem, style.resumoDivisor]}>
                            <Text style={style.resumoNumero}>{perfil.resumo.clientes}</Text>
                            <Text style={style.resumoRotulo}>Clientes</Text>
                        </View>

                        <View style={[style.resumoItem, style.resumoDivisor]}>
                            <Text style={style.resumoNumero}>{perfil.resumo.produtos}</Text>
                            <Text style={style.resumoRotulo}>Produtos</Text>
                        </View>
                    </View>

                    {/* dados de contato */}
                    <Secao titulo="Dados do negócio">
                        <View style={[style.card, style.cardLista]}>
                            <LinhaInfo icone="call-outline" rotulo="Telefone" valor={perfil.telefone} />
                            <LinhaInfo icone="mail-outline" rotulo="E-mail" valor={perfil.email} />
                            <LinhaInfo icone="business-outline" rotulo="CNPJ" valor={perfil.cnpj} />
                            <LinhaInfo
                                icone="key-outline"
                                rotulo="Chave PIX"
                                valor={perfil.chavePix}
                                semBorda
                            />
                        </View>
                    </Secao>

                    {/* menu */}
                    <Secao titulo="Meu negócio">
                        <View style={style.card}>
                            {MENU.map((item, i) => (
                                <ItemMenu
                                    key={item.texto}
                                    {...item}
                                    semBorda={i === MENU.length - 1}
                                />
                            ))}
                        </View>

                        <View style={style.card}>
                            <ItemMenu
                                icone="settings-outline"
                                texto="Configurações"
                                destino="Configuracoes"
                                semBorda
                            />
                        </View>
                    </Secao>

                    <Button
                        texto="Sair da conta"
                        cor="branco"
                        corTexto="erro"
                        icone="log-out-outline"
                        onPress={sair}
                    />
                </ScrollView>
            )}
        </AppLayout>
    )
}