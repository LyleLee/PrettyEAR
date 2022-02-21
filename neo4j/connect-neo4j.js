const neo4j = require('neo4j-driver')

const driver = neo4j.driver('bolt://runarm.top', neo4j.auth.basic('neo4j', 'time2graph'));
const session = driver.session();


(async() => {

    try {
        const result = await session.run(
            'MATCH (n:Person) RETURN n'
        );

        const singleRecord = result.records[1];
        const node = singleRecord.get(0);

        console.log(node.properties.name);
        console.log(result.records);

    } finally {
        await session.close();
    }

    // on application exit:
    await driver.close();
})();