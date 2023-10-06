import { useState } from "react";
import {BsFillArrowRightCircleFill, BsFillArrowLeftCircleFill} from "react-icons/bs";

export default function Carousel({ slides, imageClassName }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const previousSide = () => {
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  const nextSlide = () => {
    setCurrentSlide((currentSlide === slides.length - 1) ? 0 : currentSlide + 1);
  };

  return (
    <div className="overflow-hidden relative hover:[&_.buttons]:opacity-100 ">
      <div 
        className="flex transition ease-out duration-300"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`
        }}
      >
        { slides.length && slides.map((s, i) => {
          return <img className={imageClassName} src={`http://localhost:3000/images/places/${s}`} key={'img' + i} />;
        }) }
      </div>

      <div className="buttons absolute top-0 h-full w-full justify-between items-center flex text-white px-4 text-2xl opacity-0">
        <button onClick={previousSide}>
          <BsFillArrowLeftCircleFill />
        </button>

        <button onClick={nextSlide}>
          <BsFillArrowRightCircleFill />
        </button>
      </div>

      <div className="absolute bottom-0 py-4 flex justify-center gap-2 w-full">
        {slides.length && slides.map((s, i) => {
          return (
            <div
              onClick={() => setCurrentSlide(i)}
              key={"circle" + i}
              className={`rounded-full w-[6px] h-[6px] cursor-pointer  ${
                i == currentSlide ? "bg-white" : "bg-[#d7d7d6]"
              }`}
            ></div>
          );
        })}
      </div>

    </div>
  );
}