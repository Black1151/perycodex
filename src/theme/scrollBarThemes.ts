export const scrollBarThemes = {
    /* Apply scrollbar styles globally */
    ".ag-body-vertical-scroll": {
        width: "6px",
    },

    "::-webkit-scrollbar": {
        width: "6px",
        backgroundColor: "var(--chakra-colors-gray-200)",
    },
    "::-webkit-scrollbar-track": {
        "-webkit-box-shadow": "inset 0 0 6px rgba(0, 0, 0, 0.3)",
        borderRadius: "6px",
        backgroundColor: "var(--chakra-colors-gray-200)",
    },
    "::-webkit-scrollbar-thumb": {
        borderRadius: "6px",
        "-webkit-box-shadow": "inset 0 0 6px rgba(0, 0, 0, 0.3)",
        backgroundColor: "var(--chakra-colors-perygonPink)",
    },
    "::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "var(--chakra-colors-seduloRed)",
    },


}