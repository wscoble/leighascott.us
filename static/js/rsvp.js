(function() {
  var RsvpForm = React.createClass({
    getInitialState: function() {
      return {
        family: '',
        guests: 0,
        children: 0,
        wedding: true,
        reception: true,
        submitted: false
      }
    },
    handleEmailChange: function(event) {
      this.setState(_.extend(this.state, {email: event.target.value}));
    },
    handleFamilyChange: function(event) {
      this.setState(_.extend(this.state, {family: event.target.value}));
    },
    handleGuestChange: function(event) {
      this.setState(_.extend(this.state, {guests: parseInt(event.target.value)}));
    },
    handleChildrenChange: function(event) {
      this.setState(_.extend(this.state, {children: parseInt(event.target.value)}));
    },
    handleWeddingChange: function(event) {
      this.setState(_.extend(this.state, {wedding: event.target.checked}));
    },
    handleReceptionChange: function(event) {
      this.setState(_.extend(this.state, {reception: event.target.checked}));
    },
    submitRsvp: function() {
      this.setState(_.extend(this.state, {submitted: true}))
      this.props.onSubmit(this.state);
    },
    render: function() {
      return (
        <fieldset>
          <legend>Please tell us who's coming</legend>
            <p>
              <input size="50" type="text" name="email" placeholder="Email Address" value={this.state.email} onChange={this.handleEmailChange} />
            </p>
            <p>
              <input size="50" type="text" name="family" placeholder="Family Name: for example, Mr and Mrs Bill Scoble" value={this.state.family} onChange={this.handleFamilyChange} />
            </p>
            <p>
              <label for="guests">Number of guests (not including children 12 or under)</label>&nbsp;
              <input type="number" id="guests" min="1" max="5" value={this.state.guests} onChange={this.handleGuestChange} />
            </p>
            <p>
              <label for="children">Number of children 12 or under</label>&nbsp;
              <input type="number" id="guests" min="0" max="5" value={this.state.children} onChange={this.handleChildrenChange} />
            </p>
            <p>
              <label for="wedding">Coming to wedding?</label>&nbsp;
              <input type="checkbox" id="wedding" checked={this.state.wedding} onChange={this.handleWeddingChange} />
            </p>
            <p>
              <label for="reception">Coming to reception?</label>&nbsp;
              <input type="checkbox" id="reception" checked={this.state.reception} onChange={this.handleReceptionChange} />
            </p>
            <p>
              <button disabled={this.state.submitted} onClick={this.submitRsvp}>Submit</button>
            </p>
        </fieldset>
      )
    }
  })

  var Confirmation = React.createClass({
    render: function() {
      return (
        <span>
          <p>Thank you!</p>
          <p>You have RSVP'd {this.props.guests} guests with {this.props.children} children for the {this.props.family} family.</p>
          <p>Please visit one of our <a href="/post/registry/">gift registries</a> if you're considering a gift for us.</p>
        </span>
      )
    }
  })

  var Error = React.createClass({
    render: function() {
      return (
        <span>
          <p>There was a problem submitting your RSVP. Please try again later.</p>
        </span>
      )
    }
  })

  var RsvpApplication = React.createClass({
    getInitialState: function() {
      return {submitted: false, failed: false, data: {}};
    },
    handleSubmit: function(data) {
      console.log(data);
      var self = this;
      $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: 'https://kb8ajcv76a.execute-api.us-east-1.amazonaws.com/live/rsvp',
        data: JSON.stringify(data)
      }).done(function() {
        console.log('successfully rsvp\'d')
        self.setState({submitted: true, failed: false, data: data})
      }).fail(function() {
        console.log('failed to submit')
        self.setState({submitted: true, failed: true, data: {}})
      })
    },
    render: function() {
      var displayed;
      if (this.state.failed) {
        displayed = <Error />;
      } else {
        if (this.state.submitted) {
          displayed = <Confirmation guests={this.state.data.guests} children={this.state.data.children} family={this.state.data.family} />;
        } else {
          displayed = <RsvpForm onSubmit={this.handleSubmit} />;
        }
      }
      return (
        <span>
          {displayed}
        </span>
      )
    }
  })

  ReactDOM.render(
    <RsvpApplication />,
    document.getElementById('rsvp-app')
  );

})();
