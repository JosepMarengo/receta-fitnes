export const TraducirPaquete = async (textos: string[]): Promise<string[]> => {
    // Unimos todos los textos en uno solo usando un separador que no se traduzca
    const textoUnido = textos.join(" || ")

    try{
        const res = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textoUnido)}&langpair=en|es`
        )
        const data = await res.json()
        const traduccionCompleta = data.responseData.translatedText || textoUnido

        // Volvemos a separar el texto por el separador
        return traduccionCompleta.split(" || ").map((t: string) => t.trim())
    }  catch (error){
        console.error("Fallo traducción", error);
        return textos
    }
}

export const TraducirEspañol = async (texto: string): Promise<string> =>{
    if (!texto) return ""
    try{
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=en|es`)
        const data = await res.json()
        return data.responseData.translatedText || texto
    } catch{
        return texto
    }
}

    

