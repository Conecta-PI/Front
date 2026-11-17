import React, { useEffect, useState } from "react"
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, View } from "react-native"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { style } from "./detalheStyle"
import { themes } from "../../global/themes"
import AppLayout from "../../components/AppLayout/AppLayout"
import type { Cliente } from "../../types/cliente"
import type { RootStackParamList } from "../../routes"
import {
    atualizarCliente,
    atualizarObservacaoCliente,
    buscarDetalheCliente,
    excluirCliente,
    type PedidoCliente,
} from "../../services/clientes"
import { abrirWhatsapp } from "../../utils/whatsapp"
import Input from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import BottomSheet from "../../components/BottomSheet"
import PopupStatus, { type TipoPopup } from "../../components/PopupStatus/"

type EstadoPopup = {
    visivel: boolean
    tipo: TipoPopup
    titulo: string
    mensagem: string
}

export default function DetalheCliente() {
    const { params } = useRoute<RouteProp<RootStackParamList, "DetalheCliente">>()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const insets = useSafeAreaInsets()

    const [cliente, setCliente] = useState<Cliente | null>(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [editarVisivel, setEditarVisivel] = useState(false)
    const [nome, setNome] = useState("")
    const [telefone, setTelefone] = useState("")
    const [email, setEmail] = useState("")
    const [observacao, setObservacao] = useState("")
    const [salvando, setSalvando] = useState(false)
    const [pedidos, setPedidos] = useState<PedidoCliente[]>([])
    const [excluindo, setExcluindo] = useState(false)
    const [popup, setPopup] = useState<EstadoPopup>({
        visivel: false,
        tipo: "confirmacao",
        titulo: "",
        mensagem: "",
    })

    useEffect(() => {
        let ativo = true
        buscarDetalheCliente(params.id)
            .then(({ cliente: dados, pedidos: historico }) => {
                if (ativo) {
                    setPedidos(historico)
                    setCliente(dados)
                    setNome(dados.nome)
                    setTelefone(dados.telefone)
                    setEmail(dados.email)
                    setObservacao(dados.observacao ?? "")
                }
            })
            .catch((error: unknown) => {
                if (ativo) setErro(error instanceof Error ? error.message : "Erro ao carregar cliente.")
            })
            .finally(() => {
                if (ativo) setCarregando(false)
            })
        return () => { ativo = false }
    }, [params.id])

    if (carregando) {
        return <AppLayout header={{ tipo: "detalhe", titulo: "Cliente" }}><View style={style.estado}><ActivityIndicator color={themes.colors["dourado"]} /></View></AppLayout>
    }

    if (erro || !cliente) {
        return <AppLayout header={{ tipo: "detalhe", titulo: "Cliente" }}><View style={style.estado}><Text style={style.mensagem}>{erro ?? "Cliente não encontrado."}</Text></View></AppLayout>
    }

    function novaEncomenda() {
        navigation.navigate("NovaEncomenda", {
            clienteId: cliente!.id,
            clienteNome: cliente!.nome,
        })
    }

    async function chamarWhatsapp() {
        try {
            await abrirWhatsapp(cliente!.telefone)
        } catch (error) {
            Alert.alert(
                "Não foi possível abrir o WhatsApp",
                error instanceof Error ? error.message : "Tente novamente."
            )
        }
    }

    function abrirEditar() {
        setNome(cliente!.nome)
        setTelefone(cliente!.telefone)
        setEmail(cliente!.email)
        setEditarVisivel(true)
    }

    function pedirConfirmacao() {
        setPopup({
            visivel: true,
            tipo: "confirmacao",
            titulo: "Excluir cliente?",
            mensagem: `${cliente!.nome} será removido. Essa ação não pode ser desfeita.`,
        })
    }

    async function excluir() {
        setExcluindo(true)

        try {
            await excluirCliente(cliente!.id)
            setPopup((p) => ({ ...p, visivel: false }))
            navigation.goBack()
        } catch (error) {
            setPopup({
                visivel: true,
                tipo: "erro",
                titulo: "Não foi possível excluir",
                mensagem: error instanceof Error ? error.message : "Tente novamente.",
            })
        } finally {
            setExcluindo(false)
        }
    }

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Detalhe do cliente" }}>
            <View style={style.tela}>
                <ScrollView contentContainerStyle={style.conteudo} showsVerticalScrollIndicator={false}>
                    <View style={style.perfil}>
                        <View style={style.avatar}><Text style={style.avatarTexto}>{cliente.nome.split(/\s+/).slice(0, 2).map((parte) => parte[0]).join("").toUpperCase()}</Text></View>
                        <Text style={style.nome}>{cliente.nome}</Text>
                        <Text style={style.contato}>{cliente.telefone}</Text>
                        <Text style={style.contato}>{cliente.email || "E-mail não informado"}</Text>
                        <View style={style.observacaoCampo}>
                            <Text style={style.observacaoPrefixo}>Obs:</Text>
                            <TextInput
                                value={observacao}
                                onChangeText={(texto) => {
                                    setObservacao(texto)
                                    setCliente((atual) => atual ? { ...atual, observacao: texto } : atual)
                                }}
                                placeholder="Adicionar observação"
                                placeholderTextColor={themes.colors["texto-secundario"]}
                                style={style.observacaoInput}
                                maxLength={160}
                                onEndEditing={() => {
                                    atualizarObservacaoCliente(cliente.id, observacao).catch((error: unknown) =>
                                        Alert.alert("Não foi possível salvar a observação", error instanceof Error ? error.message : "Tente novamente.")
                                    )
                                }}
                                returnKeyType="done"
                                accessibilityLabel="Observação do cliente"
                            />
                        </View>
                    </View>

                    <View style={style.metricas}>
                        <Metrica rotulo="Total gasto" valor={formatarMoeda(cliente.totalGasto)} />
                        <Metrica rotulo="Ticket médio" valor={formatarMoeda(cliente.totalGasto && cliente.quantidadePedidos ? cliente.totalGasto / cliente.quantidadePedidos : undefined)} />
                        <Metrica rotulo="Último pedido" valor={formatarData(cliente.ultimoPedido)} />
                    </View>

                    <Text style={style.tituloSecao}>Histórico de pedidos</Text>
                    <View style={style.historico}>
                        {pedidos.length > 0 ? pedidos.map((pedido) => <Pedido key={pedido.id} pedido={pedido} />) : (
                            <Text style={style.mensagem}>Nenhum pedido encontrado.</Text>
                        )}
                    </View>
                </ScrollView>

                <View style={[style.rodape, { paddingBottom: 16 + insets.bottom }]}>
                    <Button texto="Nova encomenda" onPress={novaEncomenda} />

                    <Button
                        texto="Chamar no WhatsApp"
                        cor="azul-escuro"
                        icone="logo-whatsapp"
                        onPress={chamarWhatsapp}
                    />

                    <View style={style.linhaBotoes}>
                        <Button
                            texto="Editar"
                            formato="arredondado"
                            cor="branco"
                            corTexto="marrom-suave"
                            style={style.metade}
                            onPress={abrirEditar}
                        />
                        <Button
                            texto="Excluir cliente"
                            formato="arredondado"
                            cor="branco"
                            corTexto="texto"
                            textoEmUmaLinha
                            style={style.metade}
                            onPress={pedirConfirmacao}
                        />
                    </View>
                </View>
            </View>

            <BottomSheet visivel={editarVisivel} onFechar={() => !salvando && setEditarVisivel(false)} titulo="Editar cliente">
                <Input tipo="texto" label="Nome" value={nome} onChangeText={setNome} />
                <Input tipo="telefone" label="Telefone" value={telefone} onChangeText={setTelefone} />
                <Input tipo="email" label="E-mail" value={email} onChangeText={setEmail} />
                <Button
                    texto={salvando ? "Salvando..." : "Salvar alterações"}
                    disabled={salvando || !nome.trim() || !telefone.trim() || !email.trim()}
                    onPress={async () => {
                        setSalvando(true)
                        try {
                            const atualizado = await atualizarCliente(cliente.id, { nome: nome.trim(), telefone: telefone.trim(), email: email.trim() })
                            // atualiza só os campos editados: preserva observação e métricas
                            setCliente((atual) =>
                                atual
                                    ? { ...atual, nome: atualizado.nome, telefone: atualizado.telefone, email: atualizado.email }
                                    : atual
                            )
                            setEditarVisivel(false)
                        } catch (error) {
                            Alert.alert("Não foi possível salvar", error instanceof Error ? error.message : "Tente novamente.")
                        } finally {
                            setSalvando(false)
                        }
                    }}
                />
                <Button texto="Cancelar" variante="contorno" cor="borda" onPress={() => setEditarVisivel(false)} disabled={salvando} />
            </BottomSheet>

            <PopupStatus
                visivel={popup.visivel}
                tipo={popup.tipo}
                titulo={popup.titulo}
                mensagem={popup.mensagem}
                textoConfirmar="Excluir"
                textoCarregando="Excluindo..."
                onConfirmar={excluir}
                carregando={excluindo}
                onFechar={() => setPopup((p) => ({ ...p, visivel: false }))}
            />
        </AppLayout>
    )
}

function formatarMoeda(valor?: number) {
    return valor === undefined ? "R$ —" : valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatarData(data?: string | null) {
    if (!data) return "—"
    const somenteData = data.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (somenteData) return `${somenteData[3]}/${somenteData[2]}`
    const valor = new Date(data)
    return Number.isNaN(valor.getTime()) ? data : valor.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

function Metrica({ rotulo, valor }: { rotulo: string; valor: string }) {
    return <View style={style.metrica}><Text style={style.rotulo}>{rotulo}</Text><Text style={style.valor}>{valor}</Text></View>
}

function Pedido({ pedido }: { pedido: PedidoCliente }) {
    return (
        <View style={style.pedido}>
            <View>
                <Text style={style.pedidoId}>{pedido.id}</Text>
                <Text style={style.pedidoData}>{pedido.data}</Text>
            </View>
            <Text style={style.pedidoValor}>{formatarMoeda(pedido.valor)}</Text>
            <Text style={[style.pedidoStatus, pedido.status === "Pendente" && style.pedidoPendente]}>{pedido.status}</Text>
        </View>
    )
}