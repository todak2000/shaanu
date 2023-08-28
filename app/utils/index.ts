export const dateFormaterString = (dateString: string) => {
  const formattedDate = new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  return formattedDate;
};

export const splitString = (input: string | any): string[] => {
  return input.split(",");
};

export const maskString = (input: string): string => {
  if (input.length <= 10) {
    return "*".repeat(input.length);
  }
  const firstPart = "*".repeat(5);
  const lastPart = "*".repeat(5);
  const middlePart = input.slice(0, 10);
  return middlePart + lastPart;
};

export const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
