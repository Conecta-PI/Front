import React, { useState } from "react"
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { style } from "./style"
import { themes } from "../../global/themes"

export type InputTipo = "email" | "senha" | "texto" | "telefone"

export type InputProps = Omit<TextInputProps, "secureTextEntry" | "keyboardType"> & {
    tipo: InputTipo
    label?: string
    erro?: string
}

function mascaraTelefone(valor: string) {
    const d = valor.replace(/\D/g, "").slice(0, 11)

    if (d.length === 0) return ""
    if (d.length <= 2) return `(${d}`
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function propsPorTipo(tipo: InputTipo, senhaVisivel: boolean): TextInputProps {
    switch (tipo) {
        case "email":
            return {
                keyboardType: "email-address",
                autoCapitalize: "none",
                autoCorrect: false,
                autoComplete: "email",
                textContentType: "emailAddress",
            }

        case "senha":
            return {
                secureTextEntry: !senhaVisivel,
                autoCapitalize: "none",
                autoCorrect: false,
                autoComplete: "password",
                textContentType: "password",
            }

        case "telefone":
            return {
                keyboardType: "phone-pad",
                autoComplete: "tel",
                textContentType: "telephoneNumber",
                maxLength: 15,
            }

        case "texto":
        default:
            return {
                keyboardType: "default",
                autoCapitalize: "words",
            }
    }
}

export default function Input({
    tipo,
    label,
    erro,
    onFocus,
    onBlur,
    onChangeText,
    ...rest
}: InputProps) {
    const [focado, setFocado] = useState(false)
    const [senhaVisivel, setSenhaVisivel] = useState(false)

    const isSenha = tipo === "senha"

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
                    onChangeText={(texto) =>
                        onChangeText?.(tipo === "telefone" ? mascaraTelefone(texto) : texto)
                    }
                    {...propsPorTipo(tipo, senhaVisivel)}
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