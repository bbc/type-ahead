import React, { Fragment } from 'react';
import AsyncSelect from 'react-select/async';
import get from 'lodash/get';
import ReactHtmlParser from 'react-html-parser';

class Autosuggest extends React.Component {
  state = {
    inputValue: '',
    options: [],
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
      <div>
        <div style={{ maxWidth: '50%', margin: 'auto' }}>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={this.promiseOptions}
            isMulti
          />
        </div>
        <div>
          {this.state.options.length > 0 ? <h3>Did you mean: </h3> : null}
          {this.state.options.map(option => (
            <span>{ReactHtmlParser(option.highlighted)}</span>
          ))}
        </div>
      </div>
    );
  }
}

export default Autosuggest;
