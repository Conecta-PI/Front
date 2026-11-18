
import React, { useCallback, useMemo, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Keyboard,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { style } from "./style"
import { themes } from "../../global/themes"
import AppLayout from "../../components/AppLayout/AppLayout"
import Button from "../../components/Button/Button"
import Input from "../../components/Input/Input"
import BottomSheet from "../../components/BottomSheet"
import PopupStatus, { type TipoPopup } from "../../components/PopupStatus/"
import type { Cliente } from "../../types/cliente"
import type { RootStackParamList } from "../../routes"
import {
    criarCliente,
    listarClientes,
    listarClientesInativos,
    reativarCliente,
} from "../../services/clientes"

type Filtro = "todos" | "frequentes" | "pendencia" | "inativos"

function iniciais(nome: string) {
    return nome
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join("")
        .toUpperCase()
}

function formatarMoeda(valor?: number) {
    if (valor === undefined) return "R$ —"
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })
}

function formatarData(data?: string | null) {
    if (!data) return "Último: —"

    const somenteData = data.match(/^(\d{4})-(\d{2})-(\d{2})$/)

    if (somenteData) {
        return `Último: ${somenteData[3]}/${somenteData[2]}`
    }

    const dataFormatada = new Date(data)

    if (Number.isNaN(dataFormatada.getTime())) {
        return `Último: ${data}`
    }

    return `Último: ${dataFormatada.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
    })}`
}

