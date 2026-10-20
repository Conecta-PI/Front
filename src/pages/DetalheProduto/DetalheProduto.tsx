import React from "react"
import { Image, ScrollView, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { RouteProp, useRoute } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { style } from "./style"
import { themes } from "../../global/themes"
import AppLayout from "../../components/AppLayout/AppLayout"
import Button from "../../components/Button/Button"
import { buscarProduto } from "../../services/produtos"
import { formatarMoeda } from "../../utils/formataMoeda"
import type { RootStackParamList } from "../../routes"

export default function DetalheProduto() {
    const { params } = useRoute<RouteProp<RootStackParamList, "DetalheProduto">>()
    const insets = useSafeAreaInsets()

    const produto = buscarProduto(params.id)

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: produto?.nome ?? "Produto" }}>
            {!produto ? (
                <View style={style.centro}>
                    <Text style={style.vazio}>Produto não encontrado.</Text>
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
                        texto="Adicionar ao pedido"
                        icone="cart-outline"
                        onPress={() => {
                            // TODO: adicionar ao pedido
                        }}
                    />
                </ScrollView>
            )}
        </AppLayout>
    )
}