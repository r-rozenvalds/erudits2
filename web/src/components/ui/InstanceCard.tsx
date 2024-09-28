const InstanceCard = () => {
  return (
    <div className="bg-black bg-opacity-25 h-72 p-6 rounded-md justify-between flex flex-col shadow-lg">
      <div>
        <h1 className="text-white text-3xl font-semibold">Spēles nosaukums</h1>
        <p className="text-white text-lg font-semibold">Izveidoja: x</p>
        <p className="text-white text-xl font-semibold">Spēles apraksts</p>
      </div>
      <button className="place-self-end w-28 h-10 bg-[#E63946] rounded-md shadow-lg text-white text-xl font-bold hover:bg-opacity-50 transition-all hover:cursor-pointer">
        Spēlēt
      </button>
    </div>
  );
};

export default InstanceCard;