export default function Clientes() {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const [clientes, setClientes] = useState<Cliente[]>([])
    const [clientesInativos, setClientesInativos] = useState<Cliente[]>([])
    const [busca, setBusca] = useState("")
    const [filtro, setFiltro] = useState<Filtro>("todos")
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [reativando, setReativando] = useState<string | null>(null)

    const [novoVisivel, setNovoVisivel] = useState(false)
    const [nome, setNome] = useState("")
    const [telefone, setTelefone] = useState("")
    const [email, setEmail] = useState("")
    const [salvando, setSalvando] = useState(false)
    const [alturaTeclado, setAlturaTeclado] = useState(0)

    // Estado do popup de sucesso e erro
    const [popup, setPopup] = useState({
        visivel: false,
        titulo: "",
        mensagem: "",
        tipo: "sucesso" as TipoPopup,
    })

    React.useEffect(() => {
        const mostrar = Keyboard.addListener("keyboardDidShow", (evento) => {
            setAlturaTeclado(evento.endCoordinates.height)
        })

        const esconder = Keyboard.addListener("keyboardDidHide", () => {
            setAlturaTeclado(0)
        })

        return () => {
            mostrar.remove()
            esconder.remove()
        }
    }, [])

    // Carrega as duas listas
    const carregar = useCallback(async () => {
        setCarregando(true)

        try {
            const [ativos, inativos] = await Promise.all([
                listarClientes(),
                listarClientesInativos(),
            ])

            setClientes(ativos)
            setClientesInativos(inativos)
            setErro(null)
        } catch (error: unknown) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro ao carregar clientes."
            )
        } finally {
            setCarregando(false)
        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            carregar()
        }, [carregar])
    )

    // Escolhe qual lista será exibida
    const listaAtual = filtro === "inativos"
        ? clientesInativos
        : clientes

    const clientesFiltrados = useMemo(() => {
        const termo = busca.trim().toLocaleLowerCase()

        return listaAtual.filter((cliente) => {
            const correspondeBusca =
                !termo ||
                cliente.nome.toLocaleLowerCase().includes(termo) ||
                (cliente.email ?? "").toLocaleLowerCase().includes(termo)

            const correspondeFiltro =
                filtro === "todos" ||
                filtro === "inativos" ||
                (filtro === "frequentes" &&
                    (cliente.quantidadePedidos ?? 0) >= 5) ||
                (filtro === "pendencia" &&
                    cliente.temPendencia === true)

            return correspondeBusca && correspondeFiltro
        })
    }, [busca, listaAtual, filtro])

    // Reativa o cliente usando o popup personalizado
    const handleReativar = async (id: string, nomeCliente: string) => {
        if (reativando) return

        setReativando(id)

        try {
            await reativarCliente(id)
            await carregar()

            setFiltro("todos")

            setPopup({
                visivel: true,
                tipo: "sucesso",
                titulo: "Cliente reativado!",
                mensagem: `${nomeCliente} voltou para a lista de clientes ativos.`,
            })
        } catch (error) {
            setPopup({
                visivel: true,
                tipo: "erro",
                titulo: "Erro ao reativar",
                mensagem:
                    error instanceof Error
                        ? error.message
                        : "Não foi possível reativar o cliente.",
            })
        } finally {
            setReativando(null)
        }
    }

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Clientes" }}>
            <View style={style.conteudo}>
                <View style={style.busca}>
                    <Ionicons
                        name="search-outline"
                        size={18}
                        color={themes.colors["marrom-suave"]}
                    />

                    <TextInput
                        value={busca}
                        onChangeText={setBusca}
                        placeholder="Buscar cliente..."
                        placeholderTextColor={
                            themes.colors["texto-secundario"]
                        }
                        style={style.campoBusca}
                        returnKeyType="search"
                    />
                </View>

                {/* Filtros com rolagem horizontal */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexGrow: 0 }}
                    contentContainerStyle={style.filtros}
                >
                    <FiltroCliente
                        texto="Todos"
                        ativo={filtro === "todos"}
                        onPress={() => setFiltro("todos")}
                    />

                    <FiltroCliente
                        texto="Frequentes"
                        ativo={filtro === "frequentes"}
                        onPress={() => setFiltro("frequentes")}
                    />

                    <FiltroCliente
                        texto="Com pendência"
                        ativo={filtro === "pendencia"}
                        onPress={() => setFiltro("pendencia")}
                    />

                    <FiltroCliente
                        texto="Inativos"
                        ativo={filtro === "inativos"}
                        onPress={() => setFiltro("inativos")}
                    />
                </ScrollView>

                {carregando ? (
                    <View style={style.estado}>
                        <ActivityIndicator
                            color={themes.colors["dourado"]}
                        />
                    </View>
                ) : erro ? (
                    <View style={style.estado}>
                        <Text style={style.mensagem}>{erro}</Text>
                        <Button
                            texto="Tentar novamente"
                            onPress={carregar}
                        />
                    </View>
                ) : (
                    <FlatList
                        data={clientesFiltrados}
                        keyExtractor={(cliente) => cliente.id}
                        contentContainerStyle={style.lista}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <View style={style.card}>
                                <Pressable
                                    style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 8,
                                    }}
                                    onPress={() =>
                                        navigation.navigate(
                                            "DetalheCliente",
                                            { id: item.id }
                                        )
                                    }
                                    accessibilityRole="button"
                                    accessibilityLabel={`Abrir cliente ${item.nome}`}
                                >
                                    <View style={style.avatar}>
                                        <Text style={style.avatarTexto}>
                                            {iniciais(item.nome)}
                                        </Text>
                                    </View>

                                    <View style={style.dados}>
                                        <Text
                                            style={style.nome}
                                            numberOfLines={1}
                                        >
                                            {item.nome}
                                        </Text>

                                        <Text
                                            style={style.resumo}
                                            numberOfLines={1}
                                        >
                                            Total: {formatarMoeda(item.totalGasto)}
                                            {" · "}
                                            {item.quantidadePedidos ?? "—"} pedidos
                                        </Text>
                                    </View>

                                    <View style={style.ultimoPedido}>
                                        {item.temPendencia && (
                                            <View
                                                style={style.indicadorPendencia}
                                            />
                                        )}

                                        <Text style={style.dataPedido}>
                                            {formatarData(item.ultimoPedido)}
                                        </Text>
                                    </View>
                                </Pressable>

                                {filtro === "inativos" && (
                                    <Pressable
                                        disabled={reativando !== null}
                                        onPress={() =>
                                            handleReativar(item.id, item.nome)
                                        }
                                        accessibilityRole="button"
                                        accessibilityLabel={`Reativar ${item.nome}`}
                                        style={{
                                            backgroundColor:
                                                themes.colors["dourado"],
                                            paddingVertical: 8,
                                            paddingHorizontal: 10,
                                            borderRadius: 10,
                                            opacity:
                                                reativando !== null ? 0.6 : 1,
                                        }}
                                    >
                                        {reativando === item.id ? (
                                            <ActivityIndicator
                                                size="small"
                                                color={themes.colors["branco"]}
                                            />
                                        ) : (
                                            <Text
                                                style={{
                                                    ...themes.typography.nav,
                                                    color: themes.colors["branco"],
                                                    fontFamily:
                                                        "Poppins_600SemiBold",
                                                }}
                                            >
                                                Reativar
                                            </Text>
                                        )}
                                    </Pressable>
                                )}
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text style={style.mensagem}>
                                {filtro === "inativos"
                                    ? "Nenhum cliente inativo encontrado."
                                    : "Nenhum cliente encontrado."}
                            </Text>
                        }
                    />
                )}

                <Button
                    texto="Novo cliente"
                    icone="add"
                    formato="arredondado"
                    style={[
                        style.novoCliente,
                        { bottom: alturaTeclado + 16 },
                    ]}
                    onPress={() => setNovoVisivel(true)}
                />
            </View>

            <BottomSheet
                visivel={novoVisivel}
                onFechar={() => !salvando && setNovoVisivel(false)}
                titulo="Novo cliente"
                descricao="Preencha os dados para cadastrar um cliente."
            >
                <Input
                    tipo="texto"
                    label="Nome"
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Nome completo"
                />

                <Input
                    tipo="telefone"
                    label="Telefone"
                    value={telefone}
                    onChangeText={setTelefone}
                    placeholder="(00) 00000-0000"
                />

                <Input
                    tipo="email"
                    label="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="cliente@exemplo.com"
                />

                <Button
                    texto={salvando ? "Salvando..." : "Salvar cliente"}
                    disabled={
                        salvando ||
                        !nome.trim() ||
                        !telefone.trim() ||
                        !email.trim()
                    }
                    onPress={async () => {
                        setSalvando(true)

                        try {
                            await criarCliente({
                                nome: nome.trim(),
                                telefone: telefone.trim(),
                                email: email.trim(),
                            })

                            setNome("")
                            setTelefone("")
                            setEmail("")
                            setNovoVisivel(false)

                            await carregar()
                        } catch (error) {
                            Alert.alert(
                                "Não foi possível salvar",
                                error instanceof Error
                                    ? error.message
                                    : "Tente novamente."
                            )
                        } finally {
                            setSalvando(false)
                        }
                    }}
                />

                <Button
                    texto="Cancelar"
                    cor="branco"
                    corTexto="texto"
                    onPress={() => setNovoVisivel(false)}
                    disabled={salvando}
                />
            </BottomSheet>

            {/* Popup personalizado de reativação */}
            <PopupStatus
                visivel={popup.visivel}
                tipo={popup.tipo}
                titulo={popup.titulo}
                mensagem={popup.mensagem}
                textoBotao="OK"
                onFechar={() =>
                    setPopup((atual) => ({
                        ...atual,
                        visivel: false,
                    }))
                }
            />
        </AppLayout>
    )
}

function FiltroCliente({
    texto,
    ativo,
    onPress,
}: {
    texto: string
    ativo: boolean
    onPress: () => void
}) {
    return (
        <Pressable
            onPress={() => {
                Keyboard.dismiss()
                onPress()
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: ativo }}
            style={[style.filtro, ativo && style.filtroAtivo]}
        >
            <Text
                style={[
                    style.filtroTexto,
                    ativo && style.filtroTextoAtivo,
                ]}
            >
                {texto}
            </Text>
        </Pressable>
    )
}
