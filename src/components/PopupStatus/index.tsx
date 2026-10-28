
import React from "react"
import { Modal, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { style } from "./style"
import { themes } from "../../global/themes"
import Button from "../Button/Button"
import FundoDesfocado from "../FundoDesfocado/"

export type TipoPopup = "sucesso" | "erro"

type IconName = React.ComponentProps<typeof Ionicons>["name"]

const CONFIG: Record<TipoPopup, { icone: IconName; cor: string; fundo: string; botao: string }> = {
    sucesso: {
        icone: "checkmark",
        cor: themes.colors["sucesso"],
        fundo: themes.colors["fundo-de-sucesso"],
        botao: "Continuar",
    },
    erro: {
        icone: "close",
        cor: themes.colors["erro"],
        fundo: themes.colors["fundo-de-erro"],
        botao: "Fechar",
    },
}

type PopupStatusProps = {
    visivel: boolean
    tipo: TipoPopup
    titulo: string
    mensagem?: string
    textoBotao?: string
    onFechar: () => void
}

export default function PopupStatus({
    visivel,
    tipo,
    titulo,
    mensagem,
    textoBotao,
    onFechar,
}: PopupStatusProps) {
    const config = CONFIG[tipo]

    return (
        <Modal
            transparent
            visible={visivel}
            animationType="fade"
            statusBarTranslucent
            navigationBarTranslucent
            onRequestClose={onFechar}
        >
            <View style={style.raiz}>
                <FundoDesfocado />

                <View style={style.card}>
                    <View style={[style.anel, { backgroundColor: config.fundo }]}>
                        <View style={[style.circulo, { backgroundColor: config.cor }]}>
                            <Ionicons name={config.icone} size={22} color={themes.colors["branco"]} />
                        </View>
                    </View>

                    <Text style={style.titulo}>{titulo}</Text>
                    {!!mensagem && <Text style={style.mensagem}>{mensagem}</Text>}

                    <View style={style.botao}>
                        <Button texto={textoBotao ?? config.botao} onPress={onFechar} />
                    </View>
                </View>
            </View>
        </Modal>
    )
}