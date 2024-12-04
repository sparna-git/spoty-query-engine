const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const QueryEngineFactory = require('@comunica/query-sparql').QueryEngineFactory;



// see https://www.decodingweb.dev/await-is-only-valid-in-async-functions-node
(async () => {
	const myEngine = await new QueryEngineFactory().create({
	    // configPath: 'config/config.json', // Relative or absolute path 
	    configPath: 'config/config-spoty.json', // Relative or absolute path 
	});

	const bindingsStream = await myEngine.queryBindings(`
	  SELECT ?s ?p ?o WHERE {
	    ?s ?p ?o
	  } LIMIT 10`, {
	  sources: ['https://fragments.dbpedia.org/2015/en'],
	});

	bindingsStream.on('data', (binding) => {
	    console.log(binding.toString()); // Quick way to print bindings for testing

	    console.log(binding.has('s')); // Will be true
	    
	    // Obtaining values
	    console.log(binding.get('s').value);
	    console.log(binding.get('s').termType);
	    console.log(binding.get('p').value);
	    console.log(binding.get('o').value);
	});

	bindingsStream.on('end', () => {
	    // The data-listener will not be called anymore once we get here.
	    console.log("Query execution has ended !")
	});

	bindingsStream.on('error', (error) => {
	    console.error(error);
	});
})()