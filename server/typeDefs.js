import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Product {
    
    name: String!
    shortDescription: String!
    bestSellingRank: Int!
    thumbnailImage: String!
    salePrice: Float!
    manufacturer: String!
    url: String!
    type: String!
    image: String
    customerReviewCount: Int
    shipping: String!
    salePrice_range: String!
    objectID: String!
    categories: [String!]!
  }

  type SearchResult {
    products: [Product]
    uniqueCategories: [String]!
    uniqueManufacturers: [String]!
    priceRanges: [String]!
    type: [String]!
    resultCount: Int
  }
  type ProductResult {
    products: [Product!]!
    resultCount: Int
  }
  input FilterInput {
    categories: [String]
    manufacturers: [String]
    types: [String]
    priceRanges: [String]
  }
  enum SortOrder {
    ASC
    DESC
  }

  input SortInput {
    field: String!
    order: SortOrder!
  }

  type Query {
    getProducts(skip: Int, limit: Int): ProductResult!
    searchProducts(
      term: String!
      skip: Int
      limit: Int
      filters: FilterInput
      sort: SortInput
    ): SearchResult
  }
`;
export default typeDefs;
