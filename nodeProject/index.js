const fs = require('fs');
const http = require('http');
const url = require('url');
const json = fs.readFileSync(`${__dirname}/data/data.json`,'utf-8');
const laptopData = JSON.parse(json);


const server = http.createServer((req,res) => {
	const pathname = url.parse(req.url, true).pathname;
	const query = url.parse(req.url, true).query;
	const id = url.parse(req.url, true).query.id;
	//products
	if(pathname === '/products' || pathname === '/'){
		res.writeHead(200, {'Content-type' : 'text/html'});
		fs.readFile(`${__dirname}/templates/template-overview.html`,'utf-8', (error, data) => {
			let overview = data;
			fs.readFile(`${__dirname}/templates/template-cards.html`,'utf-8', (error, data) => {
				const cards = laptopData.map(el => replaceTemplate(data, el)).join('');
				overview = overview.replace(/{%CARDS%}/g, cards);
				res.end(overview);
			});
		});
	//routes for one product
	}else if(pathname === '/laptop' && id < laptopData.length){
		res.writeHead(200, {'Content-type' : 'text/html'});
		fs.readFile(`${__dirname}/templates/template-laptop.html`,'utf-8', (error, data) => {
			const laptop = laptopData[id];
			const output = replaceTemplate(data, laptop);
			res.end(output);
		});

	}
	//routes for images
	else if((/\.(jpg|jpeg|png|gif)$/i).test(pathname)){
		fs.readFile(`${__dirname}/data/img/${pathname}`, (err, data) => {
			res.writeHead(200, {'Content-type' : 'image/jpg'});
			res.end(data);
		});
	}
	//not found
	else{
		res.writeHead(404, {'Content-type' : 'text/html'});
		res.end('URL not found!');
	}
});

server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for requests now');
});

function replaceTemplate(originalHTML, laptop){
	let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName);
	output = output.replace(/{%IMAGE%}/g, laptop.image);
	output = output.replace(/{%PRICE%}/g, laptop.price);
	output = output.replace(/{%SCREEN%}/g, laptop.screen);
	output = output.replace(/{%CPU%}/g, laptop.cpu);
	output = output.replace(/{%STORAGE%}/g, laptop.storage);
	output = output.replace(/{%RAM%}/g, laptop.ram);
	output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
	output = output.replace(/{%ID%}/g, laptop.id);
	return output;

}