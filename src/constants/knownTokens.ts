export type KnownTokenMetadata = {
  name: string;
  symbol: string;
  image: string;
};

export const KNOWN_TOKENS: Record<string, KnownTokenMetadata> = {
  //STABLECOINS
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    name: "USD Coin",
    symbol: "USDC",
    image: "/tokenimages/usdc.png",
  },
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: {
    name: "Tether USD",
    symbol: "USDT",
    image: "/tokenimages/usdt.png",
  },
  "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo": {
    name: "PayPal USD",
    symbol: "PYUSD",
    image: "/tokenimages/pyusd.png",
  },
  USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB: {
    name: "World Liberty Financial USD",
    symbol: "USD1",
    image: "/tokenimages/usd1.png",
  },

  //COMMON TOKENS
  METvsvVRapdj9cFLzq4Tr43xK4tAjQfwX76z3n6mWQL: {
    name: "Meteora",
    symbol: "MET",
    image: "/tokenimages/meteora.svg",
  },
  rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof: {
    name: "Render Token",
    symbol: "RENDER",
    image: "/tokenimages/render.png",
  },
  "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv": {
    name: "Pudgy Penguins",
    symbol: "PENGU",
    image: "/tokenimages/pudgy.png",
  },
  JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN: {
    name: "Jupiter",
    symbol: "JUP",
    image: "/tokenimages/jup.png",
  },
  jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL: {
    name: "JITO",
    symbol: "JTO",
    image: "/tokenimages/jito.png",
  },
  "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ": {
    name: "Wormhole Token",
    symbol: "W",
    image: "/tokenimages/wormhole.png",
  },
  "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN": {
    name: "OFFICIAL TRUMP",
    symbol: "TRUMP",
    image: "/tokenimages/trump.png",
  },
  MEFNBXixkEbait3xn9bkm8WsJzXtVsaJEn4c8Sam21u: {
    name: "Magic Eden",
    symbol: "ME",
    image: "/tokenimages/me.png",
  },
  pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn: {
    name: "Pump",
    symbol: "PUMP",
    image: "/tokenimages/pump.png",
  },
  "27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4": {
    name: "Jupiter Perps LP",
    symbol: "JLP",
    image: "/tokenimages/jlp.png",
  },
  DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: {
    name: "Bonk",
    symbol: "Bonk",
    image: "/tokenimages/bonk.jpeg",
  },
  KMNo3nJsBXfcpJTVhZcXLW7RmTwTt4GVFE7suUBo9sS: {
    name: "Kamino",
    symbol: "KMNO",
    image: "/tokenimages/kamino.svg",
  },
  HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3: {
    name: "Pyth Network",
    symbol: "PYTH",
    image: "/tokenimages/pyth.svg",
  },
  "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R": {
    name: "Raydium",
    symbol: "RAY",
    image: "/raydium.png",
  },
  HrkKngiUavecwte1ZMrdt4H5Qet3cecNUzMoEAgjTAX8: {
    name: "Parabolic AI",
    symbol: "PAI",
    image: "/tokenimages/parabolic.png",
  },
  Dfh5DzRgSvvCFDoYc2ciTkMrbDfRKybA4SoFbPmApump: {
    name: "Pippin",
    symbol: "pippin",
    image: "/tokenimages/pippin.png",
  },
  EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm: {
    name: "dogwifhat",
    symbol: "WIF",
    image: "/tokenimages/wif.webp",
  },
  "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump": {
    name: "Fartcoin",
    symbol: "Fartcoin",
    image: "/tokenimages/fartcoin.png",
  },
  WETZjtprkDMCcUxPi9PfWnowMRZkiGGHDb9rABuRZ2U: {
    name: "HumidiFi",
    symbol: "WET",
    image: "/tokenimages/wet.jpg",
  },
  "7atgF8KQo4wJrD5ATGX7t1V2zVvykPJbFfNeVf1icFv1": {
    name: "catwifhat",
    symbol: "CWIF",
    image: "/tokenimages/cwif.webp",
  },
  orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE: {
    name: "Orca",
    symbol: "ORCA",
    image: "/tokenimages/orca.png",
  },

  //TOKENS WHICH REGULARLY GET BURNED
  PAYmo6moDF3Ro3X6bU2jwe2UdBnBhv8YjLgL1j4DxGu: {
    name: "PayAI",
    symbol: "PayAI",
    image: "/tokenimages/payai.jpeg",
  },
  Grass7B4RdKfBCjTKgSqnXkqjwiGvQyFbuSCUJr3XXjs: {
    name: "Grass",
    symbol: "GRASS",
    image: "/tokenimages/grass.png",
  },
  FJz7ptUR1FwxSHbb8Sfd5Cn6Zt4TqucJZKLqU4n66gdq: {
    name: "Mayflower",
    symbol: "MAY",
    image: "/tokenimages/mayflower.png",
  },
  BZLbGTNCSFfoth2GYDtwr7e4imWzpR5jqcUuGEwr646K: {
    name: "IO",
    symbol: "IO",
    image: "/tokenimages/io.png",
  },
  "5tB5D6DGJMxxHYmNkfJNG237x6pZGEwTzGpUUh62yQJ7": {
    name: "ROA CORE",
    symbol: "ROA",
    image: "/tokenimages/roa.webp",
  },
  CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump: {
    name: "Goatseus Maximus",
    symbol: "GOAT",
    image: "/tokenimages/goat.jpeg",
  },
  HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC: {
    name: "ai16z",
    symbol: "ai16z",
    image: "/tokenimages/ai16z.png",
  },
  BJqV6DGuHY8U8KYpBGHVV74YMjJYHdYMPfb1g7dppump: {
    name: "ROACHY",
    symbol: "ROACHY",
    image: "/tokenimages/roachy.jpeg",
  },
  x95HN3DWvbfCBtTjGm587z8suK3ec6cwQwgZNLbWKyp: {
    name: "Hachiko",
    symbol: "$HACHI",
    image: "/tokenimages/hachi.jpeg",
  },
  VVWAy5U2KFd1p8AdchjUxqaJbZPBeP5vUQRZtAy8hyc: {
    name: "Flip gg | #1 Lootbox Game",
    symbol: "Flipgg",
    image: "/tokenimages/flipgg.png",
  },
};
