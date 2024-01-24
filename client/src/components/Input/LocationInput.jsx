import Select, { components } from 'react-select';
import useCountries from '../../hooks/useCountries';
import { GoLocation } from "react-icons/go";
import Input from './Input';
import { useRef, useState } from 'react';

export default function LocationInput({
  value, onChange
}) {
  const { getAll } = useCountries();
  const [isLoading, setIsLoading] = useState(false);

  const asyncGetCurrentPosition = options => new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });

  const handleLocationClick = async () => {
    setIsLoading(true);
    let {coords: {latitude, longitude}} = await asyncGetCurrentPosition();
    setIsLoading(false);
    return [latitude, longitude];
  }

  const selectMenuButton = (props) => {
    return (
      <components.MenuList {...props}>
        <p 
          className="flex items-center py-4 justify-center cursor-pointer"
          onClick={async () => {
            const latlng = await handleLocationClick();
            
            onChange({ 
              coordinates: latlng, 
              country: "My location",
              flag: "📍",
              region: `Nice place`,
              value: "ML",
              address: addressInputRef.current.value
            });
          }}
        >
          <GoLocation className='inline w-6 h-6 mr-1 text-primary' />
          <span className='font-light hover:underline'>Use my location</span>
        </p>
        <div className='mt-1'>{ props.children }</div>
      </components.MenuList>
    )
  };

  const addressInputRef = useRef(null);
  
  return (
    <>
      <Input 
        type="text" 
        label="Address" 
        value={value?.address} 
        onChange={() => onChange({ 
          ...value, 
          address: addressInputRef.current.value 
        })} 
        ref={addressInputRef} 
        className="rounded-lg "
      />
      <Select
        isLoading={isLoading}
        components={{ MenuList: selectMenuButton }}
        value={value?.value ? value : ""}
        placeholder={"Select anywhere"}
        isClearable
        options={getAll()}
        onChange={value => {
          setIsLoading(true);
          onChange({
            ...value, 
            address: addressInputRef.current.value
          });
          setTimeout(() => setIsLoading(false), 500);
        }}
        formatOptionLabel={option => (
          <div className="flex flex-row items-center gap-3">
            <div>{option.flag}</div>
            <div>
              {option.country}{option?.country ? ',' : ''}
              <span className="text-neutral-500 ml-1">
                {option.region}
              </span>
            </div>
          </div>
        )}
        className='relative cursor-pointer'

        classNames={{
          control: () => 'p-3 border-2 cursor-pointer',
          input: () => 'text-md cursor-pointer',
          option: () => 'text-md cursor-pointer',
        }}

        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: 'black',
            primary25: '#ffe4e6'
          }
        })}
      />
    </>
  );
}

