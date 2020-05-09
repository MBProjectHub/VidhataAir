import React from 'react';
import './ConversationSearch.css';

export default class ConversationSearch extends React.Component {

  state = {
    bookings: {},
    threadIds: [],
    users: {},
    searchText: ''
  }

  static getDerivedStateFromProps(props, state) {
    if(props.bookings && Object.keys(props.bookings) != 0 && props.bookings.active)
      return {
        bookings: props.bookings,
        threadIds: Object.keys(props.myBookings),
        users: props.users
      }
    return null;
  }

  search(searchText) {
    this.setState({ searchText });

    if(searchText == '')
    {
      this.props.sendData({ results: {}, searching: false });
      return;
    }

    searchText = searchText.toLowerCase();
    let searchResults = [];
    for(let i=0; i<this.state.threadIds.length; i++)
    {
      let item = this.state.bookings.active[this.state.threadIds[i]];

      if((item.initId.split('_')[3]+'-'+item.initId.split('_')[2]+'-'+item.initId.split('_')[1]).includes(searchText) ||
          (item.request.details != '-' && item.request.details.arr.toLowerCase().includes(searchText)) ||
          (item.request.details != '-' && item.request.details.dept.toLowerCase().includes(searchText)) ||
          (item.confirmation.details != '-' && item.confirmation.details.airline.toLowerCase().includes(searchText)))
            searchResults.push(this.state.threadIds[i]);
    }
    this.props.sendData({ results: searchResults, searching: true });
  }

  render() {
    return (
      <div className="conversation-search">
        <input
          type="search"
          className="conversation-search-input"
          placeholder="Search Bookings"
          value={this.state.searchText}
          onChange={e => this.search(e.target.value)}
        />
      </div>
    );
  }
}
