export const useSpiritualLevel = (count: number) => {
    const levels = [
        { min: 0, title: 'Iniciado', rank: 'Nivel 1', color: '#FFFFFF', icon: 'I' },
        { min: 3, title: 'Oyente Fiel', rank: 'Nivel 2', color: '#E8E8E8', icon: 'O' },
        { min: 7, title: 'Buscador', rank: 'Nivel 3', color: '#D1D1D1', icon: 'B' },
        { min: 15, title: 'Aprendiz', rank: 'Nivel 4', color: '#A3A3A3', icon: 'A' },
        { min: 30, title: 'Seguidor', rank: 'Nivel 5', color: '#FFD600', icon: 'S' },
        { min: 60, title: 'Discípulo', rank: 'Nivel 6', color: '#FCD34D', icon: 'D' },
        { min: 100, title: 'Siervo', rank: 'Nivel 7', color: '#FBBF24', icon: 'V' },
        { min: 180, title: 'Embajador', rank: 'Nivel 8', color: '#F59E0B', icon: 'E' },
        { min: 300, title: 'Testigo', rank: 'Nivel 9', color: '#D97706', icon: 'T' },
        { min: 500, title: 'Ungido', rank: 'Nivel 10', color: '#000000', icon: 'U', textColor: 'text-white' }
    ];

    const current = [...levels].reverse().find(l => count >= l.min) || levels[0];
    const nextIdx = levels.indexOf(current) + 1;
    const next = levels[nextIdx];

    const progress = next
        ? ((count - current.min) / (next.min - current.min)) * 100
        : 100;

    return { ...current, nextTitle: next?.title, progress };
};
