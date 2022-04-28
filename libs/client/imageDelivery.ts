export default function ImageDelivery(id: string, kind?: "avatar") {
  if (kind === "avatar") {
    return `https://imagedelivery.net/eckzMTmKrj-QyR0rrfO7Fw/${id}/avatar`;
  }
  return `https://imagedelivery.net/eckzMTmKrj-QyR0rrfO7Fw/${id}/thumbnail`;
}
