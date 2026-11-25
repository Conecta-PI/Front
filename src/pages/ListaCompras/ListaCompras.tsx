import React, { useCallback, useState } from "react"
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native"
import PopupStatus, { type TipoPopup } from "../../components/PopupStatus/"
import { useFocusEffect } from "@react-navigation/native"

import AppLayout from "../../components/AppLayout/AppLayout"
import BottomSheet from "../../components/BottomSheet/"
import Button from "../../components/Button/Button"
import Dropdown from "../../components/Dropdown/"
import Input from "../../components/Input/Input"
import { textoParaNumero } from "../../utils/numeros"
import {
    atualizarListaCompra,
    criarListaCompra,
    excluirListaCompra,
    listarListasCompras,
    type ListaCompra,
    type ListaCompraItem,
} from "../../services/listaCompras"

const OPCOES_STATUS = [
    { valor: "aberta", label: "Aberta" },
    { valor: "concluida", label: "Concluída" },
]

const OPCOES_PRIORIDADE = [
    { valor: "alta", label: "Alta" },
    { valor: "media", label: "Média" },
    { valor: "baixa", label: "Baixa" },
]

export default function ListaCompras() {
    const [dados, setDados] = useState<ListaCompra[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [popupVisivel, setPopupVisivel] = useState(false)
    const [popupTipo, setPopupTipo] = useState<TipoPopup>("erro")
    const [popupTitulo, setPopupTitulo] = useState("")
    const [popupMensagem, setPopupMensagem] = useState("")
    const [itemExclusao, setItemExclusao] = useState<ListaCompra | null>(null)
    const [excluindo, setExcluindo] = useState(false)
    const [sheetVisivel, setSheetVisivel] = useState(false)
    const [editandoId, setEditandoId] = useState<number | null>(null)
    const [titulo, setTitulo] = useState("")
    const [status, setStatus] = useState("aberta")
    const [prioridade, setPrioridade] = useState("media")
    const [itens, setItens] = useState<ListaCompraItem[]>([])
    const [nomeItem, setNomeItem] = useState("")
    const [quantidadeItem, setQuantidadeItem] = useState("")
    const [precoItem, setPrecoItem] = useState("")
    const [erroFormulario, setErroFormulario] = useState<string | null>(null)
    const [enviando, setEnviando] = useState(false)

    const carregar = useCallback(() => {
        setCarregando(true)
        setErro(null)
        listarListasCompras()
            .then(setDados)
            .catch((error: unknown) => setErro(error instanceof Error ? error.message : "Erro ao carregar listas de compras."))
            .finally(() => setCarregando(false))
    }, [])

    useFocusEffect(useCallback(() => {
        carregar()
    }, [carregar]))

    function limparFormulario() {
        setEditandoId(null)
        setTitulo("")
        setStatus("aberta")
        setPrioridade("media")
        setItens([])
        setNomeItem("")
        setQuantidadeItem("")
        setPrecoItem("")
        setErroFormulario(null)
    }

    function abrirNovo() {
        limparFormulario()
        setSheetVisivel(true)
    }

    function abrirEdicao(item: ListaCompra) {
        setEditandoId(item.id)
        setTitulo(item.titulo ?? "")
        setStatus(item.status ?? "aberta")
        setPrioridade(item.prioridade ?? "media")
        setItens(item.itens ?? [])
        setNomeItem("")
        setQuantidadeItem("")
        setPrecoItem("")
        setErroFormulario(null)
        setSheetVisivel(true)
    }

    function adicionarItem() {
        const quantidade = textoParaNumero(quantidadeItem)
        const precoUnitario = textoParaNumero(precoItem)

        if (!nomeItem.trim()) {
            setErroFormulario("Informe o nome do item")
            return
        }
        if (quantidade <= 0) {
            setErroFormulario("Informe uma quantidade maior que zero")
            return
        }
        if (precoUnitario <= 0) {
            setErroFormulario("Informe um preço maior que zero")
            return
        }

        setItens((atual) => [...atual, {
            nomeProduto: nomeItem.trim(),
            quantidade,
            precoUnitario,
            concluido: false,
        }])
        setNomeItem("")
        setQuantidadeItem("")
        setPrecoItem("")
        setErroFormulario(null)
    }

    async function salvar() {
        if (enviando) return

        if (!titulo.trim()) {
            setErroFormulario("Informe o título da lista")
            return
        }
        if (itens.length === 0) {
            setErroFormulario("Adicione pelo menos um item")
            return
        }

        setErroFormulario(null)
        setEnviando(true)

        try {
            const payload = {
                titulo: titulo.trim(),
                status,
                prioridade,
                itens,
            }

            if (editandoId !== null) {
                await atualizarListaCompra(editandoId, payload)
            } else {
                await criarListaCompra(payload)
            }

            setSheetVisivel(false)
            limparFormulario()
            carregar()
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível salvar a lista.")
        } finally {
            setEnviando(false)
        }
    }

    function confirmarExclusao(item: ListaCompra) {
        setItemExclusao(item)
        setPopupTipo("confirmacao")
        setPopupTitulo("Excluir lista")
        setPopupMensagem(`Deseja excluir "${item.titulo}"?`)
        setPopupVisivel(true)
    }

    async function executarExclusao() {
        if (!itemExclusao || excluindo) return

        setExcluindo(true)

        try {
            await excluirListaCompra(itemExclusao.id)

            setPopupVisivel(false)
            setItemExclusao(null)
            carregar()
        } catch (error) {
            setPopupTipo("erro")
            setPopupTitulo("Erro")
            setPopupMensagem(
                error instanceof Error
                    ? error.message
                    : "Não foi possível excluir a lista."
            )
        } finally {
            setExcluindo(false)
        }
    }
    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Lista de compras" }}>
            <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
                <Button texto="Nova lista" icone="add" onPress={abrirNovo} style={{ marginBottom: 12 }} />

                {carregando ? (
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size="large" color="#A7702A" />
                    </View>
                ) : erro ? (
                    <Text style={{ color: "#B42318", textAlign: "center" }}>{erro}</Text>
                ) : (
                    <FlatList
                        data={dados}
                        keyExtractor={(item) => String(item.id)}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 24 }}
                        ListEmptyComponent={<Text style={{ color: "#6B7280", textAlign: "center", marginTop: 24 }}>Nenhuma lista de compras encontrada.</Text>}
                        renderItem={({ item }) => (
                            <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12 }}>
                                <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.titulo}</Text>
                                <Text style={{ color: "#6B7280", marginTop: 6 }}>Status: {item.status}</Text>
                                <Text style={{ color: "#6B7280", marginTop: 2 }}>
                                    Total estimado: {Number(item.totalEstimado ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </Text>
                                <Text style={{ color: "#6B7280", marginTop: 2 }}>{item.itens?.length ?? 0} itens</Text>

                                <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                                    <Button texto="Editar" icone="create-outline" variante="contorno" style={{ flex: 1 }} onPress={() => abrirEdicao(item)} />
                                    <Button texto="Excluir" icone="trash-outline" variante="contorno" cor="erro" style={{ flex: 1 }} onPress={() => confirmarExclusao(item)} />
                                </View>
                            </View>
                        )}
                    />
                )}
            </View>

            <BottomSheet
                visivel={sheetVisivel}
                onFechar={() => {
                    if (!enviando) setSheetVisivel(false)
                }}
                titulo={editandoId !== null ? "Editar lista" : "Nova lista"}
                descricao="Monte os itens e defina o andamento da compra."
            >
                <Input tipo="texto" label="Título" placeholder="Ex.: Compra do mês" value={titulo} onChangeText={(valor) => { setTitulo(valor); setErroFormulario(null) }} />

                <Dropdown label="Status" placeholder="Selecione o status" opcoes={OPCOES_STATUS} valor={status} onChange={setStatus} />
                <Dropdown label="Prioridade" placeholder="Selecione a prioridade" opcoes={OPCOES_PRIORIDADE} valor={prioridade} onChange={setPrioridade} />

                <Text style={{ fontSize: 16, fontWeight: "700", color: "#2F2A26", marginTop: 8 }}>Itens da lista</Text>

                {itens.map((item, indice) => (
                    <View key={`${item.nomeProduto}-${indice}`} style={{ backgroundColor: "#F8F4EC", borderRadius: 12, padding: 12, marginTop: 8 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: "700", color: "#2F2A26" }}>{item.nomeProduto}</Text>
                                <Text style={{ color: "#6B7280", marginTop: 2 }}>
                                    {item.quantidade} × {Number(item.precoUnitario).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </Text>
                            </View>
                            <Pressable
                                onPress={() => setItens((atual) => atual.filter((_, posicao) => posicao !== indice))}
                                hitSlop={8}
                                accessibilityRole="button"
                                accessibilityLabel={`Remover ${item.nomeProduto}`}
                            >
                                <Text style={{ color: "#B42318", fontWeight: "700" }}>Remover</Text>
                            </Pressable>
                        </View>
                    </View>
                ))}

                <Input tipo="texto" label="Nome do item" placeholder="Ex.: Farinha de trigo" value={nomeItem} onChangeText={(valor) => setNomeItem(valor)} />
                <View style={{ flexDirection: "row", gap: 8 }}>
                    <View style={{ flex: 1 }}>
                        <Input tipo="decimal" label="Quantidade" placeholder="1" value={quantidadeItem} onChangeText={setQuantidadeItem} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Input tipo="moeda" label="Preço unitário" placeholder="0,00" value={precoItem} onChangeText={setPrecoItem} />
                    </View>
                </View>

                <Button texto="Adicionar item" icone="add" variante="contorno" onPress={adicionarItem} />

                {!!erroFormulario && <Text style={{ color: "#B42318", marginTop: 4 }}>{erroFormulario}</Text>}

                <Button
                    texto={enviando ? "Salvando..." : editandoId !== null ? "Salvar alterações" : "Criar lista"}
                    disabled={enviando}
                    onPress={salvar}
                />
            </BottomSheet>
            <PopupStatus
                visivel={popupVisivel}
                tipo={popupTipo}
                titulo={popupTitulo}
                mensagem={popupMensagem}
                textoConfirmar="Excluir"
                textoCarregando="Excluindo..."
                carregando={excluindo}
                onFechar={() => {
                    if (!excluindo) {
                        setPopupVisivel(false)
                        setItemExclusao(null)
                    }
                }}
                onConfirmar={executarExclusao}
            />
        </AppLayout>
    )
}
