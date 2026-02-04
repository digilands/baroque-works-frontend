import { Calendar, Clock, CreditCard, Wallet } from "lucide-react";
import { Financials } from "@/types/job";

interface SchedulePayCardProps {
  requestedDate: string;
  requestedTime: string;
  financials: Financials;
}

export function SchedulePayCard({ requestedDate, requestedTime, financials }: SchedulePayCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Wallet className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-gray-900">Schedule & Payment</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-center">
           <div className="flex items-center gap-2 text-gray-500 mb-1 text-xs font-medium uppercase tracking-wide">
             <Calendar className="w-4 h-4" />
             Date
           </div>
           <p className="font-semibold text-gray-900">{requestedDate}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-center">
           <div className="flex items-center gap-2 text-gray-500 mb-1 text-xs font-medium uppercase tracking-wide">
             <Clock className="w-4 h-4" />
             Time
           </div>
           <p className="font-semibold text-gray-900">{requestedTime}</p>
        </div>
      </div>

      <div className="space-y-3 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between text-gray-600 text-sm">
           <span>Service Rate</span>
           <span>₦{financials.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600 text-sm">
           <span>Service Fee</span>
           <span>₦{financials.serviceFee.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600 text-sm">
           <span>Tax</span>
           <span>₦{financials.tax.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-gray-900 font-bold text-lg pt-2 mt-2 border-t border-dashed border-gray-200">
           <span>Total Earnings</span>
           <span className="text-indigo-600">₦{financials.total.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg">
        <CreditCard className="w-4 h-4 text-gray-400" />
        <span>Payment secured via Escrow</span>
      </div>
    </div>
  );
}
