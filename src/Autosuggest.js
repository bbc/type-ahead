import React from 'react';
import AsyncSelect from 'react-select/async';

const promiseOptions = inputValue => fetch('/shakespeare_as_you_type/_search', {
  "query": {
    "multi_match": {
      "query": inputValue,
      "type": "bool_prefix",
      "fields": [
        "play_name",
        "play_name._2gram",
        "play_name._3gram"
      ]
    }
  }
})
.then(r => r.json())
.then(r => {
  console.log(r);
  return r;
})
.then(({ hits }) => {
  return hits.hits.map(({ _id, _source }) => ({
    label: _source.play_name,
    value: _id
  }))
});

class Autosuggest extends React.Component {
  state = {
    inputValue: ''
  };

  handleInputChange = (newValue) => {
    // console.log('newValue', newValue);
    
    const inputValue = newValue.replace(/\W/g, '');
    this.setState({ inputValue });
    return inputValue;
  };

  render() {
    return (
      <AsyncSelect
        onInputChange={this.handleInputChange}
        cacheOptions
        defaultOptions
        loadOptions={promiseOptions}
      />
    );
  }
}

export default Autosuggest;
