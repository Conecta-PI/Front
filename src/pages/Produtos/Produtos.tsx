
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { FlatList, Text, View } from "react-native"
import {
    NavigationProp,
    RouteProp,
    useFocusEffect,
    useNavigation,
    useRoute,
} from "@react-navigation/native"

import { style } from "./style"
import AppLayout from "../../components/AppLayout/AppLayout"
import ProdutoCard from "../../components/ProdutoCard/"
import Button from "../../components/Button/Button"
import {
    CATEGORIAS,
    filtrarProdutos,
    listarProdutos,
    listarProdutosInativos,
} from "../../services/produtos"
import type { Produto } from "../../types/produto"
import type { AppParamList, RootTabParamList } from "../../routes"

export default function Produtos() {
    const navigation = useNavigation<NavigationProp<AppParamList>>()
    const route = useRoute<RouteProp<RootTabParamList, "Produtos">>()

    const [busca, setBusca] = useState("")
    const [categoria, setCategoria] = useState("Todos")
    const [todosProdutos, setTodosProdutos] = useState<Produto[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [mostrarInativos, setMostrarInativos] = useState(false)

    useEffect(() => {
        const destino = route.params?.mostrarInativos

        if (destino !== undefined) {
            setMostrarInativos(destino)
            setBusca("")
            setCategoria("Todos")
            setErro(null)

            navigation.setParams({ mostrarInativos: undefined })
        }
    }, [route.params?.mostrarInativos, navigation])

    const produtos = useMemo(
        () => filtrarProdutos(todosProdutos, busca, categoria),
        [todosProdutos, busca, categoria]
    )

    useFocusEffect(
        useCallback(() => {
            let ativo = true

            setCarregando(true)

            const carregar = mostrarInativos
                ? listarProdutosInativos
                : listarProdutos

            carregar()
                .then((dados) => {
                    if (ativo) {
                        setTodosProdutos(dados)
                        setErro(null)
                        setCarregando(false)
                    }
                })
                .catch((error: unknown) => {
                    if (ativo) {
                        setErro(
                            error instanceof Error
                                ? error.message
                                : "Erro ao carregar produtos."
                        )
                        setCarregando(false)
                    }
                })

            return () => {
                ativo = false
            }
        }, [mostrarInativos])
    )

    function alternarLista(inativos: boolean) {
        if (mostrarInativos !== inativos) {
            setBusca("")
            setCategoria("Todos")
            setCarregando(true)
            setErro(null)
            setMostrarInativos(inativos)
        }
    }

    return (
        <AppLayout
            header={{
                tipo: "catalogo",
                titulo: "Produtos",
                busca,
                onChangeBusca: setBusca,
                categorias: CATEGORIAS,
                categoriaAtiva: categoria,
                onChangeCategoria: setCategoria,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    gap: 8,
                    paddingHorizontal: 16,
                    paddingTop: 8,
                    paddingBottom: 4,
                }}
            >
                <Button
                    texto="Produtos ativos"
                    formato="arredondado"
                    textoEmUmaLinha={true}
                    variante={mostrarInativos ? "contorno" : "preenchido"}
                    style={{ flex: 1 }}
                    onPress={() => alternarLista(false)}
                />

                <Button
                    texto="Produtos inativos"
                    textoEmUmaLinha={true}
                    formato="arredondado"
                    variante={mostrarInativos ? "preenchido" : "contorno"}
                    style={{ flex: 1 }}
                    onPress={() => alternarLista(true)}
                />
            </View>

            <FlatList
                data={produtos}
                keyExtractor={(p) => p.id}
                numColumns={2}
                columnWrapperStyle={style.coluna}
                contentContainerStyle={style.lista}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                    erro && todosProdutos.length > 0 ? (
                        <Text style={style.vazio}>{erro}</Text>
                    ) : undefined
                }
                renderItem={({ item }) => (
                    <ProdutoCard
                        tipo="estoque"
                        produto={item}
                        onPress={() =>
                            navigation.navigate("DetalheProduto", {
                                id: item.id,
                            })
                        }
                    />
                )}
                ListEmptyComponent={
                    <Text style={style.vazio}>
                        {erro ??
                            (carregando
                                ? "Carregando produtos..."
                                : mostrarInativos
                                    ? "Nenhum produto inativo encontrado."
                                    : "Nenhum produto encontrado.")}
                    </Text>
                }
            />

            {!mostrarInativos && (
                <Button
                    texto="Adicionar produto"
                    formato="arredondado"
                    onPress={() => navigation.navigate("NovoProduto")}
                    style={style.botaoAdicionar}
                />
            )}
        </AppLayout>
    )
}
