const { Client } = require('es7');

const client = new Client({ node: 'http://localhost:9200' });

const search = (req, res, next) => {
  const term = req.query.q || '';

  client.search(
    {
      index: 'shakespeare_ux_index',
      body: {
        query: {
          match_phrase_prefix: {
            'play_name.sayt': term,
          },
        },
        collapse: {
          field: 'play_name',
        },
        suggest: {
          text: term,
          simple_phrase: {
            phrase: {
              field: 'play_name.trigram',
              size: 1,
              gram_size: 3,
              direct_generator: [
                {
                  field: 'play_name.trigram',
                  suggest_mode: 'always',
                },
              ],
              highlight: {
                pre_tag: '<em>',
                post_tag: '</em>',
              },
            },
          },
        },
      },
    },
    (err, result) => {
      if (err) {
        console.log(err);
      }
      const response = result.body;
      res.json(response);
    },
  );
};

module.exports = {
  search,
};
