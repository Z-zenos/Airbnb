import UserCard from "../components/UserCard/UserCard";


export default function UserPage() {

  return (
    <div className="grid grid-cols-3">
      <div className=" col-span-1">
        <div>
          <UserCard />
        </div>
      </div>

      <div className=" col-span-2">
        <h3 className="font-bold text-4xl">About Golwen</h3>

        <div>
          
        </div>
      </div>

    </div>
  );
}