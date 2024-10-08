import {extendTheme} from "@chakra-ui/react";
import { agGridStyles } from "./agGridStyles"

export const perygonTheme = extendTheme({

    colors: {
        perygonPink: "#ff0070",
        seduloRed: "#B4213D",
        yellow: "#EFC718",
        lightGreen: "#92C01F",
    },
    fonts: {
        heading: "Metropolis, sans-serif",
        body: "Metropolis, sans-serif",
        bonfire: "Bonfire, sans-serif",
    },
    styles: {
        global: {
            ...agGridStyles,
        },
    },
    components: {
        Button: {
            variants: {
                primary: {
                    mt: 5,
                    backgroundColor: "perygonPink",
                    w: "full",
                    height: 12,
                    color: "white",
                    _hover: {
                        color: "perygonPink",
                        border: "1px solid",
                        borderColor: "perygonPink",
                        backgroundColor:
                            "white",
                    },
                },
                agPrimary: {
                    bg: "transparent",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    _hover: {
                        color: "perygonPink",
                        bg: "white",
                        boxShadow: "md",
                    },
                    _focus: {
                        boxShadow: "outline",
                    },
                },
            },
        },
        Switch: {
            variants: {
                primary: {
                    track: {
                        _checked: {
                            bg: "perygonPink",
                        },
                        bg: "#ccc",
                    },
                    thumb: {
                        bg: "white",
                    },
                },
            },
        },
    },
});
