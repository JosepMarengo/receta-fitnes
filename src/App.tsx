import { HomeCard } from "./components/HomeCard"; // Asegúrate de que coincida con cómo lo exportaste
import { RecetaCard } from "./components/RecetaCard";
import { Receta, Ingrediente } from './types'; // Importamos la interfaz
import { SearchBard } from "./components/SearchBard";
import { useEffect, useState } from "react";
import { SearchCard } from "./components/SearchCard";
import { traducir } from "./services/translate";
import { TraducirEspañol, TraducirPaquete } from './services/TranslateIngredients';

// Datos mínimos para que no marque error

// esto se pone para crear desde cero la receta, en este caso vamos a consumir una API
// const MisRecetas: Receta[] =[ {
//   id: 1,
//   titulo: "Pollo a la brasa",
//   categoria: "Almuerzo",
//   imagen: "https://www.eatperu.com/wp-content/uploads/2019/10/pollo-a-la-brasa-with-salad-and-dipping-sauces.jpg",
//   ingredientes: [
//     {nombre: "Pollo", cantidad: "1kg"},
//     {nombre: "Sillao", cantidad: "1/5 taza"}
//   ],
//   instrucciones: "Marinar y hornear a fuego alto hasta que la piel esté crocante"
// },
// {
//   id: 2,
//   titulo: "Ensalada cesar",
//   categoria: "Almuerzo",
//   imagen: "https://tse4.mm.bing.net/th/id/OIP.ky9j_sVNs1Okt-Or7mfSrAHaFq?rs=1&pid=ImgDetMain&o=7&rm=3",
//   ingredientes: [
//     {nombre: "Lechuga", cantidad: "1kg"},
//     {nombre: "Pollo", cantidad: "150 gr"},
//     {nombre: "Aceite de oliva", cantidad: "1 chorro"}
//   ],
//   instrucciones: "Combinar el pollo con la ensalada"
// }
// ]

function App() {
  // 1. Inicializar el estado con el valor de LocalStorage si existe
  const [termino, setTermino] = useState(() => {
    return localStorage.getItem("ultimaBusqueda") || "";
  });
const [recetas, setRecetas] = useState<Receta[]>([])
const [cargando, setCargando] = useState(false)

// 2. Efecto para llamar a la API cada vez que el término cambia
useEffect(() =>{
  if (termino.trim() ===""){
    setRecetas([])
    return
  }

  //llamado de la API
  const buscarRecetas = async () => {
    setCargando(true)
    try{
      const terminoIngles = await traducir(termino)// otra función en tu servicio
      const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${terminoIngles}`)
      const data = await resp.json()

      // Jalamos o mapeamos los datos de la API a nuestra interfaz Receta
      // Segun como esta los datos en la API
      if (data.meals){  
        
        const meal = data.meals[0]
        const ingredientesOriginales = extraerIngredientes(meal)
        const nombresIngredientes = ingredientesOriginales.map(i => i.nombre)

        // Enviamos TODO a traducir en una sola llamada (Ahorra muchísimos créditos)
        const [tituloEs, instruccionesEs, ingredientesNombresEs] = await Promise.all([
          traducir(meal.strMeal),
          traducir(meal.strInstructions),
          TraducirPaquete(nombresIngredientes)
        ])

        // Reconstruimos los ingredientes con sus cantidades
        
        const ingredientesEs = ingredientesOriginales.map((ing, index) =>({
          nombre: ingredientesNombresEs[index] || ing.nombre,
          cantidad: ing.cantidad
        }))
        setRecetas([{
          id:Number(meal.idMeal),
          titulo: tituloEs,
          categoria:meal.strCategory,
          imagen: meal.strMealThumb,
          instrucciones: instruccionesEs,
          ingredientes: ingredientesEs
        }])
      } 
    }  finally{
      setCargando(false)
    }
  }

  // Debounce simple: esperamos un poco antes de disparar la API
  const timeoutId = setTimeout(buscarRecetas, 500)
  return () => clearTimeout(timeoutId)
}, [termino])

return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">Receta de comida <span className="text-orange-500 font-extrabold">Smart</span></h1>
          {termino && <p className="text-sm text-gray-500 mt-2">Última búsqueda guardada: <b>{termino}</b></p>}
          <p className="mt-4 text-lg text-gray-600">Busca tu comida favorita.</p>
        </header>

        {/* Lógica de búsqueda encapsulada */}
        <SearchBard onSearch={setTermino} />

       {cargando ? (
        <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {recetas.map((r) => (
              <SearchCard key={r.id} receta={r} />
            ))}
            {recetas.length === 0 && termino !== "" && (
              <p className="text-center text-gray-400">No se encontraron resultados para "{termino}"</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Función auxiliar para limpiar la data extraña de esta API específica
function extraerIngredientes(meal: any) {
  const ingredientes = [];

  // La API tiene hasta 20 campos de ingredientes
  for (let i = 1; i <= 20; i++) {
    const nombre = meal[`strIngredient${i}`];
    const cantidad = meal[`strMeasure${i}`];

    // Verificamos que el ingrediente no sea nulo ni esté vacío
    if (nombre && nombre.trim() !== "") {
      ingredientes.push({ 
        nombre: nombre.trim(), 
       cantidad: (cantidad && cantidad.trim() !== "") ? cantidad.trim() : "al gusto" 
      });
    }
  }
  console.log("Ingredientes extraidos", ingredientes);
  
  return ingredientes;
}

export default App;