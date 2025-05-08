import { Link } from 'react-router-dom';

const BarraPesquisa = ({ placeholder, label, type, name, value, onChange, onClick }) => {
    const url = '/Resultado?busca=' + value;
    return (
      <div className="flex">
        <label className="block text-lime-600 text-sm font-medium">{label}</label>
        <input
          placeholder={placeholder}
          type={type}
          name={name}
          value={value}
          onChange={onChange} // Adicionando o onChange para capturar as mudanças
          className="px-2.5 py-1.5 rounded-l-md bg-stone-700 text-white placeholder-gray-300 focus:outline-none text-sm"
        />
        <Link to={url} >
          <button
            onClick={onClick}
            className="px-3 py-1.5 bg-lime-600 text-white font-semibold rounded-r-md hover:bg-lime-500 transition text-sm mr-1.5">
              Buscar
          </button>
        </Link>
      </div>
    );
  };

  export { BarraPesquisa };
  
