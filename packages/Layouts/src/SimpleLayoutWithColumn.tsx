import React from "react";
import { LayoutProps } from "./domain";

const flex = {
    display: 'flex'
} as const;

export const SimpleLayoutWithColumn: React.FC<LayoutProps<'Menu'|'Content'|'Footer'|'Column'>> = ({slots, fallback = null}) => {
    const { Menu, Content, Footer, Column } = slots;

    return <div>
        <header>
            <React.Suspense fallback={fallback}>
                <Menu/>
            </React.Suspense>
        </header>
        <main style={flex}>
            <React.Suspense fallback={fallback}>
                <Column />
                <Content />
            </React.Suspense>
        </main>
        <footer>
            <React.Suspense fallback={fallback}>
                <Footer/>
            </React.Suspense>
        </footer>
    </div>
}
