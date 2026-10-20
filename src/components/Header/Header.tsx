import React from "react"
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

import { style } from "./style"
import { themes } from "../../global/themes"

import Logo from "../../assets/images/logo.png"

import Filtro from "../../components/Filtro"

type BuscaProps = {
    busca: string
    onChangeBusca: (texto: string) => void
    placeholder?: string
}

export type HeaderProps =

    | { tipo: "boasVindas" }

    | { tipo: "titulo"; titulo: string; descricao?: string }

    | ({
        tipo: "inicio"
        nome?: string
        negocio?: string
    } & BuscaProps)
    | ({
        tipo: "buscaVoltar"
        titulo: string
        onVoltar?: () => void
    } & BuscaProps)

    | ({
        tipo: "catalogo"
        titulo: string
        categorias: string[]
        categoriaAtiva: string
        onChangeCategoria: (categoria: string) => void
    } & BuscaProps)

    | { tipo: "detalhe"; titulo: string; onVoltar?: () => void; semVoltar?: boolean }

function saudacao() {
    const hora = new Date().getHours()
    if (hora < 12) return "Bom dia"
    if (hora < 18) return "Boa tarde"
    return "Boa noite"
}

function Busca({ busca, onChangeBusca, placeholder = "Buscar produto..." }: BuscaProps) {
    return (
        <View style={style.busca}>
            <Ionicons name="search-outline" size={20} color={themes.colors["marrom-suave"]} />
            <TextInput
                style={style.campoBusca}
                placeholder={placeholder}
                placeholderTextColor={themes.colors["texto-secundario"]}
                value={busca}
                onChangeText={onChangeBusca}
                returnKeyType="search"
            />
        </View>
    )
}

function BotaoVoltar({ onVoltar }: { onVoltar?: () => void }) {
    const navigation = useNavigation()

    return (
        <Pressable
            onPress={onVoltar ?? (() => navigation.goBack())}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={({ pressed }) => [style.voltar, pressed && style.voltarPressionado]}
        >
            <Ionicons name="arrow-back" size={22} color={themes.colors["azul-escuro"]} />
        </Pressable>
    )
}

function Topo({ titulo, voltar, onVoltar }: { titulo: string; voltar?: boolean; onVoltar?: () => void }) {
    return (
        <View style={style.topoBarra}>
            {voltar && <BotaoVoltar onVoltar={onVoltar} />}

            <Text style={style.tituloBarra} numberOfLines={1}>
                {titulo}
            </Text>
        </View>
    )
}

function HeaderLogo({
    rotulo,
    titulo,
    descricao,
}: {
    rotulo?: string
    titulo: string
    descricao?: string
}) {
    return (
        <View style={style.containerLogo}>
            <Image source={Logo} style={style.logo} resizeMode="contain" />

            <View style={style.textos}>
                {!!rotulo && (
                    <Text
                        style={[
                            themes.typography.rotulo,
                            { color: themes.colors["texto-secundario"] },
                        ]}
                    >
                        {rotulo}
                    </Text>
                )}

                <Text style={[themes.typography.titulo1, style.nome]}>{titulo}</Text>

                {!!descricao && <Text style={style.descricao}>{descricao}</Text>}
            </View>
        </View>
    )
}

function HeaderInicio({
    nome,
    negocio,
    ...busca
}: Extract<HeaderProps, { tipo: "inicio" }>) {
    return (
        <View style={style.containerInicio}>
            <View style={style.topoInicio}>
                <View style={style.textosInicio}>
                    {!!negocio && <Text style={style.negocio}>{negocio}</Text>}

                    <Text style={style.saudacao} numberOfLines={1}>
                        {nome ? `${saudacao()}, ${nome}` : saudacao()}
                    </Text>
                </View>

                <View style={style.avatar}>
                    <Text style={style.inicial}>{nome ? nome.charAt(0).toUpperCase() : ""}</Text>
                </View>
            </View>

            <Busca
                busca={busca.busca}
                onChangeBusca={busca.onChangeBusca}
                placeholder={busca.placeholder ?? "Buscar pedidos, clientes ou produtos"}
            />
        </View>
    )
}

function HeaderBuscaVoltar({ titulo, onVoltar, ...busca }: Extract<HeaderProps, { tipo: "buscaVoltar" }>) {
    return (
        <View style={style.containerBarra}>
            <Topo titulo={titulo} voltar onVoltar={onVoltar} />
            <Busca {...busca} />
        </View>
    )
}

function HeaderCatalogo({
    titulo,
    categorias,
    categoriaAtiva,
    onChangeCategoria,
    ...busca
}: Extract<HeaderProps, { tipo: "catalogo" }>) {
    return (
        <>
            <View style={style.containerBarra}>
                <Topo titulo={titulo} />
                <Busca {...busca} />
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={style.categorias}
                style={style.categoriasScroll}
            >
                {categorias.map((cat) => (
                    <Filtro
                        key={cat}
                        texto={cat}
                        ativo={cat === categoriaAtiva}
                        onPress={() => onChangeCategoria(cat)}
                    />
                ))}
            </ScrollView>
        </>
    )
}

function HeaderDetalhe({ titulo, onVoltar, semVoltar }: Extract<HeaderProps, { tipo: "detalhe" }>) {
    return (
        <View style={style.containerBarra}>
            <Topo titulo={titulo} voltar={!semVoltar} onVoltar={onVoltar} />
        </View>
    )
}

export default function Header(props: HeaderProps) {
    switch (props.tipo) {
        case "boasVindas":
            return <HeaderLogo rotulo="Bem-Vindo ao" titulo="Conecta." />

        case "titulo":
            return <HeaderLogo titulo={props.titulo} descricao={props.descricao} />

        case "inicio":
            return <HeaderInicio {...props} />

        case "buscaVoltar":
            return <HeaderBuscaVoltar {...props} />

        case "catalogo":
            return <HeaderCatalogo {...props} />

        case "detalhe":
            return <HeaderDetalhe {...props} />
    }
}