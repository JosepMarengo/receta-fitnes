import React, {} from "react";

interface SearchBardProps{
    onSearch: (termino:string) => void;
}

export const SearchBard = ({ onSearch }: SearchBardProps) =>{
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value);
    }
    //barra de buscador
    return(
        <div className="relative max-w-xl mx-auto mb-10">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400"></span>
                </div>
            <input 
            type="text"
            onChange={handleChange}
            placeholder="Buscar receta por nombre"
            className="block w-full pl-10 pr-4 py-3 border-2 border-orange-100 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-sm"
            />
        </div>
    )
}