import Image from "next/image"
import img from './background.jpg';

export const Background = () => {
  return (
    <div className="absolute inset-0">
      <Image src={img} alt="" fill className="object-center object-cover"/>
    </div>
  )
}