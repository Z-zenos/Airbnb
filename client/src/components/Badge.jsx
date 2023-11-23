import { GoAlert } from "react-icons/go";

const typeList = {
  alert: {
    border: 'border-red-400',
    color: 'text-red-700',
    bg: 'bg-red-100',
    icon: <GoAlert size={40} />,
    title: 'Alert!',
    role: 'alert'
  },
}

export default function Badge({ type, content }) {
  return (
    <div className={`${typeList[type].bg} border ${typeList[type].border} ${typeList[type].color} px-4 py-3 rounded relative flex justify-between items-center gap-4`} role={typeList[type].role}>
      <div>
        <strong className="font-bold mr-3">{typeList[type].title}</strong>
        <span className="block sm:inline">{content}</span>
      </div>
      {typeList[type].icon}
    </div>
  );
}