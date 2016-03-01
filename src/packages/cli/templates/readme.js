export default (name) => {
  return `
# ${name}

## Installation

* \`git clone https://github.com/<this-repository>\`
* \`cd ${name}\`
* \`npm install\`

## Running / Development

* \`fw serve\`

## Testing

* \`fw test\`

## Further Reading / Useful Links

* [Chai](http://chaijs.com/) / [Mocha](http://mochajs.org/)
  `.substr(1).trim();
};
