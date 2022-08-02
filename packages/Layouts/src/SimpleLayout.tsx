import React from "react";
import { LayoutProps } from "./domain";

export const SimpleLayout: React.FC<LayoutProps<'Menu'|'Content'|'Footer'>> = ({slots, fallback = null}) => {
    const { Menu, Content, Footer } = slots;

    return <div>
        <header>
            <React.Suspense fallback={fallback}>
                <Menu/>
            </React.Suspense>
        </header>
        <main>
            <React.Suspense fallback={fallback}>
                <Content/>
            </React.Suspense>
        </main>
        <footer>
            <React.Suspense fallback={fallback}>
                <Footer/>
            </React.Suspense>
        </footer>
    </div>
}
