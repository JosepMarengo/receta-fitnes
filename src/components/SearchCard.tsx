import { Receta} from '../types';

interface SearchCardProps{
    receta: Receta
}

export const SearchCard =({ receta }: SearchCardProps) =>{
    return(
        <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg md-6 border border-gray-100 transition-transform hover:scale-[1.01]">
            <div className="h-64 w-full md:h-auto md:w-1/3">
                <img src={receta.imagen} 
                     alt={receta.titulo}
                     className="h-full w-full object-cover"
                     />
            </div>
            
            <div className="p-6 md:w-2/3">
                <h2 className=" text-3xl font-bold text-gray-900 md-1">{receta.titulo}</h2>
                <p className=" text-orange-500 font-medium text-sm mb-4 uppercase tracking-wider">{receta.categoria}</p>
            

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 className="font-bold text-gray-800 border-b-2 border-orange-200 inline-block mb-2">INGREDIENTES</h4>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                {receta.ingredientes && receta.ingredientes.length > 0 ? (
                receta.ingredientes.map((ing, index) => (
                    <li key={index}>
                    <span className="text-gray-800 font-medium">{ing.nombre}</span>: {ing.cantidad}
                 </li>
                ))
                ) : (
                <li className="text-gray-400 italic">No hay ingredientes disponibles</          li>
                )}
            </ul>
            </div>

            <div>
                <h4 className="font-bold text-gray-800 border-b-2 border-orange-300 inline-block mb-2">Pasos a seguir</h4>
                <p className="text-gray-600 text-sm leading-relaxed font-bold">{receta.instrucciones || "Traduciendo pasoos..."}</p>
                    
                    </div>
                </div>
            </div>
        </div>
    )
}
