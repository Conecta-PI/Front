
import React, { ReactNode } from "react"
import { View } from "react-native"

import Header from "../Header/Header"
import { style } from "./style"

type AppLayoutProps = {
    children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <View style={style.container}>
            <Header />

            <View style={style.content}>
                {children}
            </View>
        </View>
    )
}
