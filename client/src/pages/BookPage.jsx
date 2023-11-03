
export default function BookPage() {

  return (
    <div className="2xl:w-[70%] xl:w-[80%] lg:w-[80%] md:w-[100%] sm:block mx-auto md:px-10 mb-10 md:grid md:grid-cols-3 gap-[200px] p-10">
      <div className=" col-span-1">
        <p>Request to Book</p>
        <div className="text-[15px] p-6">
          <p className="font-medium">
            Good price.
          </p>
          <p className="font-light opacity-70">
            Your dates are ￥214 less than the avg. nightly rate over the last 3 months.
          </p>
        </div>
      </div>
      <div className=" col-span-2">
        <div className="fixed pt-8 sm:flex sm:justify-between sm:items-center sm:relative md:block">
          
        </div>
      </div>
    </div>
  )
}