const { error } = require('console');
const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

const replaceTemplate = require('./replaceTemplate');

///////////////////////////////////////////////////////

//-------------Synchronous behavior---------------
// const textIn = fs.readFileSync('./input.txt', 'utf-8');
// const write = `This is what we know about the avacado: ${textIn} created on ${Date.now()}`;
// const textOut = fs.writeFileSync('./output.txt', write);
// console.log(textIn);
// textOut;


//-------------Asynchronous behavior---------------
// fs.readFile('./input.txt', 'utf-8', (err, data1) => {
//     fs.readFile('./input.txt', 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.writeFile('./input.txt',`${data2}\n${data1}`, err => {
//         console.log('Your file has been written');
//     })
//     });
// });
// console.log('loading');
/////////////////////////////////////////////////////////////////
//----------------------------SERVER--------------------
// const replaceTemplate = (temp,product) => {
//     let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
//     output = output.replace(/{%IMAGE%}/g, product.image);
//     output = output.replace(/{%FROM%}/g, product.from);
//     output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
//     output = output.replace(/{%QUANTITY%}/g, product.quantity);
//     output = output.replace(/{%PRICE%}/g, product.price);
//     output = output.replace(/{%DESCRIPTION%}/g, product.description);
//     output = output.replace(/{%ID%}/g, product.id);

//     if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
//     return output;
// }


const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

console.log(slugify('Fresh Avocados', {lower: true}));
console.log(dataObj.map(el => slugify(el.productName, {lower: true})));




const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true);

    //Overview page
    if (pathname === '/overview' || pathname === '/') {

        res.writeHead(200, {
            'content-type': 'text/html'
        });

        const cardsHtml = dataObj.map(el => replaceTemplate(templateCard, el)).join('');
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    }

    //Product page
    else if (pathname === '/product') {
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        const product = dataObj[query.id];
        const output = replaceTemplate(templateProduct, product);

        res.end(output);
    }
    //API page
    else if (pathname === '/api') {

        res.writeHead(200, {
            'content-type': 'application/json'
        });
        // res.end(data);
    }
    //Not Found page
    else {
        res.writeHead(404, {
            'content-type': 'text/html'
        });
        res.end("Couldn't find the page you were looking for");
    }
});
server.listen(8000, '127.0.0.1', () => {
    console.log('Server started up on port 8000');
});