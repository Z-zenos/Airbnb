export default function QuantityChoice({
  max, value, onClick  
}) {
  const ROOMS_BEDS = [...Array(max + 1).keys()];
  let textAlterValue = '';

  return (
    <div className="flex justify-start gap-4 my-4">
      { ROOMS_BEDS.map(i => {
          if(i === 0) textAlterValue = 'Any';
          else if(i === max) textAlterValue = `${max}+`;
          else textAlterValue = i;
          return (
            <span 
              key={Date.now() + i}
              className={` transition-all border border-gray-300 cursor-pointer rounded-2xl py-2 px-4 ${value === i ? 'bg-[#222222] text-white border-[#222222]' : 'text-[#222222] hover:border-[#222222]'}`}
              onClick={() => onClick(i)}
            >
              {textAlterValue}
            </span>
          );
        }
      )}
    </div>
  );
}