import { Client } from "@elastic/elasticsearch";

const esClient = new Client({
  node: "https://f8f214de4940402f9d6228f1519f90cf.us-central1.gcp.cloud.es.io:443",
  auth: {
    username: "elastic",
    password: "s3zqo9MNajHCfVnGZg5UD6qk",
  },
});

const resolvers = {
  Query: {
    getProducts: async (parent, { skip = 0, limit = 20 }, context, info) => {
      try {
        const response = await esClient.search({
          index: "products",
          from: skip,
          size: limit,
          body: {
            query: {
              match_all: {},
            },
          },
        });

        const resultCount = response.hits.total.value;
        const products = response.hits.hits.map(
          (hit) => hit._source
        );
        console.log("products...",response.hits.hits);

        return { products, resultCount };
      } catch (error) {
        console.error("Error fetching products:", error.message);
        throw new Error("Unable to fetch products");
      }
    },

   
    // searchProducts: async (
    //   parent,
    //   { term, skip = 0, limit = 10, filters, sort },
    //   context,
    //   info
    // ) => {
    //   try {
    //     const mustQueries = [
    //       {
    //         multi_match: {
    //           query: term,
    //           fields: [
    //             "name",
    //             "shortDescription",
    //             "manufacturer",
    //             "categories",
    //             "type",
    //           ],
    //         },
    //       },
    //     ];
    
    //     if (filters) {
    //       if (filters.categories?.length) {
    //         mustQueries.push({
    //           terms: { categories: filters.categories },
    //         });
    //       }
    //       if (filters.manufacturers?.length) {
    //         mustQueries.push({
    //           terms: { manufacturer: filters.manufacturers },
    //         });
    //       }
    //       if (filters.types?.length) {
    //         mustQueries.push({
    //           terms: { type: filters.types },
    //         });
    //       }
    //       if (filters.priceRanges?.length) {
    //         mustQueries.push({
    //           terms: { salePrice_range: filters.priceRanges },
    //         });
    //       }
    //     }
    
    //     const sortOptions = [];
    //     if (sort) {
    //       switch (sort.field) {
    //         case "salePrice":
    //           sortOptions.push({
    //             salePrice: sort.order === "ASC" ? "asc" : "desc",
    //           });
    //           break;
    //         case "bestSellingRank":
    //           sortOptions.push({
    //             bestSellingRank: sort.order === "ASC" ? "asc" : "desc",
    //           });
    //           break;
    //         case "customerReviewCount":
    //           sortOptions.push({
    //             customerReviewCount: sort.order === "ASC" ? "asc" : "desc",
    //           });
    //           break;
    //         default:
    //           break;
    //       }
    //     }
    
    //     const response = await esClient.search({
    //       index: "products_v2",
    //       from: skip,
    //       size: limit,
    //       body: {
    //         query: {
    //           bool: {
    //             must: mustQueries,
    //           },
    //         },
    //         sort: sortOptions,
    //         aggs: {
    //           uniqueCategories: {
    //             terms: { field: "categories.keyword" },
    //           },
    //           uniqueManufacturers: {
    //             terms: { field: "manufacturer.keyword" },
    //           },
    //           priceRanges: {
    //             terms: { field: "salePrice_range.keyword" },
    //           },
    //           type: {
    //             terms: { field: "type.keyword" },
    //           },
    //         },
    //       },
    //     });
    
    //     const resultCount = response.hits.total.value;
    //     const products = response.hits.hits.map(
    //       (hit) => hit._source
    //     );    
    // console.log("prods...",products);
    
    //     // Aggregation results
    //     const aggregations = response.aggregations;
    // console.log(response,"........resp");
    // console.log(aggregations,".........aggregate");
    
    //     const uniqueCategories = aggregations.uniqueCategories.buckets.map(bucket => bucket.key);
    //     const uniqueManufacturers = aggregations.uniqueManufacturers.buckets.map(bucket => bucket.key);
    //     const priceRanges = aggregations.priceRanges.buckets.map(bucket => bucket.key);
    //     const type = aggregations.type.buckets.map(bucket => bucket.key);
    // console.log(uniqueCategories,uniqueManufacturers,priceRanges,type);
    
    //     return {
    //       products,
    //       uniqueCategories,
    //       uniqueManufacturers,
    //       priceRanges,
    //       type,
    //       resultCount,
    //     };
    //   } catch (error) {
    //     console.error("Error searching products:", error);
    //     throw new Error("Unable to search products");
    //   }
    // },

    searchProducts: async (
      parent,
      { term, skip = 0, limit = 10, filters, sort },
      context,
      info
    ) => {
      try {
        const mustQueries = [
          {
            multi_match: {
              query: term,
              fields: [
                "name",
                "shortDescription",
                "manufacturer",
                "categories",
                "type",
              ],
            },
          },
        ];
    
        if (filters) {
          if (filters.categories?.length) {
            mustQueries.push({
              terms: { "categories.keyword": filters.categories },
            });
          }
          if (filters.manufacturers?.length) {
            mustQueries.push({
              terms: { "manufacturer.keyword": filters.manufacturers },
            });
          }
          if (filters.types?.length) {
            mustQueries.push({
              terms: { "type.keyword": filters.types },
            });
          }
          if (filters.priceRanges?.length) {
            mustQueries.push({
              terms: { "salePrice_range.keyword": filters.priceRanges },
            });
          }
        }
    
        const sortOptions = [];
        if (sort) {
          switch (sort.field) {
            case "salePrice":
              sortOptions.push({
                salePrice: sort.order === "ASC" ? "asc" : "desc",
              });
              break;
            case "bestSellingRank":
              sortOptions.push({
                bestSellingRank: sort.order === "ASC" ? "asc" : "desc",
              });
              break;
            case "customerReviewCount":
              sortOptions.push({
                customerReviewCount: sort.order === "ASC" ? "asc" : "desc",
              });
              break;
            default:
              break;
          }
        }
    
        const response = await esClient.search({
          index: "products",
          body: {
            query: {
              bool: {
                must: mustQueries,
              },
            },
            aggs: {
              uniqueCategories: {
                terms: { field: "categories.keyword" },
              },
              uniqueManufacturers: {
                terms: { field: "manufacturer.keyword" },
              },
              priceRanges: {
                terms: { field: "salePrice_range.keyword" },
              },
              type: {
                terms: { field: "type.keyword" },
              },
            },
            sort: sortOptions,
            from: skip,
            size: limit,
          },
        });
    
        const resultCount = response.hits.total.value;
        const products = response.hits.hits.map(
          (hit) => hit._source
        );
    
        // Aggregation results
        const aggregations = response.aggregations;
    
        const uniqueCategories = aggregations.uniqueCategories.buckets.map(bucket => bucket.key);
        const uniqueManufacturers = aggregations.uniqueManufacturers.buckets.map(bucket => bucket.key);
        const priceRanges = aggregations.priceRanges.buckets.map(bucket => bucket.key);
        const type = aggregations.type.buckets.map(bucket => bucket.key);
        // console.log(uniqueCategories,uniqueManufacturers,priceRanges,type);

        return {
          products,
          uniqueCategories,
          uniqueManufacturers,
          priceRanges,
          type,
          resultCount,
        };
      } catch (error) {
        console.error("Error searching products:", error);
        throw new Error("Unable to search products");
      }
    },
    
    
  },
};

export default resolvers;
