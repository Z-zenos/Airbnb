import { BsFilePerson, BsPersonVcard } from "react-icons/bs";
import { MdSecurity, MdOutlinePayment } from "react-icons/md";
import { GrNotification } from "react-icons/gr";
import { TbLockSquareRounded } from "react-icons/tb";
import { GiSettingsKnobs } from "react-icons/gi";

const settings = [
  {
    icon: <BsFilePerson size={32} />,
    title: 'Profile',
    description: 'Custom your account with fun things',
    link: '',
  },
  {
    icon: <BsPersonVcard size={32} />,
    title: 'Personal info',
    description: 'Provide personal details and how we can reach you',
    link: '',
  },
  {
    icon: <MdSecurity size={32} />,
    title: 'Login & security',
    description: 'Update your password and secure your account',
    link: '',
  },
  {
    icon: <MdOutlinePayment size={32} />,
    title: 'Payments & payouts',
    description: 'Review payments, payouts, coupons, and gift cards',
    link: '',
  },
  {
    icon: <GrNotification size={32} />,
    title: 'Notifications',
    description: 'Choose notification preferences and how you want to be contacted',
    link: '',
  },
  {
    icon: <GiSettingsKnobs size={32} />,
    title: 'Global preferences',
    description: 'Set your default language, currency, and timezone',
    link: '',
  },
  {
    icon: <TbLockSquareRounded size={32} />,
    title: 'Deactivate',
    description: 'Need to deactivate your account? Take care of that now',
    link: '',
  }
];

const SettingCard = ({setting}) => (
  <div className="py-5 px-4 flex justify-start flex-col items-start shadow-[rgba(0,_0,_0,_0.12)_0px_6px_16px_0px] rounded-lg bg-white cursor-pointer min-h-[160px]">
    {setting.icon}
    <p className="font-medium text-[16px] mt-6">{setting.title}</p>
    <p className="font-light opacity-60 text-[14px]">{setting.description}</p>
  </div>
);

export default function AccountSettingPage() {

  return (
    <div className="2xl:w-[70%] md:w-[80%] sm:block mx-auto md:px-10 mb-10 p-10">
      <div className="font-light mb-10">
        <h3 className="font-bold text-3xl mb-2">Account</h3>
        <p>
          <span className="font-medium text-xl">Zenos, </span>
          <span>hoanganhtuanbk2001@gmail.com</span>
        </p>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
        { settings.map(setting => <div key={setting.title}>
            <SettingCard setting={setting} />
          </div>
        )}
      </div>
    </div>
  )
}