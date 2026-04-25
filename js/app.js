window.addEventListener('load', () => {
    // requestAnimationFrame asegura que el procesador gráfico del móvil esté listo
    requestAnimationFrame(() => {
        // Ahora sí, esperamos 800ms para darle un respiro al usuario y disparamos
        setTimeout(() => {
            const titulo = document.querySelector('h1');
            if (titulo) {
                // Solo añadimos el "gatillo"
                titulo.classList.add('animar');
            }
        }, 800); // 800ms de retraso
    });
});