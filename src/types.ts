export interface Ingrediente{
    nombre: string,
    cantidad: string
}

export interface Receta {
    id: number,
    titulo: string,
    categoria: 'Desayuno' | 'Almuerzo' | 'Cena',
    imagen: string,
    ingredientes: Ingrediente[],
    instrucciones: string
}