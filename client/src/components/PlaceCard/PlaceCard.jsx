import { AiFillStar } from 'react-icons/ai';
import { FaLocationDot, FaRegHeart, FaHeart } from 'react-icons/fa6';
import { BsCalendarHeart } from 'react-icons/bs';
import Carousel from '../Carousel/Carousel';
import { Link } from 'react-router-dom';
import './PlaceCard.css';
import { useContext, useState } from 'react';
import { IntlContext } from '../../contexts/intl.context';
import axios from 'axios';
import { UserContext } from '../../contexts/user.context';

export default function PlaceCard({ place, className }) {
    const { formatCurrency } = useContext(IntlContext);
    const { user, setUser } = useContext(UserContext);
    const [heart, setHeart] = useState(user?.wishlists?.includes(place?._id));

    async function handleUpdateWishlists() {
      try {
        setHeart(!heart);
        const res = await axios.patch(`/users/wishlists`, {
          place_id: place?._id,
          state: heart ? 'unheart' : 'heart',
        });

        setUser(res.data.data.user);
      } catch (err) {
        setHeart(user?.wishlists?.includes(place?._id));
      }
    }

    if (!place.name) return;
    return (
      <div className={`w-[270px] my-6 cursor-pointer ${className}`}>
        <div className="relative rounded-lg w-full h-[260px]">
          <div className="absolute right-4 top-4 z-[1]">
            {heart ? (
              <FaHeart
                className={`w-5 h-5 text-primary transition-all active:scale-100`}
                onClick={async () => await handleUpdateWishlists()}
              />
            ) : (
              <FaRegHeart
                className={`w-5 h-5 hover:scale-110 transition-all active:scale-80`}
                onClick={async () => await handleUpdateWishlists()}
              />
            )}
          </div>
          <Carousel
            slides={[place.image_cover, ...place.images.slice(0, 4)]}
            imageClassName="h-[260px] object-cover aspect-video rounded-lg"
          />

          <Link
            to={`/users/profile/${place?.host?.id}`}
            className=" book-container absolute flex items-center justify-center shadow-[rgba(0,_0,_0,_0.16)_0px_3px_6px,_rgba(0,_0,_0,_0.23)_0px_3px_6px] left-3 bottom-3 rounded-md"
          >
            <div className="book">
              <img
                src={place?.host?.avatar}
                className="rounded-full w-12 h-12"
                alt="avatar host"
              />
            </div>
          </Link>
        </div>

        <Link to={`/places/${place.id}`}>
            <div className="mt-3">
                <p className="text-[17px] mb-1">
                    <span className="font-medium ">
                        <FaLocationDot
                            className="inline text-primary mr-1"
                            size={18}
                        />
                        {place.location.address}
                    </span>
                </p>
                <p className="opacity-90 text-[16px]">{place.name}</p>
                <p className="text-sm flex items-center">
                    <span>
                        <BsCalendarHeart className="text-green-500 mr-2" />
                    </span>
                    <span className="opacity-50 ">Nov 12 - 17</span>
                </p>
                <p className="text-sm font-light mt-2 flex justify-between items-center flex-wrap">
                    <span className="flex items-center">
                        {place.price_diff === place.price ? (
                            <span className="font-bold mx-2 text-xl text-primary">
                                {formatCurrency(place.price)}
                            </span>
                        ) : (
                            <>
                                <span className="line-through">
                                    {formatCurrency(place.price)}
                                </span>
                                <span className="font-bold mx-2 text-xl text-primary">
                                    {formatCurrency(place.price_diff)}
                                </span>
                            </>
                        )}
                        / night
                    </span>
                    <span className="font-light flex text-lg items-center">
                        <AiFillStar className="inline mr-1 text-yellow-300" />
                        {place.average_ratings}
                    </span>
                </p>
            </div>
        </Link>
      </div>
    );
}
