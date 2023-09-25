

export default function Heading({
  title, subtitle, center
}) {
  return (
    <div className={center ? 'text-center' : 'text-start'}>
      <div className="text-2xl font-bold">
        {title}
      </div>
      <div className="font-light text-sm text-neutral-500 mt-1">
        {subtitle}
      </div>
    </div>
  );
}