import { useState } from "react";
import Button from "../components/Button/Button";
import { MdComputer } from "react-icons/md";
import { GoShieldLock } from "react-icons/go";
import { GiCheckedShield } from "react-icons/gi";
import { TbShieldHeart } from "react-icons/tb";

const tabs = [
  'login',
  'login requests',
  'shared access'
];

export default function SecurityPage() {
  const [tab, setTab] = useState(tabs[0]);

  const loginTab = (
    <div>
      {/* LOGIN */}
      <div className="border-b border-b-gray-200 py-6">
        <h3 className="text-2xl font-semibold mb-10">Login</h3>
        <div className="flex justify-between font-light items-start">
          <div>
            <p className="font-medium">Password</p>
            <p className="text-[15px]">Last updated 3 months ago</p>
          </div>

          <div className="text-secondary text-md font-semibold cursor-pointer hover:underline transition-all" onClick={() => {}}>
            Update
          </div>
        </div>
      </div>

      {/* SOCIALS ACCOUNTS */}
      <div className="border-b border-b-gray-200 py-6">
        <h3 className="text-2xl font-semibold mb-10">Socials accounts</h3>
        <div className="flex justify-between font-light items-start">
          <div>
            <p className="font-medium">Facebook</p>
            <p className="text-[15px]">Not connected</p>
          </div>

          <div className="text-secondary text-md font-semibold cursor-pointer hover:underline transition-all" onClick={() => {}}>
            Connect
          </div>
        </div>

        <div className="flex justify-between font-light items-start mt-6">
          <div>
            <p className="font-medium">Google</p>
            <p className="text-[15px]">Not connected</p>
          </div>

          <div className="text-secondary text-md font-semibold cursor-pointer hover:underline transition-all" onClick={() => {}}>
            Connect
          </div>
        </div>
      </div>

      {/* DEVICE HISTORY */}
      <div className="border-b border-b-gray-200 py-6">
        <h3 className="text-2xl font-semibold mb-10">Device history</h3>
        <div className="flex justify-between font-light items-start">
          <div>
            <MdComputer className="w-[60px] h-[60px]" />
          </div>
          <div>
            <p className="font-medium">Session</p>
            <p className="text-[15px]">September 14, 2023 at 23:57</p>
          </div>

          <div className="text-secondary text-md font-semibold cursor-pointer hover:underline transition-all" onClick={() => {}}>
            Log out device
          </div>
        </div>
      </div>
    </div>
  );

  const loginRequestsTab = (
    <div>
      <p className="text-2xl font-semibold">Login requests</p>
      <p className="font-light mt-4">
        Team members may have to enter a verification code when they log in to this account for the first time. Approve or decline their login requests on this page.
      </p>

      <div className="py-6 font-medium text-lg border-b border-b-300">Pending requests</div>
      <div className="py-6 font-medium text-lg border-b border-b-300">Approved requests</div>
      <div className="py-6 font-medium text-lg border-b border-b-300">Satisfied requests</div>
      <div className="py-6 font-medium text-lg border-b border-b-300">Declined requests</div>
    </div>
  );

  const sharedAccessTab = (
    <div>
      <p className="text-2xl font-semibold">Shared access</p>
      <p className="font-light mt-4">
        Review each request carefully before approving access. We’ll email your employee or co-worker a 4-digit code that lets them log into your account with their trusted device.
      </p>
    </div>
  );

  return (
    <div className="2xl:w-[70%] xl:w-[80%] lg:w-[80%] md:w-[100%] sm:block mx-auto md:px-10 mb-10 ">
      <h2 className="font-medium text-3xl my-10">Login & security</h2>
      <div className="md:grid md:grid-cols-5 gap-20 py-10">
        <div className="col-span-3">
          <div className="flex items-center gap-5 border-b mb-10 border-b-gray-300">
            { tabs.map((tb, i) => (
              <div 
                key={tabs[i]}
                onClick={() => setTab(tabs[i])}
                className={` 
                  border-b-2 text-md uppercase
                  h-full py-2 font-medium
                  cursor-pointer
                  ${tb === tab 
                    ? 'text-secondary border-b-secondary' 
                    : ' border-b-transparent'}
                `}
              >
                {tb}
              </div>
            )) }
          </div>

          <div>
            { tab === tabs[0] && loginTab }
            { tab === tabs[1] && loginRequestsTab }
            { tab === tabs[2] && sharedAccessTab }
          </div>
        </div>

        <div className="col-span-2">
          <div className="border border-gary-300 rounded-xl p-6">
            { tab === tabs[0] && 
              <>
                <GoShieldLock className="w-[40px] h-[40px] text-secondary" />
                <p className="font-medium text-lg mt-4">Let&lsquo;s make your account more secure</p>
                <p className=" font-semibold my-4">
                  Your account security: <span className="text-gray-500">LOW</span>
                </p>
                <p className="opacity-60 font-light">We’re always working on ways to increase safety in our community. That’s why we look at every account to make sure it’s as secure as possible.</p>
    
                <Button label="Improve" className="mt-8 bg-secondary border-secondary hover:bg-white hover:text-secondary px-6"/>
              </>
            }
            { tab === tabs[1] && 
              <>
                <GiCheckedShield className="w-[40px] h-[40px] text-secondary" />
                <p className="font-medium text-lg mt-4">Keep your account secure</p>
                <p className="opacity-60 mt-4 font-light">Only respond to requests from people you know. Hackers might want to access your account by mimicking a team member&apos;s email.</p>
              </>
            }
            { tab === tabs[2] && 
              <>
                <TbShieldHeart className="w-[40px] h-[40px] text-secondary" />
                <p className="font-medium text-lg mt-4">Adding devices from people you trust</p>
                <p className="opacity-60 mt-4 font-light">When you approve a request, you grant someone full access to your account. They’ll be able to change reservations and send messages on your behalf.</p>
              </>
            }
          </div>
        </div>
        </div>
    </div>
  );
}