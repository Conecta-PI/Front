import React, { useEffect, useState } from "react"
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native"
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { style } from "./style"
import { useRolarParaCampo } from "../../hooks/useRolarParaCampo"
import { textoParaNumero } from "../../utils/numeros"
import { cadastrarProduto, listarCategoriasProduto } from "../../services/produtos"
import type { Ingrediente, OpcaoCategoria } from "../../types/produto"

import AppLayout from "../../components/AppLayout/AppLayout"
import Button from "../../components/Button/Button"
import CampoFoto from "../../components/CampoFoto/"
import CampoRolavel from "../../components/CampoRolavel/"
import Dropdown from "../../components/Dropdown/"
import IngredienteItem from "../../components/IngredienteItem/"
import FormIngrediente from "../../components/FormIngrediente/"
import BottomSheet from "../../components/BottomSheet/"
import Interruptor from "../../components/Interruptor/"
import PopupStatus, { TipoPopup } from "../../components/PopupStatus/"

type Erros = { nome?: string; categoria?: string; preco?: string }

type EstadoPopup = {
    visivel: boolean
    tipo: TipoPopup
    titulo: string
    mensagem: string
}

export default function NovoProduto() {
    const navigation = useNavigation<NavigationProp<ParamListBase>>()
    const insets = useSafeAreaInsets()
    const { scrollRef, areaRef, onScroll, rolarPara } = useRolarParaCampo()

    const [nome, setNome] = useState("")
    const [categoria, setCategoria] = useState<string | null>(null)
    const [foto, setFoto] = useState<string | null>(null)
    const [preco, setPreco] = useState("")
    const [descricao, setDescricao] = useState("")
    const [preparo, setPreparo] = useState("")
    const [rendimento, setRendimento] = useState("")
    const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
    const [ativo, setAtivo] = useState(true)

    const [categorias, setCategorias] = useState<OpcaoCategoria[]>([])
    const [erros, setErros] = useState<Erros>({})
    const [sheetIngrediente, setSheetIngrediente] = useState(false)
    const [enviando, setEnviando] = useState(false)
    const [popup, setPopup] = useState<EstadoPopup>({
        visivel: false,
        tipo: "sucesso",
        titulo: "",
        mensagem: "",
    })

    useEffect(() => {
        let cancelado = false

        listarCategoriasProduto().then((lista) => {
            if (cancelado) return
            setCategorias(lista)
            setCategoria((atual) => atual ?? lista[0]?.valor ?? null)
        })

        return () => {
            cancelado = true
        }
    }, [])

    function limparErro(campo: keyof Erros) {
        setErros((e) => ({ ...e, [campo]: undefined }))
    }

    function validar() {
        const novos: Erros = {}

        if (!nome.trim()) novos.nome = "Informe o nome do produto"
        if (!categoria) novos.categoria = "Escolha uma categoria"
        if (textoParaNumero(preco) <= 0) novos.preco = "Informe o preço de venda"

        setErros(novos)
        return Object.keys(novos).length === 0
    }

    async function cadastrar() {
        if (enviando || !validar()) return

        setEnviando(true)

        try {
            const resposta = await cadastrarProduto({
                nome: nome.trim(),
                categoria: categoria!,
                foto,
                preco: textoParaNumero(preco),
                descricao: descricao.trim(),
                preparo: preparo.trim(),
                rendimento: rendimento.trim(),
                ingredientes: ingredientes.map(({ nome, quantidade, unidade }) => ({
                    nome,
                    quantidade,
                    unidade,
                })),
                ativo,
            })

            setPopup(
                resposta.sucesso
                    ? {
                          visivel: true,
                          tipo: "sucesso",
                          titulo: "Produto cadastrado!",
                          mensagem: resposta.mensagem,
                      }
                    : {
                          visivel: true,
                          tipo: "erro",
                          titulo: "Não foi possível cadastrar",
                          mensagem: resposta.mensagem,
                      }
            )
        } catch {
            setPopup({
                visivel: true,
                tipo: "erro",
                titulo: "Não foi possível cadastrar",
                mensagem: "Ocorreu um erro inesperado. Tente novamente.",
            })
        } finally {
            setEnviando(false)
        }
    }

    function fecharPopup() {
        setPopup((p) => ({ ...p, visivel: false }))

        if (popup.tipo === "sucesso") {
            navigation.navigate("Main", { screen: "Inicio" })
        }
    }

    function adicionarIngrediente(ing: Omit<Ingrediente, "id">) {
        setIngredientes((lista) => [...lista, { id: String(Date.now()), ...ing }])
        setSheetIngrediente(false)
    }

    function removerIngrediente(id: string) {
        setIngredientes((lista) => lista.filter((i) => i.id !== id))
    }

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Novo produto" }}>
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
                        <CampoRolavel
                            tipo="texto"
                            label="Nome do produto"
                            placeholder="Ex.: Bolo de Pote Chocolate"
                            autoCapitalize="sentences"
                            value={nome}
                            onChangeText={(t) => {
                                setNome(t)
                                limparErro("nome")
                            }}
                            erro={erros.nome}
                            aoFocar={rolarPara}
                        />

                        <View style={style.bloco}>
                            <Text style={style.rotulo}>Categoria</Text>

                            <Dropdown
                                placeholder="Selecione a categoria"
                                opcoes={categorias}
                                valor={categoria}
                                onChange={(v) => {
                                    setCategoria(v)
                                    limparErro("categoria")
                                }}
                            />

                            {!!erros.categoria && <Text style={style.erro}>{erros.categoria}</Text>}
                        </View>

                        <CampoFoto label="Foto do produto" uri={foto} onChange={setFoto} />

                        <CampoRolavel
                            tipo="moeda"
                            label="Preço de venda (R$)"
                            placeholder="0,00"
                            value={preco}
                            onChangeText={(t) => {
                                setPreco(t)
                                limparErro("preco")
                            }}
                            erro={erros.preco}
                            aoFocar={rolarPara}
                        />

                        <CampoRolavel
                            tipo="texto"
                            label="Descrição curta"
                            placeholder="Conte o que torna o produto especial"
                            autoCapitalize="sentences"
                            value={descricao}
                            onChangeText={setDescricao}
                            aoFocar={rolarPara}
                        />

                        <View style={style.linha}>
                            <View style={style.metade}>
                                <CampoRolavel
                                    tipo="texto"
                                    label="Preparo"
                                    placeholder="Ex.: 45 min"
                                    autoCapitalize="sentences"
                                    value={preparo}
                                    onChangeText={setPreparo}
                                    aoFocar={rolarPara}
                                />
                            </View>

                            <View style={style.metade}>
                                <CampoRolavel
                                    tipo="texto"
                                    label="Rendimento"
                                    placeholder="Ex.: 10 un"
                                    autoCapitalize="sentences"
                                    value={rendimento}
                                    onChangeText={setRendimento}
                                    aoFocar={rolarPara}
                                />
                            </View>
                        </View>

                        <View style={style.bloco}>
                            <Text style={style.rotulo}>Ingredientes utilizados</Text>

                            {ingredientes.map((ing) => (
                                <IngredienteItem
                                    key={ing.id}
                                    nome={ing.nome}
                                    quantidade={ing.quantidade}
                                    unidade={ing.unidade}
                                    onRemover={() => removerIngrediente(ing.id)}
                                />
                            ))}

                            <Button
                                texto="Adicionar ingrediente"
                                icone="add"
                                variante="contorno"
                                onPress={() => setSheetIngrediente(true)}
                            />
                        </View>

                        <Interruptor
                            titulo="Produto ativo no cardápio"
                            descricao="Visível para os clientes"
                            valor={ativo}
                            onChange={setAtivo}
                        />
                    </ScrollView>
                </View>

                <View style={[style.rodape, { paddingBottom: 16 + insets.bottom }]}>
                    <Button
                        texto={enviando ? "Cadastrando..." : "Cadastrar produto"}
                        disabled={enviando}
                        onPress={cadastrar}
                    />
                </View>
            </KeyboardAvoidingView>

            <BottomSheet
                visivel={sheetIngrediente}
                onFechar={() => setSheetIngrediente(false)}
                titulo="Adicionar ingrediente"
                descricao="Informe o nome e a quantidade usada na receita."
            >
                <FormIngrediente
                    onAdicionar={adicionarIngrediente}
                    onCancelar={() => setSheetIngrediente(false)}
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