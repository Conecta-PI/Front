import React, { useEffect, useState } from "react"
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, View } from "react-native"
import { useRoute, RouteProp } from "@react-navigation/native"

import { style } from "./detalheStyle"
import { themes } from "../../global/themes"
import AppLayout from "../../components/AppLayout/AppLayout"
import type { Cliente } from "../../types/cliente"
import type { RootStackParamList } from "../../routes"
import { buscarCliente } from "../../services/clientes"
import { atualizarCliente } from "../../services/clientes"
import Input from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import BottomSheet from "../../components/BottomSheet"
import { obterClienteMock, PedidoCliente } from "../../services/clientesMocks"

export default function DetalheCliente() {
    const { params } = useRoute<RouteProp<RootStackParamList, "DetalheCliente">>()
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

    useEffect(() => {
        let ativo = true
        const clienteMock = obterClienteMock(params.id)
        if (clienteMock) {
            setCliente(clienteMock)
            setPedidos(clienteMock.pedidos)
            setNome(clienteMock.nome)
            setTelefone(clienteMock.telefone)
            setEmail(clienteMock.email)
            setObservacao(clienteMock.observacao ?? "")
            setCarregando(false)
            return () => { ativo = false }
        }

        buscarCliente(params.id)
            .then((dados) => {
                if (ativo && dados) {
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

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Detalhe do cliente" }}>
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
                            setCliente(atualizado)
                            setEditarVisivel(false)
                        } catch (error) {
                            Alert.alert("Não foi possível salvar", error instanceof Error ? error.message : "Tente novamente.")
                        } finally {
                            setSalvando(false)
                        }
                    }}
                />
                <Button texto="Cancelar" cor="branco" corTexto="texto" onPress={() => setEditarVisivel(false)} disabled={salvando} />
            </BottomSheet>
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
