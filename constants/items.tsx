import * as Crypto from "expo-crypto";
import {
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";

import { primaryRed, primaryYellow } from "./Colors";

export const categoryArr = [
  {
    id: Crypto.randomUUID(),
    category: null,
    icon: <AntDesign name="CodeSandbox" size={24} color={primaryYellow} />,
  },
  {
    id: Crypto.randomUUID(),
    category: "Food",
    icon: (
      <MaterialCommunityIcons name="food-turkey" size={24} color={primaryYellow} />
    ),
  },
  {
    id: Crypto.randomUUID(),
    category: "Utensils",
    icon: <FontAwesome5 name="utensils" size={24} color={primaryYellow} />,
  },
  {
    id: Crypto.randomUUID(),
    category: "Wears",
    icon: <Ionicons name="ios-watch" size={24} color={primaryYellow} />,
  },
  {
    id: Crypto.randomUUID(),
    category: "Cash",
    icon: (
      <MaterialCommunityIcons
        name="piggy-bank-outline"
        size={24}
        color={primaryYellow}
      />
    ),
  },
  {
    id: Crypto.randomUUID(),
    category: "Gadgets",
    icon: (
      <MaterialCommunityIcons
        name="monitor-cellphone"
        size={24}
        color={primaryYellow}
      />
    ),
  },
  {
    id: Crypto.randomUUID(),
    category: "Furnitures",
    icon: (
      <MaterialCommunityIcons
        name="table-furniture"
        size={24}
        color={primaryYellow}
      />
    ),
  },
  {
    id: Crypto.randomUUID(),
    category: "Others",
    icon: <AntDesign name="questioncircle" size={24} color={primaryYellow} />,
  },
];

export const statusArr = [
  {
    statusCode: 0,
    name: "Available",
  },
  {
    statusCode: 1,
    name: "Paired",
  },
  {
    statusCode: 2,
    name: "Rejected",
  },
  {
    statusCode: 3,
    name: "Delivered",
  },
];

export const itemsArray = [
  {
    id: Crypto.randomUUID(),
    category: categoryArr[0],
    name: "Rice",
    imageUrl: [
      "https://upload.wikimedia.org/wikipedia/commons/6/60/OpenEuphoria_mascot_200px.png",
      "https://vignette4.wikia.nocookie.net/simpsons/images/0/01/200px-Langdon_Alger.png/revision/latest?cb=20120815160236",
      "https://picsum.photos/200",
    ],
    pickupAddress: "No 5, Ade stree, Lagos",
    donor: `SHA${Crypto.randomUUID()}`,
    status: statusArr[0].name,
    reciever: `SHA${Crypto.randomUUID()}`,
    location: "LA",
    interestedParties: [
      `SHA${Crypto.randomUUID()}`,
      `SHA${Crypto.randomUUID()}`,
      `SHA${Crypto.randomUUID()}`,
      `SHA${Crypto.randomUUID()}`,
    ],
  },
  {
    id: Crypto.randomUUID(),
    category: categoryArr[1],
    name: "Bread Toaster",
    imageUrl: [
      "https://vignette4.wikia.nocookie.net/simpsons/images/0/01/200px-Langdon_Alger.png/revision/latest?cb=20120815160236",
      "https://picsum.photos/200",
      "https://picsum.photos/200",
    ],
    pickupAddress: "No 5, Ade stree, Lagos",
    donor: `SHA${Crypto.randomUUID()}`,
    status: statusArr[0].name,
    reciever: `SHA${Crypto.randomUUID()}`,
    location: "LA",
    interestedParties: [
      `SHA${Crypto.randomUUID()}`,
      `SHA${Crypto.randomUUID()}`,
      `SHA${Crypto.randomUUID()}`,
      `SHA${Crypto.randomUUID()}`,
    ],
  },
  {
    id: Crypto.randomUUID(),
    category: categoryArr[0],
    name: "A bucket of Tomatoes",
    imageUrl: [
      "https://picsum.photos/200",
      "https://picsum.photos/200",
      "https://picsum.photos/200",
    ],
    pickupAddress: "No 5, Ade stree, Lagos",
    donor: `SHA${Crypto.randomUUID()}`,
    status: statusArr[0].name,
    reciever: `SHA${Crypto.randomUUID()}`,
    location: "LA",
    interestedParties: [
      `SHA${Crypto.randomUUID()}`,
      `SHA${Crypto.randomUUID()}`,
      `SHA${Crypto.randomUUID()}`,
      `SHA${Crypto.randomUUID()}`,
    ],
  },
];
