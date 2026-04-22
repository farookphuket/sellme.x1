"use client";

import React, { useState } from 'react';
import {
  Search, Filter, Calendar, MapPin,
  ChevronRight, Info, CheckCircle, Clock,
  User, Phone, Mail, MoreHorizontal
} from 'lucide-react';




export default function BookingSidebarRight() {

  const [selectedBooking, setSelectedBooking] = useState<any>(null);

    /*
  const bookings = [
    { id: 'BK-7701', customer: 'John Smith', tour: 'Phuket Island Hopping', date: '12 Apr 2026', status: 'Confirmed', amount: '฿5,200' },
    { id: 'BK-7702', customer: 'Sarah Connor', tour: 'Chiang Mai Safari', date: '15 Apr 2026', status: 'Pending', amount: '฿3,400' },
    { id: 'BK-7703', customer: 'Michael Chen', tour: 'Bangkok Temple Tour', date: '18 Apr 2026', status: 'Confirmed', amount: '฿2,100' },
  ];
    */

return(
<>
<div className="w-6 ">
                <p>
this is มาจาก BookingSidebarRight
                </p>
            </div>
</>

);
}
