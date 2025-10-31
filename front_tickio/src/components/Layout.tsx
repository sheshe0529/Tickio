import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer'; // <-- 1. Importa tu Footer

function Layout() {
    return (
        // (Opcional) Podemos agregar un div que fuerce el footer al fondo
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            {/* El main ahora toma el espacio disponible */}
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>

            <Footer /> {/* <-- 2. Reemplaza el <footer> feo */}
        </div>
    );
}

export default Layout;