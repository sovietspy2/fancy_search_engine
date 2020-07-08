var urlRegex = /(\b(https?|ftp|file||http):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

const randomTextWithUrls = `hello there https://www.test.com meg mas text http://www.google.com`;

console.log(randomTextWithUrls.match(urlRegex));