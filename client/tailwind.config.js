/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            boxShadow: {
                custom: "0 4px 30px rgba(0, 0, 0, 0.3)",
            },
        },
    },
    plugins: [],
};
