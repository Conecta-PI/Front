import React, { useState } from "react"
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { style } from "./style"
import { themes } from "../../global/themes"

export type InputTipo = "email" | "senha"

type InputProps = Omit<TextInputProps, "secureTextEntry" | "keyboardType"> & {
    tipo: InputTipo
    label?: string
    erro?: string
}

export default function Input({
    tipo,
    label,
    erro,
    onFocus,
    onBlur,
    ...rest
}: InputProps) {
    const [focado, setFocado] = useState(false)
    const [senhaVisivel, setSenhaVisivel] = useState(false)

    const isSenha = tipo === "senha"

    const propsPorTipo: TextInputProps =
        tipo === "email"
            ? {
                  keyboardType: "email-address",
                  autoCapitalize: "none",
                  autoCorrect: false,
                  autoComplete: "email",
                  textContentType: "emailAddress",
              }
            : {
                  secureTextEntry: !senhaVisivel,
                  autoCapitalize: "none",
                  autoCorrect: false,
                  autoComplete: "password",
                  textContentType: "password",
              }

    return (
        <View style={style.container}>
            {label && <Text style={style.label}>{label}</Text>}

            <View
                style={[
                    style.field,
                    focado && style.fieldFocado,
                    !!erro && style.fieldErro,
                ]}
            >
                <TextInput
                    style={style.input}
                    placeholderTextColor={themes.colors["texto-secundario"]}
                    onFocus={(e) => {
                        setFocado(true)
                        onFocus?.(e)
                    }}
                    onBlur={(e) => {
                        setFocado(false)
                        onBlur?.(e)
                    }}
                    {...propsPorTipo}
                    {...rest}
                />

                {isSenha && (
                    <Pressable
                        onPress={() => setSenhaVisivel((v) => !v)}
                        hitSlop={10}
                        style={style.eye}
                        accessibilityRole="button"
                        accessibilityLabel={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
                    >
                        <Ionicons
                            name={senhaVisivel ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color={themes.colors["azul-escuro"]}
                        />
                    </Pressable>
                )}
            </View>

            {!!erro && <Text style={style.erro}>{erro}</Text>}
        </View>
    )
}