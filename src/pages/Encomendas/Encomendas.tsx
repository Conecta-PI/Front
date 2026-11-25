
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, TextInput, View } from "react-native"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"

import AppLayout from "../../components/AppLayout/AppLayout"
import Button from "../../components/Button/Button"
import PopupStatus, { type TipoPopup } from "../../components/PopupStatus/"
import { themes } from "../../global/themes"
import { style } from "./style"
import type { RootStackParamList } from "../../routes"
import { listarEncomendas, atualizarStatusEncomenda, type Encomenda } from "../../services/encomendas"

type AcaoPendente = {
    id: number
    codigo: string
    status: string
    titulo: string
}

function normalizar(valor: string) {
    return valor.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function formatarDataHora(data?: string | null, horario?: string | null) {
    if (!data) return ""

    let dataFormatada = data

    const dataISO = data.match(/^(\d{4})-(\d{2})-(\d{2})/)

    if (dataISO) {
        dataFormatada = `${dataISO[3]}/${dataISO[2]}/${dataISO[1]}`
    } else {
        const dataBR = data.match(/^(\d{2})\/(\d{2})\/(\d{4})/)

        if (dataBR) {
            dataFormatada = `${dataBR[1]}/${dataBR[2]}/${dataBR[3]}`
        }
    }

    const horarioFormatado = horario ? horario.slice(0, 5) : ""

    return horarioFormatado
        ? `${dataFormatada} ${horarioFormatado}`
        : dataFormatada
}

export default function Encomendas() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const filtrosScrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null)

    const [dados, setDados] = useState<Encomenda[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [busca, setBusca] = useState("")
    const [filtro, setFiltro] = useState("todas")

    const [popupVisivel, setPopupVisivel] = useState(false)
    const [popupTipo, setPopupTipo] = useState<TipoPopup>("erro")
    const [popupTitulo, setPopupTitulo] = useState("")
    const [popupMensagem, setPopupMensagem] = useState("")
    const [acaoPendente, setAcaoPendente] = useState<AcaoPendente | null>(null)
    const [atualizandoStatus, setAtualizandoStatus] = useState(false)

    const carregar = useCallback(() => {
        setCarregando(true)

        listarEncomendas()
            .then((reais) => {
                setDados(reais)
                setErro(null)
            })
            .catch((error: unknown) => {
                setDados([])
                setErro(
                    error instanceof Error
                        ? error.message
                        : "Não foi possível carregar as encomendas."
                )
            })
            .finally(() => setCarregando(false))
    }, [])

    useEffect(() => {
        requestAnimationFrame(() => {
            if (filtro === "entregue" || filtro === "canceladas") {
                filtrosScrollRef.current?.scrollToEnd({ animated: true })
            } else if (filtro === "todas") {
                filtrosScrollRef.current?.scrollTo({
                    x: 0,
                    y: 0,
                    animated: true,
                })
            }
        })
    }, [filtro])

    useFocusEffect(
        useCallback(() => {
            carregar()
        }, [carregar])
    )

    const filtradas = useMemo(() => {
        const termo = normalizar(busca.trim())

        return dados.filter((item) => {
            const status = normalizar(item.status)

            const correspondeBusca =
                !termo ||
                normalizar(`${item.codigo} ${item.clienteNome}`).includes(termo)

            let correspondeFiltro = true

            if (filtro === "canceladas") {
                correspondeFiltro = status.includes("cancel")
            } else if (filtro !== "todas") {
                correspondeFiltro = status.includes(filtro)
            }

            return correspondeBusca && correspondeFiltro
        })
    }, [dados, busca, filtro])

    const contagem = useMemo(() => ({
        todas: dados.length,
        pendente: dados.filter((item) =>
            normalizar(item.status).includes("pendente") ||
            normalizar(item.status).includes("aguardando")
        ).length,
        producao: dados.filter((item) =>
            normalizar(item.status).includes("produ") ||
            normalizar(item.status).includes("andamento")
        ).length,
        rota: dados.filter((item) =>
            normalizar(item.status).includes("rota")
        ).length,
        pronta: dados.filter((item) =>
            normalizar(item.status).includes("pronta") ||
            normalizar(item.status).includes("preparada")
        ).length,
        entregue: dados.filter((item) =>
            normalizar(item.status).includes("entregue")
        ).length,
        canceladas: dados.filter((item) =>
            normalizar(item.status).includes("cancel")
        ).length,
    }), [dados])

    function textoStatus(status: string) {
        const normalizado = normalizar(status)

        if (normalizado.includes("entregue")) return "Entregue"
        if (normalizado.includes("cancel")) return "Cancelada"
        if (normalizado.includes("pronta") || normalizado.includes("preparada")) return "Pronta"
        if (normalizado.includes("rota")) return "Em rota"
        if (normalizado.includes("produ") || normalizado.includes("andamento")) return "Em produção"

        return "Pendente"
    }

    function confirmarStatus(item: Encomenda, status: string, titulo: string) {
        setAcaoPendente({
            id: item.id,
            codigo: item.codigo,
            status,
            titulo,
        })

        setPopupTipo("confirmacao")
        setPopupTitulo(titulo)
        setPopupMensagem(`Deseja atualizar a encomenda ${item.codigo}?`)
        setPopupVisivel(true)
    }

    async function executarAtualizacaoStatus() {
        if (!acaoPendente || atualizandoStatus) return

        setAtualizandoStatus(true)

        try {
            await atualizarStatusEncomenda(
                acaoPendente.id,
                acaoPendente.status
            )

            setPopupVisivel(false)
            setAcaoPendente(null)
            carregar()
        } catch (error) {
            setPopupTipo("erro")
            setPopupTitulo("Não foi possível atualizar")
            setPopupMensagem(
                error instanceof Error
                    ? error.message
                    : "Tente novamente."
            )
        } finally {
            setAtualizandoStatus(false)
        }
    }

    function fecharPopup() {
        if (atualizandoStatus) return

        setPopupVisivel(false)
        setAcaoPendente(null)
    }

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Encomendas" }}>
            <View style={style.tela}>
                <View style={style.resumoLinha}>
                    {[
                        { label: "Pendentes", valor: contagem.pendente, cor: "#A7702A" },
                        { label: "Produção", valor: contagem.producao, cor: "#2563EB" },
                        { label: "Em rota", valor: contagem.rota, cor: "#7C3AED" },
                        { label: "Entregues", valor: contagem.entregue, cor: "#0E7C56" },
                    ].map((card) => (
                        <View key={card.label} style={style.resumoCard}>
                            <Text
                                style={style.resumoRotulo}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                            >
                                {card.label}
                            </Text>

                            <Text style={[style.resumoValor, { color: card.cor }]}>
                                {card.valor}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={style.buscaLinha}>
                    <View style={style.buscaCampo}>
                        <Ionicons
                            name="search-outline"
                            size={18}
                            color={themes.colors["marrom-suave"]}
                        />

                        <TextInput
                            value={busca}
                            onChangeText={setBusca}
                            placeholder="Código ou cliente"
                            placeholderTextColor={themes.colors["texto-secundario"]}
                            style={style.buscaInput}
                        />
                    </View>

                    <Button
                        texto="Nova"
                        icone="add"
                        formato="arredondado"
                        onPress={() => navigation.navigate("Clientes")}
                        style={style.novoBotao}
                    />
                </View>

                <ScrollView
                    ref={filtrosScrollRef}
                    horizontal={true}
                    directionalLockEnabled={true}
                    nestedScrollEnabled={true}
                    showsHorizontalScrollIndicator={true}
                    bounces={false}
                    style={{
                        flexGrow: 0,
                        flexShrink: 0,
                        width: "100%",
                    }}
                    contentContainerStyle={style.filtros}
                >
                    {["todas", "pendente", "producao", "rota", "pronta", "entregue", "canceladas"].map((opcao) => {
                        const ativo = filtro === opcao

                        const rotulo =
                            opcao === "producao" ? "Produção" :
                            opcao === "rota" ? "Em rota" :
                            opcao === "pronta" ? "Prontas" :
                            opcao === "pendente" ? "Pendentes" :
                            opcao === "entregue" ? "Entregues" :
                            opcao === "canceladas" ? "Canceladas" : "Todas"

                        return (
                            <Pressable
                                key={opcao}
                                onPress={() => setFiltro(opcao)}
                                style={[style.filtro, ativo && style.filtroAtivo]}
                            >
                                <Text
                                    style={[style.filtroTexto, ativo && style.filtroTextoAtivo]}
                                    numberOfLines={1}
                                >
                                    {rotulo}
                                </Text>
                            </Pressable>
                        )
                    })}
                </ScrollView>

                {carregando ? (
                    <View style={style.centro}>
                        <ActivityIndicator size="large" color="#A7702A" />
                    </View>
                ) : erro ? (
                    <Text style={style.erro}>{erro}</Text>
                ) : (
                    <FlatList
                        data={filtradas}
                        keyExtractor={(item) => String(item.id)}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={style.lista}
                        ListEmptyComponent={
                            <Text style={style.vazio}>
                                Nenhuma encomenda encontrada.
                            </Text>
                        }
                        renderItem={({ item }) => {
                            const statusNormalizado = normalizar(item.status)

                            const finalizada =
                                statusNormalizado.includes("entregue") ||
                                statusNormalizado.includes("cancel")

                            const cancelada = statusNormalizado.includes("cancel")
                            const entregue = statusNormalizado.includes("entregue")

                            const corBadge = cancelada
                                ? { fundo: "#FDECEC", texto: "#B42318" }
                                : entregue
                                    ? { fundo: "#E6F4EA", texto: "#0E7C56" }
                                    : { fundo: "#FFF4D6", texto: "#8A5A12" }

                            return (
                                <Pressable
                                    onPress={() =>
                                        navigation.navigate("DetalheEncomenda", {
                                            id: String(item.id),
                                        })
                                    }
                                    style={style.card}
                                >
                                    <View style={style.cardTopo}>
                                        <Text
                                            style={style.cliente}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {item.clienteNome}
                                        </Text>

                                        <View
                                            style={[
                                                style.statusBadge,
                                                { backgroundColor: corBadge.fundo },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    style.statusTexto,
                                                    { color: corBadge.texto },
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {textoStatus(item.status)}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={style.codigo} numberOfLines={1}>
                                        Código: {item.codigo}
                                    </Text>

                                    {!!item.dataEntrega && (
                                        <Text style={style.detalhe}>
                                            Entrega: {formatarDataHora(
                                                item.dataEntrega,
                                                item.horario
                                            )}
                                        </Text>
                                    )}

                                    <Text style={style.detalhe}>
                                        {Number(item.valorTotal ?? 0).toLocaleString(
                                            "pt-BR",
                                            {
                                                style: "currency",
                                                currency: "BRL",
                                            }
                                        )}
                                    </Text>

                                    {!finalizada && (
                                        <View style={style.acoes}>
                                            <Pressable
                                                onPress={() =>
                                                    confirmarStatus(
                                                        item,
                                                        "em_producao",
                                                        "Colocar em produção?"
                                                    )
                                                }
                                                style={[
                                                    style.acao,
                                                    { backgroundColor: "#EDF4FF" },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        style.acaoTexto,
                                                        { color: "#2563EB" },
                                                    ]}
                                                    numberOfLines={1}
                                                >
                                                    Produção
                                                </Text>
                                            </Pressable>

                                            <Pressable
                                                onPress={() =>
                                                    confirmarStatus(
                                                        item,
                                                        "pronta",
                                                        "Marcar como pronta?"
                                                    )
                                                }
                                                style={[
                                                    style.acao,
                                                    { backgroundColor: "#FFF4D6" },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        style.acaoTexto,
                                                        { color: "#8A5A12" },
                                                    ]}
                                                    numberOfLines={1}
                                                >
                                                    Pronta
                                                </Text>
                                            </Pressable>

                                            <Pressable
                                                onPress={() =>
                                                    confirmarStatus(
                                                        item,
                                                        "entregue",
                                                        "Marcar como entregue?"
                                                    )
                                                }
                                                style={[
                                                    style.acao,
                                                    { backgroundColor: "#D9F7E8" },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        style.acaoTexto,
                                                        { color: "#0E7C56" },
                                                    ]}
                                                    numberOfLines={1}
                                                >
                                                    Entregue
                                                </Text>
                                            </Pressable>
                                        </View>
                                    )}
                                </Pressable>
                            )
                        }}
                    />
                )}
            </View>

            <PopupStatus
                visivel={popupVisivel}
                tipo={popupTipo}
                titulo={popupTitulo}
                mensagem={popupMensagem}
                textoConfirmar="Confirmar"
                textoCarregando="Atualizando..."
                carregando={atualizandoStatus}
                onFechar={fecharPopup}
                onConfirmar={executarAtualizacaoStatus}
            />
        </AppLayout>
    )
}
