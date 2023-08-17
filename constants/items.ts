import * as Crypto from 'expo-crypto';

export const categoryArr = ["Food", "Utensils", "Cash", "Wears", "Furnitures", "Gadgets"]
export const statusArr=[
    {
        statusCode: 0,
        name: "Available"
    },
    {
        statusCode: 1,
        name: "Paired"
    },
    {
        statusCode: 2,
        name: "Rejected"
    },
    {
        statusCode: 3,
        name: "Delivered"
    },
]
export const itemsArray = [
    {
        id: Crypto.randomUUID(),
        category: categoryArr[0],
        name:"Rice",
        imageUrl: ["https://picsum.photos/200", "https://picsum.photos/200", "https://picsum.photos/200",],
        pickupAddress:"No 5, Ade stree, Lagos",
        donor: `SHA${Crypto.randomUUID()}`,
        status: statusArr[0].name,
        reciever: `SHA${Crypto.randomUUID()}`,
        location:'LA',
        interestedParties: [`SHA${Crypto.randomUUID()}`,`SHA${Crypto.randomUUID()}`,`SHA${Crypto.randomUUID()}`,`SHA${Crypto.randomUUID()}`]
    },
    {
        id: Crypto.randomUUID(),
        category: categoryArr[1],
        name:"Bread Toaster",
        imageUrl: ["https://picsum.photos/200", "https://picsum.photos/200", "https://picsum.photos/200",],
        pickupAddress:"No 5, Ade stree, Lagos",
        donor: `SHA${Crypto.randomUUID()}`,
        status: statusArr[0].name,
        reciever: `SHA${Crypto.randomUUID()}`,
        location:'LA',
        interestedParties: [`SHA${Crypto.randomUUID()}`,`SHA${Crypto.randomUUID()}`,`SHA${Crypto.randomUUID()}`,`SHA${Crypto.randomUUID()}`]
    },
    {
        id: Crypto.randomUUID(),
        category: categoryArr[0],
        name:"A bucket of Tomatoes",
        imageUrl: ["https://picsum.photos/200", "https://picsum.photos/200", "https://picsum.photos/200",],
        pickupAddress:"No 5, Ade stree, Lagos",
        donor: `SHA${Crypto.randomUUID()}`,
        status: statusArr[0].name,
        reciever: `SHA${Crypto.randomUUID()}`,
        location:'LA',
        interestedParties: [`SHA${Crypto.randomUUID()}`,`SHA${Crypto.randomUUID()}`,`SHA${Crypto.randomUUID()}`,`SHA${Crypto.randomUUID()}`]
    }
]