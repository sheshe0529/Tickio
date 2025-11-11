export const fakeEventData = [
    {
        // --- 1. CONCIERTO ---
        id: '1',
        title: 'Grupo 5 - Noche de Oro',
        date: 'Viernes, 28 de noviembre de 2025',
        time: '20:00',
        location: 'Estadio Nacional, Lima',
        description: '¡La orquesta de cumbia más grande del Perú celebra su aniversario!',
        mainImage: '/events/concierto-grupo5.png',
        mapImage: '/maps/mapa-estadio-nacional.png',
        zones: [
            { id: 'g1', name: 'Platinium', price: 550.00, available: 1000, total: 1000 },
            { id: 'g2', name: 'VIP', price: 380.00, available: 2000, total: 2000 },
            { id: 'g3', name: 'Oriente', price: 250.00, available: 4500, total: 5000 },
            { id: 'g4', name: 'Norte', price: 100.00, available: 8000, total: 8000 },
        ]
    },
    {
        // --- 2. DEPORTE ---
        id: '2',
        title: 'Clásico: Universitario vs Alianza Lima',
        date: 'Domingo, 16 de noviembre de 2025',
        time: '15:30',
        location: 'Estadio Monumental, Ate',
        description: 'El superclásico del fútbol peruano. ¡Vive la pasión del U-AL!',
        mainImage: '/events/clasico-u-alianza.jpg',
        mapImage: '/maps/mapa-monumental.png',
        zones: [
            { id: 'c1', name: 'Occidente (Centro)', price: 200.00, available: 3000, total: 3000 },
            { id: 'c2', name: 'Oriente (Centro)', price: 180.00, available: 4000, total: 4000 },
            { id: 'c3', name: 'Norte', price: 50.00, available: 8000, total: 8000 },
            { id: 'c4', name: 'Sur (Familiar)', price: 50.00, available: 7500, total: 8000 },
        ]
    },
    {
        // --- 3. TEATRO ---
        id: '3',
        title: 'La Tía de Carlos - Comedia',
        date: 'Sábado, 22 de noviembre de 2025',
        time: '20:00',
        location: 'Teatro Marsano, Miraflores',
        description: 'Una noche de risas garantizadas con un elenco de primera.',
        mainImage: '/events/teatro-marsano.jpg',
        mapImage: '/maps/mapa-teatro-marsano.png',
        zones: [
            { id: 't1', name: 'Platea VIP', price: 120.00, available: 100, total: 100 },
            { id: 't2', name: 'Platea General', price: 80.00, available: 150, total: 150 },
            { id: 't3', name: 'Mezzanine', price: 50.00, available: 200, total: 200 },
        ]
    },
    {
        // --- 4. FAMILIA ---
        id: '4',
        title: 'Navidad Mágica: El Show de Santa',
        date: 'Sábado, 13 de diciembre de 2025',
        time: '17:00',
        location: 'Jockey Club del Perú, Surco',
        description: 'Un espectáculo familiar lleno de luces, acrobacias y magia.',
        mainImage: '/events/circo-navidad.jpg',
        mapImage: '/maps/mapa-jockey-club.png',
        zones: [
            { id: 'f1', name: 'Experiencia Mágica', price: 150.00, available: 500, total: 500 },
            { id: 'f2', name: 'VIP', price: 90.00, available: 1000, total: 1000 },
            { id: 'f3', name: 'General', price: 40.00, available: 2000, total: 2000 },
        ]
    }
];