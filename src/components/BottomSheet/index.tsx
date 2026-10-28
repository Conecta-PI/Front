
import React, { ReactNode, useEffect, useRef, useState } from "react"
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { style } from "./style"
import { themes } from "../../global/themes"
import FundoDesfocado from "../FundoDesfocado/"

const ALTURA_TELA = Dimensions.get("window").height

type BottomSheetProps = {
    visivel: boolean
    onFechar: () => void
    titulo: string
    descricao?: string
    children: ReactNode
}

export default function BottomSheet({
    visivel,
    onFechar,
    titulo,
    descricao,
    children,
}: BottomSheetProps) {
    const insets = useSafeAreaInsets()

    const [montado, setMontado] = useState(visivel)
    const progresso = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (visivel) {
            setMontado(true)
            Animated.timing(progresso, {
                toValue: 1,
                duration: 260,
                useNativeDriver: true,
            }).start()
        } else {
            Animated.timing(progresso, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) setMontado(false)
            })
        }
    }, [visivel, progresso])

    const translateY = progresso.interpolate({
        inputRange: [0, 1],
        outputRange: [ALTURA_TELA, 0],
    })

    if (!montado) return null

    return (
        <Modal
            transparent
            visible
            animationType="none"
            statusBarTranslucent
            navigationBarTranslucent
            onRequestClose={onFechar}
        >
            <View style={style.raiz}>
                <Animated.View style={[StyleSheet.absoluteFill, { opacity: progresso }]}>
                    <FundoDesfocado />
                </Animated.View>

                {/* tocar no fundo fecha */}
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={onFechar}
                    accessibilityLabel="Fechar"
                />

                <KeyboardAvoidingView
                    behavior="padding"
                    pointerEvents="box-none"
                    style={style.posicao}
                >
                    <Animated.View
                        style={[
                            style.folha,
                            { paddingBottom: 20 + insets.bottom, transform: [{ translateY }] },
                        ]}
                    >
                        <View style={style.cabecalho}>
                            <Text style={style.titulo}>{titulo}</Text>

                            <Pressable
                                onPress={onFechar}
                                hitSlop={10}
                                accessibilityRole="button"
                                accessibilityLabel="Fechar"
                            >
                                <Ionicons name="close" size={24} color={themes.colors["marrom-suave"]} />
                            </Pressable>
                        </View>

                        {!!descricao && <Text style={style.descricao}>{descricao}</Text>}

                        <ScrollView
                            style={style.scroll}
                            contentContainerStyle={style.conteudo}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            {children}
                        </ScrollView>
                    </Animated.View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    )
}