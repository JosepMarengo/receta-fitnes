export const traducir = async (texto: string): Promise<string> => {
    if (!texto) return ""
    // Si el texto es corto, lo traducimos de una vez
    if (texto.length < 450){
        return fetchTraduccionSimple(texto)
    }

    const parrafos = texto.split('.').filter(p => p.trim() !=="")
    const promesas = parrafos.map(p => fetchTraduccionSimple(p))

    const resultados = await Promise.all(promesas)
    return resultados.join (". ")+ "."
    }

    const fetchTraduccionSimple = async (t: string): Promise<string> => {
        if(!t.trim()) return ""
        try{
            // Cambiamos a MyMemory que es más estable para CORS que Lingva
            const res = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(t)}&langpair=en|es`
            )

            const data = await res.json()
            // Si la API nos bloquea por límite diario, devolvemos el original para que no se rompa la app
            if (data.responseStatus !== 200) return t
            
            return data.responseData.translatedText || t
        } catch(error){
            console.error("Error en trozo", error)
            return t
        }
    

}