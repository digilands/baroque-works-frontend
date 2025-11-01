import SignupForm from "@/app/ui/SignupForm";
import Swiper from "@/app/ui/Swiper";
export default function Signup() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
        <div className="flex-1 flex justify-center items-center">
        <SignupForm />
      </div>

      <div className="hidden md:flex flex-1 items-center justify-center flex-col bg-white pr-[4rem]">
     
        <div className="w-full  ">
       <Swiper/>
        </div>
        <h1 className="text-[2rem] text-text text-center">Fix it fast with trusted hands</h1>
      <p className="text-[1rem] text-[#403F3F] text-center leading-5">Find and book skilled handymen for plumbing, <br/> carpentry, painting, and more — all in one simple app.</p>
      </div>
    </div>
  )
}
