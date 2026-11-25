
import React, { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native"

import PopupStatus, { type TipoPopup } from "../../components/PopupStatus/"
import { RouteProp, useRoute } from "@react-navigation/native"

import AppLayout from "../../components/AppLayout/AppLayout"
import type { RootStackParamList } from "../../routes"
import {
    atualizarStatusEncomenda,
    buscarEncomenda,
    type Encomenda,
} from "../../services/encomendas"

export default function DetalheEncomenda() {
    const { params } = useRoute<RouteProp<RootStackParamList, "DetalheEncomenda">>()

    const [encomenda, setEncomenda] = useState<Encomenda | null>(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [atualizando, setAtualizando] = useState(false)

    const [popupVisivel, setPopupVisivel] = useState(false)
    const [popupTipo, setPopupTipo] = useState<TipoPopup>("erro")
    const [popupTitulo, setPopupTitulo] = useState("")
    const [popupMensagem, setPopupMensagem] = useState("")
    const [statusPendente, setStatusPendente] = useState<string | null>(null)

    useEffect(() => {
        buscarEncomenda(params.id)
            .then(setEncomenda)
            .catch((error: unknown) =>
                setErro(
                    error instanceof Error
                        ? error.message
                        : "Erro ao carregar encomenda."
                )
            )
            .finally(() => setCarregando(false))
    }, [params.id])

    function abrirConfirmacao(status: string, titulo: string) {
        setStatusPendente(status)
        setPopupTipo("confirmacao")
        setPopupTitulo(titulo)
        setPopupMensagem(`Deseja atualizar a encomenda ${encomenda?.codigo}?`)
        setPopupVisivel(true)
    }

    async function executarMudanca() {
        if (!statusPendente || atualizando) return

        setAtualizando(true)

        try {
            const atualizada = await atualizarStatusEncomenda(
                params.id,
                statusPendente
            )

            if (atualizada) {
                setEncomenda(atualizada)
            }

            setPopupVisivel(false)
            setStatusPendente(null)
        } catch (error) {
            setPopupTipo("erro")
            setPopupTitulo("Não foi possível atualizar")
            setPopupMensagem(
                error instanceof Error
                    ? error.message
                    : "Tente novamente."
            )
        } finally {
            setAtualizando(false)
        }
    }

    function fecharPopup() {
        if (atualizando) return

        setPopupVisivel(false)
        setStatusPendente(null)
    }
    function formatarValor(valor: number | string | null | undefined) {
        return Number(valor ?? 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        })
    }

    function statusFinalizado(status: string) {
        return ["entregue", "cancelada", "cancelado"].includes(
            status.toLowerCase()
        )
    }

    return (
        <AppLayout
            header={{
                tipo: "detalhe",
                titulo: `Encomenda #${params.id}`,
            }}
        >
            <ScrollView
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: 32,
                }}
            >
                {carregando ? (
                    <View
                        style={{
                            minHeight: 200,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <ActivityIndicator size="large" color="#A7702A" />
                    </View>
                ) : erro || !encomenda ? (
                    <Text
                        style={{
                            color: "#B42318",
                            textAlign: "center",
                        }}
                    >
                        {erro ?? "Encomenda não encontrada."}
                    </Text>
                ) : (
                    <View style={{ width: "100%" }}>
                        {/* Dados principais */}
                        <View
                            style={{
                                width: "100%",
                                backgroundColor: "#fff",
                                borderRadius: 16,
                                padding: 16,
                                marginBottom: 12,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#6B7280",
                                    fontSize: 12,
                                    fontWeight: "600",
                                }}
                            >
                                CÓDIGO DA ENCOMENDA
                            </Text>

                            <Text
                                style={{
                                    color: "#374151",
                                    fontSize: 20,
                                    fontWeight: "700",
                                    marginTop: 4,
                                }}
                            >
                                {encomenda.codigo}
                            </Text>

                            <View
                                style={{
                                    alignSelf: "flex-start",
                                    backgroundColor: "#FFF4D6",
                                    borderRadius: 10,
                                    paddingVertical: 6,
                                    paddingHorizontal: 10,
                                    marginTop: 12,
                                    maxWidth: "100%",
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#8A5A12",
                                        fontWeight: "700",
                                        textTransform: "capitalize",
                                    }}
                                >
                                    {encomenda.status.replace(/_/g, " ")}
                                </Text>
                            </View>

                            <Text
                                style={{
                                    color: "#374151",
                                    marginTop: 16,
                                    fontWeight: "600",
                                    fontSize: 16,
                                }}
                            >
                                {encomenda.clienteNome}
                            </Text>

                            {!!encomenda.dataEntrega && (
                                <Text
                                    style={{
                                        color: "#6B7280",
                                        marginTop: 8,
                                    }}
                                >
                                    Entrega: {encomenda.dataEntrega}
                                    {encomenda.horario
                                        ? ` às ${encomenda.horario}`
                                        : ""}
                                </Text>
                            )}

                            {!!encomenda.tipoEntrega && (
                                <Text
                                    style={{
                                        color: "#6B7280",
                                        marginTop: 4,
                                    }}
                                >
                                    Modalidade:{" "}
                                    {encomenda.tipoEntrega === "entrega"
                                        ? "Entrega"
                                        : "Retirada"}
                                </Text>
                            )}

                            <Text
                                style={{
                                    color: "#374151",
                                    marginTop: 12,
                                    fontWeight: "700",
                                }}
                            >
                                Valor total: {formatarValor(encomenda.valorTotal)}
                            </Text>

                            <Text
                                style={{
                                    color: "#0E7C56",
                                    marginTop: 4,
                                }}
                            >
                                Sinal pago: {formatarValor(encomenda.sinalPago)}
                            </Text>

                            {!!encomenda.observacao && (
                                <Text
                                    style={{
                                        color: "#6B7280",
                                        marginTop: 8,
                                    }}
                                >
                                    Observação: {encomenda.observacao}
                                </Text>
                            )}
                        </View>

                        {/* Itens */}
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "700",
                                marginBottom: 8,
                                color: "#374151",
                            }}
                        >
                            Itens
                        </Text>

                        <View
                            style={{
                                width: "100%",
                                backgroundColor: "#fff",
                                borderRadius: 16,
                                padding: 16,
                                marginBottom: 12,
                            }}
                        >
                            {encomenda.itens?.length ? (
                                encomenda.itens.map((item, index) => (
                                    <View
                                        key={`${item.nomeProduto}-${index}`}
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: 8,
                                            marginBottom: 10,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                flex: 1,
                                                minWidth: 0,
                                                color: "#374151",
                                            }}
                                        >
                                            {item.nomeProduto} × {item.quantidade}
                                        </Text>

                                        <Text
                                            style={{
                                                color: "#374151",
                                                fontWeight: "700",
                                            }}
                                        >
                                            {formatarValor(
                                                Number(item.precoUnitario ?? 0) *
                                                item.quantidade
                                            )}
                                        </Text>
                                    </View>
                                ))
                            ) : (
                                <Text>Nenhum item nesta encomenda.</Text>
                            )}
                        </View>

                        {/* Ações */}
                        {!statusFinalizado(encomenda.status) && (
                            <View
                                style={{
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    gap: 10,
                                    marginTop: 4,
                                }}
                            >
                                <Pressable
                                    disabled={atualizando}
                                    onPress={() =>
                                        abrirConfirmacao(
                                            "em_producao",
                                            "Colocar em produção?"
                                        )
                                    }
                                    style={{
                                        width: "48%",
                                        minHeight: 48,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#EDF4FF",
                                        padding: 10,
                                        borderRadius: 12,
                                        opacity: atualizando ? 0.5 : 1,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#2563EB",
                                            fontWeight: "700",
                                            textAlign: "center",
                                        }}
                                    >
                                        Produção
                                    </Text>
                                </Pressable>

                                <Pressable
                                    disabled={atualizando}
                                    onPress={() =>
                                        abrirConfirmacao(
                                            "em_rota",
                                            "Colocar em rota?"
                                        )
                                    }
                                    style={{
                                        width: "48%",
                                        minHeight: 48,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#F3E8FF",
                                        padding: 10,
                                        borderRadius: 12,
                                        opacity: atualizando ? 0.5 : 1,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#7C3AED",
                                            fontWeight: "700",
                                            textAlign: "center",
                                        }}
                                    >
                                        Em rota
                                    </Text>
                                </Pressable>

                                <Pressable
                                    disabled={atualizando}
                                    onPress={() =>
                                        abrirConfirmacao(
                                            "pronta",
                                            "Marcar como pronta?"
                                        )
                                    }
                                    style={{
                                        width: "48%",
                                        minHeight: 48,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#FFF4D6",
                                        padding: 10,
                                        borderRadius: 12,
                                        opacity: atualizando ? 0.5 : 1,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#8A5A12",
                                            fontWeight: "700",
                                            textAlign: "center",
                                        }}
                                    >
                                        Pronta
                                    </Text>
                                </Pressable>

                                <Pressable
                                    disabled={atualizando}
                                    onPress={() =>
                                        abrirConfirmacao(
                                            "entregue",
                                            "Marcar como entregue?"
                                        )
                                    }
                                    style={{
                                        width: "48%",
                                        minHeight: 48,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#D9F7E8",
                                        padding: 10,
                                        borderRadius: 12,
                                        opacity: atualizando ? 0.5 : 1,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#0E7C56",
                                            fontWeight: "700",
                                            textAlign: "center",
                                        }}
                                    >
                                        Entregue
                                    </Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            <PopupStatus
                visivel={popupVisivel}
                tipo={popupTipo}
                titulo={popupTitulo}
                mensagem={popupMensagem}
                textoConfirmar="Confirmar"
                textoCarregando="Atualizando..."
                carregando={atualizando}
                onFechar={fecharPopup}
                onConfirmar={executarMudanca}
            />
        </AppLayout>
    )
}
