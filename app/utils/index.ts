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

export const sendExpoNotification = async(to: string, title: string, body: string): Promise<any> =>{
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to,
      title,
      body
    })
  });
  return response.json();
}
