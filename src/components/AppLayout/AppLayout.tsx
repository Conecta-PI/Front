import React, { ReactNode } from "react"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import Header, { HeaderProps } from "../Header/Header"
import { style } from "./style"

type AppLayoutProps = {
    header: HeaderProps
    children: ReactNode
}

export default function AppLayout({ header, children }: AppLayoutProps) {
    const insets = useSafeAreaInsets()

    return (
        <View style={style.container}>
            <View style={[style.statusBarFundo, { height: insets.top }]} />

            <View style={{ paddingTop: insets.top }}>
                <Header {...header} />
            </View>

            <View style={style.content}>{children}</View>
        </View>
    )
}