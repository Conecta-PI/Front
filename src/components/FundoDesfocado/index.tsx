
import React from "react"
import { StyleSheet, View } from "react-native"
import { BlurView } from "expo-blur"

import { style } from "./style"

export default function FundoDesfocado() {
    return (
        <>
            <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, style.veu]} />
        </>
    )
}