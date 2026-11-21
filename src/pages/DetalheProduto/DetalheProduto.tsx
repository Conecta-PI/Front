import React, { useEffect, useState } from "react"
import { Alert, Image, ScrollView, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { style } from "./style"
import { themes } from "../../global/themes"
import AppLayout from "../../components/AppLayout/AppLayout"
import Button from "../../components/Button/Button"
import { buscarProduto, excluirProduto } from "../../services/produtos"
import { formatarMoeda } from "../../utils/formataMoeda"
import type { AppParamList, RootStackParamList } from "../../routes"

export default function DetalheProduto() {
    const { params } = useRoute<RouteProp<RootStackParamList, "DetalheProduto">>()
    const navigation = useNavigation<NavigationProp<AppParamList>>()
    const insets = useSafeAreaInsets()

    const [produto, setProduto] = useState<Awaited<ReturnType<typeof buscarProduto>>>(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [excluindo, setExcluindo] = useState(false)

    useEffect(() => {
        let ativo = true

        buscarProduto(params.id)
            .then((dados) => {
                if (ativo) {
                    setProduto(dados)
                    setErro(null)
                    setCarregando(false)
                }
            })
            .catch((error: unknown) => {
                if (ativo) {
                    setErro(error instanceof Error ? error.message : "Erro ao carregar produto.")
                    setCarregando(false)
                }
            })

        return () => {
            ativo = false
        }
    }, [params.id])

    function confirmarExclusao() {
        Alert.alert(
            "Excluir produto",
            "Tem certeza que deseja excluir este produto?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        setExcluindo(true)
                        try {
                            await excluirProduto(params.id)
                            navigation.navigate("Produtos")
                        } catch (error) {
                            Alert.alert("Erro", error instanceof Error ? error.message : "Não foi possível excluir o produto.")
                            setExcluindo(false)
                        }
                    },
                },
            ]
        )
    }

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: produto?.nome ?? "Produto" }}>
            {!produto ? (
                <View style={style.centro}>
                    <Text style={style.vazio}>
                        {erro ?? (carregando ? "Carregando produto..." : "Produto não encontrado.")}
                    </Text>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[style.conteudo, { paddingBottom: 24 + insets.bottom }]}
                >
                    {produto.imagem ? (
                        <Image source={{ uri: produto.imagem }} style={style.imagem} />
                    ) : (
                        <View style={[style.imagem, style.semImagem]}>
                            <Ionicons name="image-outline" size={48} color={themes.colors["marrom-suave"]} />
                        </View>
                    )}

                    <View style={style.info}>
                        <Text style={style.categoria}>{produto.categoria}</Text>
                        <Text style={style.preco}>{formatarMoeda(produto.preco)}</Text>
                        <Text style={style.descricao}>{produto.descricao}</Text>
                    </View>

                    <Button
                        texto="Editar produto"
                        icone="create-outline"
                        onPress={() => navigation.navigate("NovoProduto", { id: params.id })}
                    />

                    <Button
                        texto="Adicionar ao pedido"
                        icone="cart-outline"
                        variante="contorno"
                        onPress={() => {
                            navigation.navigate("Main", {
                                screen: "Cobrar",
                                params: { produtoId: params.id },
                            })
                            Alert.alert("Produto adicionado", `${produto.nome} foi incluído no pedido.`)
                        }}
                    />

                    <Button
                        texto={excluindo ? "Excluindo..." : "Excluir produto"}
                        icone="trash-outline"
                        cor="erro"
                        variante="contorno"
                        disabled={excluindo}
                        onPress={confirmarExclusao}
                    />
                </ScrollView>
            )}
        </AppLayout>
    )
}