# Type Ahead spike

This project is showcasing the Search-As-You-Type and and Did-You-Mean search features that can improve the UX on Archive Search.

It consists of a NodeJS REST API that talks with ElasticSearch and a simple UI that queries on.

## Setup

- You will need ElasticSearch and Kibana
- This demo is based on William Shakespeare's plays data set that that can be found [here](https://www.elastic.co/guide/en/kibana/current/tutorial-load-dataset.html)

## Elastic Search

Create an index that will serve the search-as-you-type and the did-you-mean queries

```
PUT shakespeare_ux_index
{
  "settings": {
    "index": {
      "number_of_shards": 1,
      "analysis": {
        "analyzer": {
          "english_exact": {
            "tokenizer": "standard",
            "filter": [
              "lowercase"
            ]
          },
          "trigram": {
            "type": "custom",
            "tokenizer": "standard",
            "filter": [
              "shingle",
              "lowercase"
            ]
          },
          "reverse": {
            "type": "custom",
            "tokenizer": "standard",
            "filter": [
              "reverse"
            ]
          }
        },
        "filter": {
          "shingle": {
            "type": "shingle",
            "min_shingle_size": 2,
            "max_shingle_size": 3
          }
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "play_name": {
        "type": "keyword",
        "fields": {
          "english": {
            "type": "text",
            "analyzer": "english"
          },
          "sayt": {
            "type": "search_as_you_type"
          },
          "exact": {
            "type": "text",
            "analyzer": "english_exact"
          },
          "trigram": {
            "type": "text",
            "analyzer": "trigram"
          },
          "reverse": {
            "type": "text",
            "analyzer": "reverse"
          }
        }
      }
    }
  }
}
```
