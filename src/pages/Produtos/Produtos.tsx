import React, { useMemo, useState } from "react"
import { FlatList, Text } from "react-native"
import { NavigationProp, useNavigation } from "@react-navigation/native"

import { style } from "./style"
import AppLayout from "../../components/AppLayout/AppLayout"
import ProdutoCard from "../../components/ProdutoCard/"
import Button from "../../components/Button/Button"
import { CATEGORIAS, filtrarProdutos } from "../../services/produtos"
import type { AppParamList } from "../../routes"

export default function Produtos() {
    const navigation = useNavigation<NavigationProp<AppParamList>>()

    const [busca, setBusca] = useState("")
    const [categoria, setCategoria] = useState("Todos")

    const produtos = useMemo(
        () => filtrarProdutos(busca, categoria),
        [busca, categoria]
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
                renderItem={({ item }) => (
                    <ProdutoCard
                        tipo="estoque"
                        produto={item}
                        onPress={() => navigation.navigate("DetalheProduto", { id: item.id })}
                    />
                )}
                ListEmptyComponent={
                    <Text style={style.vazio}>Nenhum produto encontrado.</Text>
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