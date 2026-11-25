
import React, { useState } from "react"
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { style } from "./style"
import { themes } from "../../global/themes"

type IconName = React.ComponentProps<typeof Ionicons>["name"]

export type InputTipo =
    | "email"
    | "senha"
    | "texto"
    | "telefone"
    | "moeda"
    | "decimal"
    | "numero"
    | "data"
    | "hora"
    | "cnpj"

export type InputProps = Omit<TextInputProps, "secureTextEntry" | "keyboardType"> & {
    tipo: InputTipo
    label?: string
    erro?: string
    icone?: IconName
}

function mascaraTelefone(valor: string) {
    const d = valor.replace(/\D/g, "").slice(0, 11)

    if (d.length === 0) return ""
    if (d.length <= 2) return `(${d}`
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function mascaraMoeda(valor: string) {
    const d = valor.replace(/\D/g, "").slice(0, 9)
    if (!d) return ""

    const [inteiro, decimal] = (parseInt(d, 10) / 100).toFixed(2).split(".")
    return `${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${decimal}`
}

function mascaraDecimal(valor: string) {
    const limpo = valor.replace(/[^\d,.]/g, "").replace(/\./g, ",")
    const [inteiro, ...resto] = limpo.split(",")

    return resto.length > 0 ? `${inteiro},${resto.join("").slice(0, 3)}` : inteiro
}

function mascaraNumero(valor: string) {
    return valor.replace(/\D/g, "").slice(0, 9)
}

function mascaraData(valor: string) {
    const d = valor.replace(/\D/g, "").slice(0, 8)

    if (d.length <= 2) return d
    if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
    return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}

function mascaraCnpj(valor: string) {
    const d = valor.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 14)

    if (d.length <= 2) return d
    if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
    if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
    if (d.length <= 12) {
        return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`
    }

    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}

function mascaraHora(valor: string) {
    const d = valor.replace(/\D/g, "").slice(0, 4)

    return d.length <= 2 ? d : `${d.slice(0, 2)}:${d.slice(2)}`
}

const MASCARAS: Partial<Record<InputTipo, (valor: string) => string>> = {
    telefone: mascaraTelefone,
    moeda: mascaraMoeda,
    decimal: mascaraDecimal,
    numero: mascaraNumero,
    data: mascaraData,
    hora: mascaraHora,
    cnpj: mascaraCnpj,
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

        case "moeda":
            return { keyboardType: "numeric", maxLength: 12 }

        case "decimal":
            return { keyboardType: "decimal-pad", maxLength: 10 }

        case "numero":
            return { keyboardType: "number-pad", maxLength: 9 }

        case "data":
            return { keyboardType: "number-pad", maxLength: 10 }

        case "hora":
            return { keyboardType: "number-pad", maxLength: 5 }

        case "cnpj":
            return {
                keyboardType: "default",
                autoCapitalize: "characters",
                autoCorrect: false,
                maxLength: 18,
                autoComplete: "off",
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
    icone,
    onFocus,
    onBlur,
    onChangeText,
    ...rest
}: InputProps) {
    const [focado, setFocado] = useState(false)
    const [senhaVisivel, setSenhaVisivel] = useState(false)

    const isSenha = tipo === "senha"
    const multilinha = !!rest.multiline

    return (
        <View style={style.container}>
            {label && <Text style={style.label}>{label}</Text>}

            <View
                style={[
                    style.field,
                    multilinha && style.fieldMultilinha,
                    focado && style.fieldFocado,
                    !!erro && style.fieldErro,
                ]}
            >
                <TextInput
                    style={[style.input, multilinha && style.inputMultilinha]}
                    placeholderTextColor={themes.colors["texto-secundario"]}
                    onFocus={(e) => {
                        setFocado(true)
                        onFocus?.(e)
                    }}
                    onBlur={(e) => {
                        setFocado(false)
                        onBlur?.(e)
                    }}
                    onChangeText={(texto) => onChangeText?.(MASCARAS[tipo]?.(texto) ?? texto)}
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

                {!isSenha && !!icone && (
                    <View style={style.eye}>
                        <Ionicons name={icone} size={20} color={themes.colors["marrom-suave"]} />
                    </View>
                )}
            </View>

            {!!erro && <Text style={style.erro}>{erro}</Text>}
        </View>
    )
}
