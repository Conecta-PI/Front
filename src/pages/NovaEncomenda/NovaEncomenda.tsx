import React, { useCallback, useEffect, useMemo, useState } from "react"
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { style } from "./style"
import { themes } from "../../global/themes"
import { useRolarParaCampo } from "../../hooks/useRolarParaCampo"
import { criarEncomenda } from "../../services/encomendas"
import { listarProdutos } from "../../services/produtos"
import { dataBrParaIso, dataNoPassado, horaValida } from "../../utils/datas"
import { formatarMoeda } from "../../utils/formataMoeda"
import { textoParaNumero } from "../../utils/numeros"
import type { RootStackParamList } from "../../routes"
import type { TipoEntrega } from "../../types/encomenda"
import type { Produto } from "../../types/produto"

import AppLayout from "../../components/AppLayout/AppLayout"
import BottomSheet from "../../components/BottomSheet"
import Button from "../../components/Button/Button"
import CampoRolavel from "../../components/CampoRolavel/"
import ItemEncomenda from "../../components/ItemEncomenda/"
import PopupStatus, { type TipoPopup } from "../../components/PopupStatus/"
import Segmentado from "../../components/Segmentado/"

type ItemForm = {
    chave: string               // só identifica a linha na tela
    produtoId: string | null
    quantidade: number
}

type Erros = { itens?: string; data?: string; hora?: string; sinal?: string }

type EstadoPopup = {
    visivel: boolean
    tipo: TipoPopup
    titulo: string
    mensagem: string
}

const OPCOES_ENTREGA: { valor: TipoEntrega; label: string }[] = [
    { valor: "retirada", label: "Retirada no local" },
    { valor: "entrega", label: "Entrega" },
]

let contadorLinhas = 0
const novaLinha = (): ItemForm => ({ chave: String(++contadorLinhas), produtoId: null, quantidade: 0 })

