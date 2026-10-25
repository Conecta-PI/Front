import React, { useCallback, useMemo, useState } from "react"
import { FlatList, Text } from "react-native"
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native"

import { style } from "./style"
import AppLayout from "../../components/AppLayout/AppLayout"
import ProdutoCard from "../../components/ProdutoCard/"
import Button from "../../components/Button/Button"
import { CATEGORIAS, filtrarProdutos, listarProdutos } from "../../services/produtos"
import type { Produto } from "../../types/produto"
import type { AppParamList } from "../../routes"

export default function Produtos() {
    const navigation = useNavigation<NavigationProp<AppParamList>>()

    const [busca, setBusca] = useState("")
    const [categoria, setCategoria] = useState("Todos")
    const [todosProdutos, setTodosProdutos] = useState<Produto[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    const produtos = useMemo(
        () => filtrarProdutos(todosProdutos, busca, categoria),
        [todosProdutos, busca, categoria]
    )

    useFocusEffect(
        useCallback(() => {
            let ativo = true

            listarProdutos()
                .then((dados) => {
                    if (ativo) {
                        setTodosProdutos(dados)
                        setErro(null)
                        setCarregando(false)
                    }
                })
                .catch((error: unknown) => {
                    if (ativo) {
                        setErro(error instanceof Error ? error.message : "Erro ao carregar produtos.")
                        setCarregando(false)
                    }
                })

            return () => {
                ativo = false
            }
        }, [])
    )

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
                        onPress={() => navigation.navigate("DetalheProduto", { id: item.id })}
                    />
                )}
                ListEmptyComponent={
                    <Text style={style.vazio}>
                        {erro ?? (carregando ? "Carregando produtos..." : "Nenhum produto encontrado.")}
                    </Text>
                }
            />

            <Button
                texto="Adicionar produto"
                formato="arredondado"
                onPress={() => navigation.navigate("NovoProduto")}
                style={style.botaoAdicionar}
            />
        </AppLayout>
    )
}