import React from "react";
import { LayoutProps } from "./createApp";

export const SimpleLayout: React.FC<LayoutProps<'Menu'|'Content'|'Footer'>> = ({slots}) => {
    const { Menu, Content, Footer } = slots;

    return <div>
        <header>
            <React.Suspense fallback={'loading'}>
                <Menu/>
            </React.Suspense>
        </header>
        <main>
            <React.Suspense fallback={'loading'}>
                <Content/>
            </React.Suspense>
        </main>
        <footer>
            <React.Suspense fallback={'loading'}>
                <Footer/>
            </React.Suspense>
        </footer>
    </div>
}
