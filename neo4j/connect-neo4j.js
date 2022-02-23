const neo4j = require('neo4j-driver')

const driver = neo4j.driver('neo4j://runarm.top', neo4j.auth.basic('neo4j', 'time2graph'));
const session = driver.session();


(async() => {

    try {

        const deleteResult = await session.run(
            "MATCH (n) DETACH DELETE n"
        );
        console.log('deleting ', deleteResult.records.map(record => record.get(0)));
        const createResult1 = await session.run(
            "CREATE (ee:Person {name: 'Emil', from: 'Sweden', kloutScore: 99});"
        );
        console.log('creating ', createResult1.records.map(record => record.get(0)));

        const createResult2 = await session.run(

            "MATCH (ee:Person) WHERE ee.name = 'Emil' \
            CREATE (js:Person { name: 'Johan', from: 'Sweden', learn: 'surfing' }), \
            (ir:Person { name: 'Ian', from: 'England', title: 'author' }), \
            (rvb:Person { name: 'Rik', from: 'Belgium', pet: 'Orval' }), \
            (ally:Person { name: 'Allison', from: 'California', hobby: 'surfing' }), \
            (ee)-[:KNOWS {since: 2001}]->(js),(ee)-[:KNOWS {rating: 5}]->(ir), \
            (js)-[:KNOWS]->(ir),(js)-[:KNOWS]->(rvb), \
            (ir)-[:KNOWS]->(js),(ir)-[:KNOWS]->(ally), \
            (rvb)-[:KNOWS]->(ally)"
        );
        console.log('creating ', createResult2.records.map(record => record.get(0)));

        const result = await session.run(
            'MATCH (n:Person) RETURN n'
        );

        let i = 0;
        console.log("how many records: ", result.records.length);
        console.log("records key", result.records.keys);
        result.records.map(record => {
            console.log(i++, record.get('n').properties.name);
            console.log(record.get('n'));
        });

    } finally {
        await session.close();
    }

    // on application exit:
    await driver.close();
})();