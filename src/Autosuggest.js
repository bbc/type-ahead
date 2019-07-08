import React from 'react';
import AsyncSelect from 'react-select/async';
import get from 'lodash/get';
import ReactHtmlParser from 'react-html-parser';

class Autosuggest extends React.Component {
  state = {
    inputValue: '',
    options: [],
  };

  fixMySearch = () => {
    this.setState(state => ({
      inputValue: state.options[0].text,
      options: [],
    }));
  };

  handleInputChange = e => {
    this.setState({ inputValue: e || '' });
  };

  promiseOptions = inputValue =>
    fetch(`/api/search?q=${inputValue}`)
      .then(r => r.json())
      .then(r => {
        console.log(r);
        return r;
      })
      .then(({ suggest, ...rest }) => {
        const options = get(suggest, 'simple_phrase[0].options', []);
        if (options.length) {
          this.setState({
            options: options,
          });
        }
        return rest;
      })
      .then(({ hits }) => {
        return hits.hits.map(({ _id, _source }) => ({
          label: _source.play_name,
          value: _id,
        }));
      });

  render() {
    return (
      <div style={{ maxWidth: '50%', margin: 'auto' }}>
        <div>
          <AsyncSelect
            inputValue={this.state.inputValue}
            onInputChange={this.handleInputChange}
            cacheOptions
            defaultOptions
            loadOptions={this.promiseOptions}
            isMulti
          />
        </div>
        <div style={{ marginTop: '50px', textAlign: 'left' }}>
          {this.state.options.length > 0 ? (
            <h3 style={{ color: 'red' }}>Did you mean: </h3>
          ) : null}
          {this.state.options.map(option => (
            <a
              style={{ textDecoration: 'underline' }}
              onClick={this.fixMySearch}
            >
              {ReactHtmlParser(option.highlighted)}
            </a>
          ))}
        </div>
      </div>
    );
  }
}

export default Autosuggest;
