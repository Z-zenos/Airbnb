
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function PlaceCardSkeleton({cards}) {
  return (
    <>
      { [...Array(cards).keys()].map(card => (
        <div key={card} className="w-[270px] my-6 cursor-pointer">
          <div className="rounded-lg w-[270px] h-[260px]">
            <Skeleton className="h-[260px] w-full rounded-lg" />
          </div>

          <div className="mt-3">
            <p className="text-[17px] mb-1">
              <span className="font-medium ">
                <Skeleton />
              </span>
            </p>
            <p className="opacity-90 text-[16px]">
              <Skeleton className='w-[100px]' />
            </p>
            <p className="text-sm flex items-center">
              <span className="opacity-50 "><Skeleton className='w-[150px]' /></span>
            </p>
            <p className="text-sm font-light mt-2 flex justify-between items-center">
              <span className="flex items-center">
                <span className="font-bold mx-2 text-xl text-primary">
                  <Skeleton className='w-[200px]' />
                </span> 
              </span> 
              <span className="font-light flex text-lg items-center">
                <Skeleton className='w-[50px]' />
              </span>  
            </p>
          </div>
        </div>
      )) }
    </>
  );
}