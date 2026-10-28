
import React, { useState } from "react"
import { Pressable, ScrollView, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { style } from "./style"
import { themes } from "../../global/themes"

export type DropdownOpcao = { valor: string; label: string }

type DropdownProps = {
    label?: string
    placeholder?: string
    opcoes: DropdownOpcao[]
    valor: string | null
    onChange: (valor: string) => void
}

export default function Dropdown({
    label,
    placeholder = "Selecione",
    opcoes,
    valor,
    onChange,
}: DropdownProps) {
    const [aberto, setAberto] = useState(false)

    const selecionada = opcoes.find((o) => o.valor === valor)

    return (
        <View style={style.container}>
            {!!label && <Text style={style.label}>{label}</Text>}

            <Pressable
                onPress={() => setAberto((a) => !a)}
                accessibilityRole="button"
                accessibilityState={{ expanded: aberto }}
                style={[style.campo, aberto && style.campoAberto]}
            >
                <Text
                    style={[style.textoCampo, !selecionada && style.placeholder]}
                    numberOfLines={1}
                >
                    {selecionada ? selecionada.label : placeholder}
                </Text>

                <Ionicons
                    name={aberto ? "caret-up" : "caret-down"}
                    size={16}
                    color={themes.colors["marrom-suave"]}
                />
            </Pressable>

            {aberto && (
                <View style={style.lista}>
                    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                        {opcoes.map((op) => (
                            <Pressable
                                key={op.valor}
                                onPress={() => {
                                    onChange(op.valor)
                                    setAberto(false)
                                }}
                                style={({ pressed }) => [
                                    style.opcao,
                                    pressed && style.opcaoPressionada,
                                ]}
                            >
                                <Text
                                    style={[
                                        style.textoOpcao,
                                        op.valor === valor && style.textoOpcaoAtiva,
                                    ]}
                                >
                                    {op.label}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    )
}