import React from 'react';
import AsyncSelect from 'react-select/async';

const promiseOptions = inputValue => fetch(`/api/search?q=${inputValue}`)
.then(r => r.json())
.then(r => {
  console.log(r);
  return r.body;
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
