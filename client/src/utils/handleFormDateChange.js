
export default function handleFormDataChange(event, setState) {
  const { name, value } = event.target;
  setState(prevFromData => ({ ...prevFromData, [name]: value }));
}