const CampoCadastro = ({ label, type, name, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-lime-600 text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange} // Adicionando o onChange para capturar as mudanças
        className="w-full p-2 border border-lime-800 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-800 focus:border-lime-800"
      />
    </div>
  );
};

export { CampoCadastro };
