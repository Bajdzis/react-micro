import { LayoutProps } from "./createApp";

export const SimpleLayout: React.FC<LayoutProps<'Menu'|'Content'|'Footer'>> = ({slots}) => {
    const { Menu, Content, Footer } = slots;

    return <div>
        <header>
            <Menu/>
        </header>
        <main>
            <Content/>
        </main>
        <footer>
            <Footer/>
        </footer>
    </div>
}
