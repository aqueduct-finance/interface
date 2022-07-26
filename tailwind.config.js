const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                toastInRight: {
                    from: {
                        transform: "translateX(100%)",
                    },
                    to: {
                        transform: "translateX(0)",
                    },
                },
            },
            animation: {
                "toast-in-right": "toastInRight 0.7s",
            },
            colors: {
                aqueductBlue: "#0460CE",
                warningYellow: "#FDB833",
                darkBlue: "#0e2138",
                blueBlack: "#0b1521",
                blueBlack2: "#060d14",
                daiYellow: "#F5AC37",
                usdcBlue: "#2775CA",
                ethBlue: "#00ABEE",
                ethPink: "#E7018A",
            },
            screens: {
                xs: "475px",
                "3xl": "2000px",
                ...defaultTheme.screens,
            },
        },
    },
    plugins: [],
};
