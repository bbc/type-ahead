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

One way to get search-as-you-type and suggestions is from Kibana

```
POST shakespeare_ux_index/_search
{
  "query": {
    "multi_match": {
      "query": "kin",
      "type": "bool_prefix",
      "fields": [
        "play_name",
        "play_name.sayt",
        "play_name._2gram",
        "play_name._3gram"
      ]
    }
  },
  "collapse" : {
    "field" : "play_name"
  },
  "suggest": {
    "text": "Kign",
    "simple_phrase": {
      "phrase": {
        "field": "play_name.trigram",
        "size": 1,
        "gram_size": 3,
        "direct_generator": [ {
          "field": "play_name.trigram",
          "suggest_mode": "always"
        } ],
        "highlight": {
          "pre_tag": "<em>",
          "post_tag": "</em>"
        }
      }
    }
  }
}
```

there are several ways to search and configure these two features. This is an example that works well for this use case.
But depending on the type of the data on different attributes it can be configured to serve specific needs. On the API there is another example of `searching-as-you-type` query.

### Useful resources

- https://www.elastic.co/guide/en/elasticsearch/reference/current/search-as-you-type.html

- https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters-phrase.html
- https://www.elastic.co/guide/en/elasticsearch/reference/current/multi-fields.html
