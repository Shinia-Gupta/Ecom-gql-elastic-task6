import { Client } from "@elastic/elasticsearch";
import fs from 'fs';
import path from 'path'

const esClient = new Client({
  // node: "https://ef2926f25f934c8a8099e90e8b1d0fb4.us-central1.gcp.cloud.es.io:443",
  node: "https://f8f214de4940402f9d6228f1519f90cf.us-central1.gcp.cloud.es.io:443",
  auth: {
    username: "elastic",
    // password: "w1xYuwhuxgMSjrFnNUQTZuAd",
    password: "s3zqo9MNajHCfVnGZg5UD6qk",
  },
});


// Path to your JSON file
const filePath = path.join('C:', 'Downloads Shiniag2000', 'bestbuy_seo.json');

const bulkIndex = async () => {
  try {
    const bulkBody = [];
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Prepare bulk indexing body
    data.forEach((doc, idx) => {
      bulkBody.push({
        index: { _index: 'products', _id: doc.objectID || idx + 1 },
      });
      bulkBody.push(doc);
    });

    // Perform bulk indexing
    const bulkResponse = await esClient.bulk({ body: bulkBody });
    console.log("bulk response-",bulkResponse);

    if (bulkResponse.errors) {
      // Inspect errors in the response
      bulkResponse.items.forEach((item) => {
        if (item.index && item.index.error) {
          console.error(item.index.error);
        }
      });
    } else {
      console.log('Bulk indexing completed successfully');
    }
  } catch (error) {
    console.error('Error in bulk indexing:', error.message);
  }
};

// Execute the bulk indexing
bulkIndex();
