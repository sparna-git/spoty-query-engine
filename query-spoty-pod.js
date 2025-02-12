const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const QueryEngineFactory = require('@comunica/query-sparql').QueryEngineFactory;



// see https://www.decodingweb.dev/await-is-only-valid-in-async-functions-node
(async () => {
	const myEngine = await new QueryEngineFactory().create({
	    configPath: 'config/config-solid-default.json', // Relative or absolute path 
	});

	const loggingFetch = async (input, init) => {
	  console.log(`Requesting ${input} with ${JSON.stringify(init, null, 2)}`);
	  const response = await fetch(input, init);
	  console.log(`Got response ${JSON.stringify(response)}`);
	  return response;
	}

	const bindingsStream = await myEngine.queryBindings(`
	  SELECT ?token ?semantics WHERE {
  ?token a <https://w3id.org/SpOTy/ontology#Token>.
  ?token <https://w3id.org/SpOTy/ontology#semantics> ?semantics.
}
LIMIT 10`, {
	  sources: [
	  	"https://solid.champin.net/pa/spoty-demo/",
	  	// uncomment to add static files as sources
	  	// when uncommented, the query does not work anymore
	  	{ type: 'file', value: 'https://w3id.org/SpOTy/ontology' },
        { type: 'file', value: 'https://w3id.org/SpOTy/languages' }
	  ],

	  fetch: loggingFetch,
	});

	bindingsStream.on('data', (binding) => {
	    console.log(binding.toString()); // Quick way to print bindings for testing
	});

	bindingsStream.on('end', () => {
	    // The data-listener will not be called anymore once we get here.
	    console.log("Query execution has ended !")
	});

	bindingsStream.on('error', (error) => {
	    console.error(error);
	});
})()