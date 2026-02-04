import SignupForm from "@/app/ui/SignupForm";
import Swiper from "@/app/ui/Swiper";

export default function Signup() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Left Side: Form */}
      <div className="flex-1 flex justify-center items-center p-6 md:p-12 overflow-y-auto">
        <SignupForm />
      </div>

      {/* Right Side: Marketing/Carousel */}
      <div className="hidden md:flex flex-1 items-center justify-center flex-col bg-gray-50/50 p-12 border-l border-gray-100">
        <div className="w-full max-w-lg mb-12">
          <Swiper />
        </div>
        <div className="text-center space-y-4 max-w-md">
           <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">
             Fix it fast with <span className="text-indigo-600">trusted hands</span>
           </h1>
           <p className="text-gray-500 leading-relaxed font-medium">
             Find and book skilled handymen for plumbing, carpentry, painting, and more — all in one simple app.
           </p>
        </div>
      </div>
    </div>
  );
}
