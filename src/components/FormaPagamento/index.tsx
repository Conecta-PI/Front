
import React from "react"
import { Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { style } from "./style"
import { themes } from "../../global/themes"

export type TipoPagamento = "pix" | "cartao" | "dinheiro"

type IconName = React.ComponentProps<typeof Ionicons>["name"]

export const PAGAMENTOS: TipoPagamento[] = ["pix", "cartao", "dinheiro"]

const CONFIG: Record<TipoPagamento, { texto: string; icone: IconName }> = {
    pix: { texto: "PIX", icone: "flash-outline" },
    cartao: { texto: "Cartão", icone: "card-outline" },
    dinheiro: { texto: "Dinheiro", icone: "cash-outline" },
}

type FormaPagamentoProps = {
    tipo: TipoPagamento
    selecionado: boolean
    onPress: () => void
}

export default function FormaPagamento({ tipo, selecionado, onPress }: FormaPagamentoProps) {
    const config = CONFIG[tipo]

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="radio"
            accessibilityState={{ selected: selecionado }}
            accessibilityLabel={config.texto}
            style={[style.card, selecionado && style.cardSelecionado]}
        >
            <View style={style.icone}>
                <Ionicons name={config.icone} size={18} color={themes.colors["azul-escuro"]} />
            </View>

            <Text style={[style.texto, selecionado && style.textoSelecionado]}>
                {config.texto}
            </Text>

            {selecionado && (
                <View style={style.check}>
                    <Ionicons name="checkmark" size={12} color={themes.colors["branco"]} />
                </View>
            )}
        </Pressable>
    )
}