export interface BookingDTO {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: {
      checkin: string;
      checkout: string;
    };
    additionalneeds?: string;
  }
  