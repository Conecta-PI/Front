
import React, { useEffect, useState } from "react"
import { Alert, Image, ScrollView, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import {
    NavigationProp,
    RouteProp,
    useNavigation,
    useRoute,
} from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { style } from "./style"
import { themes } from "../../global/themes"
import AppLayout from "../../components/AppLayout/AppLayout"
import Button from "../../components/Button/Button"
import PopupStatus from "../../components/PopupStatus"
import {
    buscarProduto,
    excluirProduto,
    reativarProduto,
} from "../../services/produtos"
import { formatarMoeda } from "../../utils/formataMoeda"
import type { AppParamList, RootStackParamList } from "../../routes"

export default function DetalheProduto() {
    const { params } = useRoute<
        RouteProp<RootStackParamList, "DetalheProduto">
    >()
    const navigation = useNavigation<NavigationProp<AppParamList>>()
    const insets = useSafeAreaInsets()

    const [produto, setProduto] = useState<
        Awaited<ReturnType<typeof buscarProduto>>
    >(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    const [popupInativar, setPopupInativar] = useState(false)
    const [popupAdicionar, setPopupAdicionar] = useState(false)

    const [excluindo, setExcluindo] = useState(false)
    const [reativando, setReativando] = useState(false)

    const produtoEsgotado = produto !== null && produto.estoque <= 0

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
                    setErro(
                        error instanceof Error
                            ? error.message
                            : "Erro ao carregar produto."
                    )
                    setCarregando(false)
                }
            })

        return () => {
            ativo = false
        }
    }, [params.id])

    function confirmarExclusao() {
        setPopupInativar(true)
    }

    async function inativar() {
        setExcluindo(true)

        try {
            await excluirProduto(params.id)
            setPopupInativar(false)

            navigation.navigate("Main", {
                screen: "Produtos",
                params: {
                    mostrarInativos: true,
                },
            })
        } catch (error) {
            setPopupInativar(false)

            setErro(
                error instanceof Error
                    ? error.message
                    : "Não foi possível inativar o produto."
            )
        } finally {
            setExcluindo(false)
        }
    }

    async function reativar() {
        setReativando(true)

        try {
            await reativarProduto(params.id)

            setProduto((atual) =>
                atual ? { ...atual, ativo: true } : atual
            )

            navigation.navigate("Main", {
                screen: "Produtos",
                params: {
                    mostrarInativos: false,
                },
            })
        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Não foi possível reativar o produto."
            )
        } finally {
            setReativando(false)
        }
    }

    function adicionarAoPedido() {
        if (!produto || produto.estoque <= 0) {
            Alert.alert(
                "Produto esgotado",
                "Não há unidades disponíveis em estoque para adicionar este produto ao pedido."
            )
            return
        }

        setPopupAdicionar(true)
    }

    function continuarParaCobranca() {
        setPopupAdicionar(false)

        navigation.navigate("Main", {
            screen: "Cobrar",
            params: {
                produtoId: params.id,
            },
        })
    }

    return (
        <AppLayout
            header={{
                tipo: "detalhe",
                titulo: produto?.nome ?? "Produto",
            }}
        >
            {!produto ? (
                <View style={style.centro}>
                    <Text style={style.vazio}>
                        {erro ??
                            (carregando
                                ? "Carregando produto..."
                                : "Produto não encontrado.")}
                    </Text>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        style.conteudo,
                        { paddingBottom: 24 + insets.bottom },
                    ]}
                >
                    {produto.imagem ? (
                        <Image
                            source={{ uri: produto.imagem }}
                            style={style.imagem}
                        />
                    ) : (
                        <View style={[style.imagem, style.semImagem]}>
                            <Ionicons
                                name="image-outline"
                                size={48}
                                color={themes.colors["marrom-suave"]}
                            />
                        </View>
                    )}

                    <View style={style.info}>
                        <Text style={style.categoria}>
                            {produto.categoria}
                        </Text>

                        <Text style={style.preco}>
                            {formatarMoeda(produto.preco)}
                        </Text>

                        <Text style={style.descricao}>
                            {produto.descricao}
                        </Text>

                        <Text style={style.descricao}>
                            {produtoEsgotado
                                ? "Produto esgotado"
                                : `Estoque disponível: ${produto.estoque} unidade(s)`}
                        </Text>
                    </View>

                    <Button
                        texto="Editar produto"
                        icone="create-outline"
                        onPress={() =>
                            navigation.navigate("NovoProduto", {
                                id: params.id,
                            })
                        }
                    />

                    <Button
                        texto={
                            produtoEsgotado
                                ? "Produto esgotado"
                                : "Adicionar ao pedido"
                        }
                        icone="cart-outline"
                        variante="contorno"
                        disabled={produtoEsgotado}
                        onPress={adicionarAoPedido}
                    />

                    {produto.ativo === false ? (
                        <Button
                            texto={
                                reativando
                                    ? "Reativando..."
                                    : "Reativar produto"
                            }
                            icone="refresh-outline"
                            cor="dourado"
                            disabled={reativando}
                            onPress={reativar}
                        />
                    ) : (
                        <Button
                            texto={
                                excluindo
                                    ? "Inativando..."
                                    : "Inativar produto"
                            }
                            icone="trash-outline"
                            cor="erro"
                            variante="contorno"
                            disabled={excluindo}
                            onPress={confirmarExclusao}
                        />
                    )}
                </ScrollView>
            )}

            <PopupStatus
                visivel={popupInativar}
                tipo="confirmacao"
                titulo="Inativar produto?"
                mensagem="Este produto deixará de aparecer na lista de produtos ativos. Você poderá reativá-lo depois."
                textoConfirmar="Inativar"
                textoCarregando="Inativando..."
                carregando={excluindo}
                onConfirmar={inativar}
                onFechar={() => setPopupInativar(false)}
            />

            <PopupStatus
                visivel={popupAdicionar}
                tipo="sucesso"
                titulo="Produto adicionado!"
                mensagem={`${produto?.nome ?? "O produto"} foi incluído no pedido.`}
                textoBotao="Continuar"
                onFechar={continuarParaCobranca}
            />
        </AppLayout>
    )
}
