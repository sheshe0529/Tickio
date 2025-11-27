import React, { useEffect } from 'react';
import './SobreNosotrosPage.css';

function SobreNosotrosPage() {
  
  useEffect(() => {
    document.title = 'Tickio - Sobre Nosotros';
  }, []);

  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>Tu puerta de entrada a las mejores experiencias</h1>
        <p>Hacemos que descubrir y disfrutar eventos sea tan emocionante como vivirlos.</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Nuestra Filosofía</h2>
          <p>
            En Tickio, creemos que la magia comienza mucho antes de que se apaguen las luces del escenario. 
            Nace en el momento en que decides salir. Por eso, hemos eliminado el ruido y la complejidad, 
            creando una plataforma donde tu única preocupación sea elegir qué disfrutar hoy.
          </p>
        </section>

        <section className="about-values-grid">
          {/* --- PUNTO 1: BÚSQUEDA INTELIGENTE --- */}
          <div className="value-card">
            <h3>🔍 Encuentra tu plan ideal</h3>
            <p>
              Olvídate de navegar sin rumbo. Ya sea que busques un concierto específico, 
              quieras saber qué pasa este fin de semana o prefieras explorar eventos cerca de tu distrito, 
              nuestro sistema de búsqueda inteligente conecta todos esos detalles para mostrarte 
              exactamente lo que te apasiona en segundos.
            </p>
          </div>

          {/* --- PUNTO 2: COMPRA SENCILLA --- */}
          <div className="value-card">
            <h3>🎟️ Compra sin fricción</h3>
            <p>
              Sabemos que tu tiempo vale oro. Hemos diseñado una experiencia de compra minimalista y directa. 
              Desde que eliges tu asiento hasta que recibes tu entrada QR, el proceso es intuitivo y rápido. 
              Sin pasos innecesarios, solo tú y tu próximo gran recuerdo.
            </p>
          </div>

          {/* --- PUNTO 3: SEGURIDAD (Siempre importante mantenerlo) --- */}
          <div className="value-card">
            <h3>🛡️ Seguridad total</h3>
            <p>
              Tu tranquilidad es nuestra prioridad. Utilizamos tecnología de vanguardia para garantizar 
              que cada transacción sea segura y que cada entrada sea única y verificable al instante.
            </p>
          </div>
        </section>

        <section className="about-stats">
          <div className="stat-item">
            <span className="stat-number">+50</span>
            <span className="stat-label">Distritos Conectados</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Acceso Inmediato</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Diversión Garantizada</span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SobreNosotrosPage;