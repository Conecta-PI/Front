
import React, { useState } from "react"
import { Alert, Image, Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"

import { style } from "./style"
import { themes } from "../../global/themes"
import BottomSheet from "../BottomSheet/"
import Button from "../Button/Button"

type CampoFotoProps = {
    label?: string
    uri: string | null
    onChange: (uri: string | null) => void
}

export default function CampoFoto({ label, uri, onChange }: CampoFotoProps) {
    const [aberto, setAberto] = useState(false)

    async function escolher(origem: "camera" | "galeria") {
        setAberto(false)
        await new Promise((r) => setTimeout(r, 350))

        if (origem === "camera") {
            const permissao = await ImagePicker.requestCameraPermissionsAsync()

            if (!permissao.granted) {
                Alert.alert(
                    "Permissão necessária",
                    "Permita o acesso à câmera nas configurações do celular para tirar a foto."
                )
                return
            }
        }

        const opcoes: ImagePicker.ImagePickerOptions = {
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        }

        const resultado =
            origem === "camera"
                ? await ImagePicker.launchCameraAsync(opcoes)
                : await ImagePicker.launchImageLibraryAsync(opcoes)

        if (!resultado.canceled) onChange(resultado.assets[0].uri)
    }

    return (
        <View style={style.container}>
            {!!label && <Text style={style.label}>{label}</Text>}

            <View>
                <Pressable
                    onPress={() => setAberto(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Tirar ou enviar foto"
                    style={({ pressed }) => [
                        style.caixa,
                        !!uri && style.caixaComFoto,
                        pressed && style.pressionado,
                    ]}
                >
                    {uri ? (
                        <Image source={{ uri }} style={style.imagem} resizeMode="cover" />
                    ) : (
                        <Text style={style.texto}>Tirar ou enviar foto</Text>
                    )}
                </Pressable>

                {!!uri && (
                    <Pressable
                        onPress={() => onChange(null)}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel="Remover foto"
                        style={style.remover}
                    >
                        <Ionicons name="close" size={16} color={themes.colors["azul-escuro"]} />
                    </Pressable>
                )}
            </View>

            <BottomSheet
                visivel={aberto}
                onFechar={() => setAberto(false)}
                titulo="Foto do produto"
                descricao="Escolha como quer adicionar a foto."
            >
                <Button texto="Tirar foto" icone="camera-outline" onPress={() => escolher("camera")} />
                <Button
                    texto="Escolher da galeria"
                    icone="image-outline"
                    variante="contorno"
                    onPress={() => escolher("galeria")}
                />
                <Button
                    texto="Cancelar"
                    variante="contorno"
                    cor="borda"
                    onPress={() => setAberto(false)}
                />
            </BottomSheet>
        </View>
    )
}