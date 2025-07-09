export interface OrderItem {
    userId: string;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
}

interface Address {
    stateName: string;
    streetName: string;
    townName: string;
    countryName: string;
    zipcode: string;
    homeNumber: string;
    [key: string]: string; // To allow other optional address fields
}

export interface Order {
    id: string;
    userId: string;
    phone: string;
    address: Address;
    items: OrderItem[];
    deliveryStatus: "pending" | "shipped" | "completed" | "cancelled";
    totalAmount: number;
    paymentStatus: "pending" | "completed" | "failed";
    paymentIntentId: string;
    AttendantName?: string;
    userName?: string;
    orderTime: {
        seconds: number;
        nanoseconds: number;
    };
}
