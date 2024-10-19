export const scrollBarThemes = {
    /* Apply scrollbar styles globally */
    "::-webkit-scrollbar": {
        width: "12px",
        backgroundColor: "var(--chakra-colors-gray-200)",
    },
    "::-webkit-scrollbar-track": {
        "-webkit-box-shadow": "inset 0 0 6px rgba(0, 0, 0, 0.3)",
        borderRadius: "10px",
        backgroundColor: "var(--chakra-colors-gray-200)",
    },
    "::-webkit-scrollbar-thumb": {
        borderRadius: "10px",
        "-webkit-box-shadow": "inset 0 0 6px rgba(0, 0, 0, 0.3)",
        backgroundColor: "var(--chakra-colors-perygonPink)",
    },
    "::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "var(--chakra-colors-seduloRed)",
    },
}