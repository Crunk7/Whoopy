import React from 'react';
import scrollToElement from 'scroll-to-element';
import { isUri } from 'valid-url';
import Input from './Input.jsx';
import Output from './Output/Output.jsx';
import { analyzeWithAllFeatures } from './utils/request';

// eslint-disable-next-line
const DEFAULT_TEXT = '';
const DEFAULT_URL = '';
export default React.createClass({
  displayName: 'Demo',

  getInitialState() {
    return {
      requestType: 'text',
      loading: false,
      error: null,
      data: null,
      disableButton: false,
      query: {},
    };
  },

  enableButton(event) {
    const disabled = event ? event.target.value.length < 1 : false;
    this.setState({ disableButton: disabled });
  },

  onSubmitClick(value) {
    const query = this.state.requestType === 'url' ? { url: value } : { text: value };
    this.setState({
      query,
      disableButton: true,
      loading: true,
    });

    setTimeout(() => { scrollToElement('#anchor', { duration: 300 }, 100); }, 0);

    // Send the request to NLU
    analyzeWithAllFeatures(query)
      .then(data => this.setState({ data, loading: false, error: null }))
      .catch(error => this.setState({ error, loading: false }))
      .then(() =>
        setTimeout(() => { scrollToElement('#anchor', { duration: 300 }, 100); }, 0),
      );
  },

  changeRequestType(index) {
    const requestType = index === 0 ? 'text' : 'url';
    this.setState({
      requestType,
    });
  },

  render() {
    return (
      <div className="_container _container_large">
        <Input
          //text={DEFAULT_TEXT}
          url={DEFAULT_URL}
          error={this.state.error}
          language={this.state.data ? this.state.data.results.language : null}
          disableButton={this.state.disableButton}
          onSubmit={this.onSubmitClick}
          onTabChange={this.enableButton}
          onInputChange={this.enableButton}
          changeRequestType={this.changeRequestType}
        />
        <div id="anchor" style={{ marginTop: '0rem' }} />
        { !this.state.error ? (
          <Output
            loading={this.state.loading}
            data={this.state.data}
            query={this.state.query}
            language={this.state.data ? this.state.data.results.language : null}
          />) : null
        }
      </div>
    );
  },
});
