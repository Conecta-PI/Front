import React, { ReactNode } from "react"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { style } from "./style"

type Props = {
    children: ReactNode
}

export default function RecuperacaoCard({ children }: Props) {
    const insets = useSafeAreaInsets()

    return <View style={[style.card, { marginBottom: 10 + insets.bottom }]}>{children}</View>
}
