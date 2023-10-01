import Select, { components } from 'react-select';
import useCountries from '../../hooks/useCountries';
import { GoLocation } from "react-icons/go";
import Input from './Input';
import { useRef } from 'react';

export default function LocationInput({
  value, onChange
}) {
  const { getAll } = useCountries();

  const asyncGetCurrentPosition = options => new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });

  const handleLocationClick = async () => {
    let {coords: {latitude, longitude}} = await asyncGetCurrentPosition();
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
              latlng: latlng, 
              label: "My location",
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
  console.log(value);

  return (
    <>
      <Input type="text" label="Address" value={value?.address} onChange={() => onChange({ ...value, address: addressInputRef.current.value })} ref={addressInputRef} className="rounded-lg "/>
      <Select
        components={{ MenuList: selectMenuButton }}
        placeholder="Anywhere"
        isClearable
        options={getAll()}
        value={value}
        onChange={value => onChange({...value, address: addressInputRef.current.value})}
        formatOptionLabel={option => (
          <div className="flex flex-row items-center gap-3">
            <div>{option.flag}</div>
            <div>
              {option.label}{option?.label ? ',' : ''}
              <span className="text-neutral-500 ml-1">
                {option.region}
              </span>
            </div>
          </div>
        )}
        className='relative'

        classNames={{
          control: () => 'p-3 border-2',
          input: () => 'text-md',
          option: () => 'text-md'
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

