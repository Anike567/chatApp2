const connectionPool = require('./../config/connection');

const from = '2bda579b-5e36-11f0-b856-74d83e3418cc';
const to = '8084b5cf-5fb2-11f0-90d3-74d83e3418cc';

const query = `
  SELECT * FROM message 
  WHERE (\`from\` = ? AND \`to\` = ?) 
     OR (\`from\` = ? AND \`to\` = ?)
`;

connectionPool.query(query, [from, to, to, from], (error, results) => {
    if (error) {
        console.error(error);
    } else {
        console.log(results.length);  
    }
});
