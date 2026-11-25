
import React from "react"
import { Modal, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { style } from "./style"
import { themes } from "../../global/themes"
import Button from "../Button/Button"
import FundoDesfocado from "../FundoDesfocado/"

export type TipoPopup = "sucesso" | "erro" | "confirmacao"

type IconName = React.ComponentProps<typeof Ionicons>["name"]
type CorTema = keyof typeof themes.colors

const CONFIG: Record<
    TipoPopup,
    { icone: IconName; cor: string; fundo: string; botao: string; solido: boolean }
> = {
    sucesso: {
        icone: "checkmark",
        cor: themes.colors["sucesso"],
        fundo: themes.colors["fundo-de-sucesso"],
        botao: "Continuar",
        solido: true,
    },
    erro: {
        icone: "close",
        cor: themes.colors["erro"],
        fundo: themes.colors["fundo-de-erro"],
        botao: "Fechar",
        solido: true,
    },
    confirmacao: {
        icone: "trash-outline",
        cor: themes.colors["erro"],
        fundo: themes.colors["fundo-de-erro"],
        botao: "Excluir",
        solido: false,
    },
}

type PopupStatusProps = {
    visivel: boolean
    tipo: TipoPopup
    titulo: string
    mensagem?: string
    textoBotao?: string
    onFechar: () => void
    textoConfirmar?: string
    textoCarregando?: string
    onConfirmar?: () => void
    carregando?: boolean
    iconeConfirmar?: IconName
    corConfirmar?: CorTema
    fundoConfirmar?: string
}

export default function PopupStatus({
    visivel,
    tipo,
    titulo,
    mensagem,
    textoBotao,
    onFechar,
    textoConfirmar,
    textoCarregando = "Aguarde...",
    onConfirmar,
    carregando = false,
    iconeConfirmar,
    corConfirmar,
    fundoConfirmar,
}: PopupStatusProps) {
    const config = CONFIG[tipo]
    console.log("[TESTE POPUPSTATUS]", { visivel, tipo, titulo })

    return (
        <Modal
            transparent
            visible={visivel}
            animationType="fade"
            statusBarTranslucent
            navigationBarTranslucent
            onRequestClose={() => {
                if (!carregando) onFechar()
            }}
        >
            <View style={style.raiz}>
                <FundoDesfocado />

                <View style={style.card}>
                    <View
                        style={[
                            style.anel,
                            {
                                backgroundColor: fundoConfirmar ?? config.fundo,
                            },
                        ]}
                    >
                        {config.solido ? (
                            <View style={[style.circulo, { backgroundColor: config.cor }]}>
                                <Ionicons
                                    name={config.icone}
                                    size={22}
                                    color={themes.colors["branco"]}
                                />
                            </View>
                        ) : (
                            <Ionicons
                                name={iconeConfirmar ?? config.icone}
                                size={26}
                                color={
                                    corConfirmar
                                        ? themes.colors[corConfirmar]
                                        : config.cor
                                }
                            />
                        )}
                    </View>

                    <Text style={style.titulo}>{titulo}</Text>
                    {!!mensagem && (
                        <Text style={style.mensagem}>{mensagem}</Text>
                    )}

                    <View style={style.botoes}>
                        {tipo === "confirmacao" ? (
                            <>
                                <Button
                                    texto={
                                        carregando
                                            ? textoCarregando
                                            : textoConfirmar ?? config.botao
                                    }
                                    cor={corConfirmar ?? "erro"}
                                    corTexto="branco"
                                    disabled={carregando}
                                    onPress={onConfirmar}
                                />

                                <Button
                                    texto="Cancelar"
                                    variante="contorno"
                                    cor="borda"
                                    disabled={carregando}
                                    onPress={onFechar}
                                />
                            </>
                        ) : (
                            <Button
                                texto={textoBotao ?? config.botao}
                                onPress={onFechar}
                            />
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    )
}