export default function NovaEncomenda() {
    const { params } = useRoute<RouteProp<RootStackParamList, "NovaEncomenda">>()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const insets = useSafeAreaInsets()
    const { scrollRef, areaRef, onScroll, rolarPara } = useRolarParaCampo()

    const [produtos, setProdutos] = useState<Produto[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erroCarga, setErroCarga] = useState<string | null>(null)

    const [itens, setItens] = useState<ItemForm[]>(() => [novaLinha()])
    const [linhaEscolhendo, setLinhaEscolhendo] = useState<string | null>(null)
    const [data, setData] = useState("")
    const [hora, setHora] = useState("")
    const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>("retirada")
    const [sinal, setSinal] = useState("")
    const [observacoes, setObservacoes] = useState("")

    const [erros, setErros] = useState<Erros>({})
    const [enviando, setEnviando] = useState(false)
    const [popup, setPopup] = useState<EstadoPopup>({
        visivel: false,
        tipo: "sucesso",
        titulo: "",
        mensagem: "",
    })

    const carregarProdutos = useCallback(() => {
        setCarregando(true)
        setErroCarga(null)

        listarProdutos()
            .then(setProdutos)
            .catch((error: unknown) =>
                setErroCarga(error instanceof Error ? error.message : "Erro ao carregar produtos.")
            )
            .finally(() => setCarregando(false))
    }, [])

    useEffect(() => {
        carregarProdutos()
    }, [carregarProdutos])

    const produtoPorId = useMemo(() => new Map(produtos.map((p) => [p.id, p])), [produtos])

    const total = useMemo(
        () =>
            itens.reduce((soma, item) => {
                const produto = item.produtoId ? produtoPorId.get(item.produtoId) : undefined
                return soma + (produto ? produto.preco * item.quantidade : 0)
            }, 0),
        [itens, produtoPorId]
    )

    const disponiveis = useMemo(() => {
        const usados = new Set(
            itens.filter((i) => i.chave !== linhaEscolhendo && i.produtoId).map((i) => i.produtoId)
        )
        return produtos.filter((p) => !usados.has(p.id))
    }, [itens, linhaEscolhendo, produtos])

    function limparErro(campo: keyof Erros) {
        setErros((e) => ({ ...e, [campo]: undefined }))
    }

    function escolherProduto(produtoId: string) {
        setItens((lista) =>
            lista.map((i) =>
                i.chave === linhaEscolhendo
                    ? { ...i, produtoId, quantidade: i.quantidade || 1 }
                    : i
            )
        )
        setLinhaEscolhendo(null)
        limparErro("itens")
    }

    function alterarQuantidade(chave: string, quantidade: number) {
        setItens((lista) => lista.map((i) => (i.chave === chave ? { ...i, quantidade } : i)))
        limparErro("itens")
    }

    function removerLinha(chave: string) {
        setItens((lista) => lista.filter((i) => i.chave !== chave))
    }


    function validar() {
        const novos: Erros = {}

        if (!itens.some((i) => i.produtoId && i.quantidade > 0)) {
            novos.itens = "Escolha ao menos um produto e a quantidade."
        }

        const iso = dataBrParaIso(data)
        if (!iso) novos.data = "Data inválida"
        else if (dataNoPassado(iso)) novos.data = "Data já passou"

        if (!horaValida(hora)) novos.hora = "Horário inválido"

        if (textoParaNumero(sinal) > total) novos.sinal = "Maior que o total"

        setErros(novos)
        return Object.keys(novos).length === 0
    }

    async function criar() {
        if (enviando || !validar()) return

        setEnviando(true)

        try {
            await criarEncomenda({
                clienteId: params.clienteId,
                itens: itens
                    .filter((i) => i.produtoId && i.quantidade > 0)
                    .map((i) => ({ produtoId: i.produtoId!, quantidade: i.quantidade })),
                dataEntrega: dataBrParaIso(data)!,
                horario: hora,
                tipoEntrega,
                sinalPago: textoParaNumero(sinal),
                observacoes: observacoes.trim(),
            })

            setPopup({
                visivel: true,
                tipo: "sucesso",
                titulo: "Encomenda criada!",
                mensagem: `Encomenda de ${params.clienteNome} agendada para ${data} às ${hora}.`,
            })
        } catch (error) {
            setPopup({
                visivel: true,
                tipo: "erro",
                titulo: "Não foi possível criar a encomenda",
                mensagem: error instanceof Error ? error.message : "Tente novamente.",
            })
        } finally {
            setEnviando(false)
        }
    }

    function fecharPopup() {
        setPopup((p) => ({ ...p, visivel: false }))

        if (popup.tipo === "sucesso") navigation.goBack()
    }

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Nova encomenda" }}>
            <KeyboardAvoidingView style={style.flex} behavior="padding">
                <View ref={areaRef} collapsable={false} style={style.flex}>
                    <ScrollView
                        ref={scrollRef}
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={style.conteudo}
                    >
                        {/* cliente fixo: a tela só abre a partir de um cliente */}
                        <View style={style.bloco}>
                            <Text style={style.rotulo}>Cliente</Text>

                            <View style={style.campoFixo}>
                                <Ionicons name="person-outline" size={18} color={themes.colors["marrom-suave"]} />
                                <Text style={style.campoFixoTexto} numberOfLines={1}>
                                    {params.clienteNome}
                                </Text>
                                <Ionicons name="lock-closed-outline" size={16} color={themes.colors["marrom-suave"]} />
                            </View>
                        </View>

                        {/* produtos */}
                        <View style={style.bloco}>
                            <Text style={style.rotulo}>Produtos</Text>

                            {erroCarga ? (
                                <View style={style.estado}>
                                    <Text style={style.mensagem}>{erroCarga}</Text>
                                    <Button texto="Tentar novamente" onPress={carregarProdutos} />
                                </View>
                            ) : (
                                <>
                                    {itens.map((item) => {
                                        const produto = item.produtoId
                                            ? produtoPorId.get(item.produtoId)
                                            : undefined

                                        return (
                                            <ItemEncomenda
                                                key={item.chave}
                                                nome={produto?.nome}
                                                preco={produto?.preco ?? 0}
                                                quantidade={item.quantidade}
                                                onEscolher={() => setLinhaEscolhendo(item.chave)}
                                                onChangeQuantidade={(q) => alterarQuantidade(item.chave, q)}
                                                onRemover={
                                                    itens.length > 1
                                                        ? () => removerLinha(item.chave)
                                                        : undefined
                                                }
                                            />
                                        )
                                    })}

                                    {!!erros.itens && <Text style={style.erro}>{erros.itens}</Text>}

                                    {itens.length < produtos.length && (
                                        <Pressable
                                            onPress={() => setItens((l) => [...l, novaLinha()])}
                                            accessibilityRole="button"
                                            style={style.adicionar}
                                        >
                                            <Text style={style.adicionarTexto}>+ Adicionar produto</Text>
                                        </Pressable>
                                    )}
                                </>
                            )}
                        </View>

                        {/* data e horário */}
                        <View style={style.linha}>
                            <View style={style.metade}>
                                <CampoRolavel
                                    tipo="data"
                                    label="Data de entrega"
                                    placeholder="dd/mm/aaaa"
                                    icone="calendar-outline"
                                    value={data}
                                    onChangeText={(t) => {
                                        setData(t)
                                        limparErro("data")
                                    }}
                                    erro={erros.data}
                                    aoFocar={rolarPara}
                                />
                            </View>

                            <View style={style.metade}>
                                <CampoRolavel
                                    tipo="hora"
                                    label="Horário"
                                    placeholder="hh:mm"
                                    icone="time-outline"
                                    value={hora}
                                    onChangeText={(t) => {
                                        setHora(t)
                                        limparErro("hora")
                                    }}
                                    erro={erros.hora}
                                    aoFocar={rolarPara}
                                />
                            </View>
                        </View>

                        {/* tipo de entrega */}
                        <View style={style.bloco}>
                            <Text style={style.rotulo}>Tipo de entrega</Text>
                            <Segmentado opcoes={OPCOES_ENTREGA} valor={tipoEntrega} onChange={setTipoEntrega} />
                        </View>

                        {/* sinal e total */}
                        <View style={style.linha}>
                            <View style={style.metade}>
                                <CampoRolavel
                                    tipo="moeda"
                                    label="Sinal pago (R$)"
                                    placeholder="0,00"
                                    value={sinal}
                                    onChangeText={(t) => {
                                        setSinal(t)
                                        limparErro("sinal")
                                    }}
                                    erro={erros.sinal}
                                    aoFocar={rolarPara}
                                />
                            </View>

                            <View style={[style.metade, style.total]}>
                                <Text style={style.totalRotulo}>Valor total</Text>
                                <Text style={style.totalValor} numberOfLines={1} adjustsFontSizeToFit>
                                    {formatarMoeda(total)}
                                </Text>
                            </View>
                        </View>

                        <CampoRolavel
                            tipo="texto"
                            label="Observações"
                            placeholder="Adicione observações (opcional)"
                            autoCapitalize="sentences"
                            multiline
                            maxLength={300}
                            value={observacoes}
                            onChangeText={setObservacoes}
                            aoFocar={rolarPara}
                        />
                    </ScrollView>
                </View>

                <View style={[style.rodape, { paddingBottom: 16 + insets.bottom }]}>
                    <Button
                        texto={enviando ? "Criando..." : "Criar encomenda"}
                        disabled={enviando || carregando || !!erroCarga}
                        onPress={criar}
                    />
                </View>
            </KeyboardAvoidingView>

            <BottomSheet
                visivel={linhaEscolhendo !== null}
                onFechar={() => setLinhaEscolhendo(null)}
                titulo="Selecionar produto"
                descricao="Escolha o produto desta encomenda."
            >
                {disponiveis.length === 0 ? (
                    <Text style={style.mensagem}>Nenhum produto disponível.</Text>
                ) : (
                    disponiveis.map((produto) => (
                        <Pressable
                            key={produto.id}
                            onPress={() => escolherProduto(produto.id)}
                            accessibilityRole="button"
                            style={({ pressed }) => [style.opcaoProduto, pressed && style.opcaoPressionada]}
                        >
                            <Text style={style.opcaoNome} numberOfLines={1}>{produto.nome}</Text>
                            <Text style={style.opcaoPreco}>{formatarMoeda(produto.preco)}</Text>
                        </Pressable>
                    ))
                )}

                <Button
                    texto="Cancelar"
                    variante="contorno"
                    cor="borda"
                    onPress={() => setLinhaEscolhendo(null)}
                />
            </BottomSheet>

            <PopupStatus
                visivel={popup.visivel}
                tipo={popup.tipo}
                titulo={popup.titulo}
                mensagem={popup.mensagem}
                onFechar={fecharPopup}
            />
        </AppLayout>
    )
}