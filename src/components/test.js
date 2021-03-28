import React from "react";
import ReactDOM from "react-dom";

class Start extends React.Component {
  get show() {
    return this.props.activeSection === "start";
  }

  render() {
    if (this.show) {
      return <div className="start"> Start </div>;
    } else {
      return null;
    }
  }
}

class About extends React.Component {
  get show() {
    return this.props.activeSection === "about";
  }

  render() {
    if (this.show) {
      return <div className="about"> About </div>;
    } else {
      return null;
    }
  }
}

class Skills extends React.Component {
  get show() {
    return this.props.activeSection === "skills";
  }

  render() {
    if (this.show) {
      return <div className="skills"> Skills </div>;
    } else {
      return null;
    }
  }
}

class Contact extends React.Component {
  get show() {
    return this.props.activeSection === "contact";
  }

  render() {
    if (this.show) {
      return <div className="contact"> Contact </div>;
    } else {
      return null;
    }
  }
}

const Buttons = ({ onToggle }) => (
  <div className="buttons">
    <button name="start" onClick={onToggle}>
      Start
    </button>
    <button name="about" onClick={onToggle}>
      About
    </button>
    <button name="skills" onClick={onToggle}>
      Skills
    </button>
    <button name="contact" onClick={onToggle}>
      Contact
    </button>
  </div>
);

const Main = ({ activeSection }) => (
  <React.Fragment>
    <Start activeSection={activeSection} />
    <About activeSection={activeSection} />
    <Skills activeSection={activeSection} />
    <Contact activeSection={activeSection} />
  </React.Fragment>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSection: ""
    };

    this.handleToggleSection = this.handleToggleSection.bind(this);
  }

  handleToggleSection(e) {
    const { name } = e.target;
    this.setState(() => ({
      activeSection: name
    }));
  }

  render() {
    return (
      <div className="App">
        <Buttons onToggle={this.handleToggleSection} />
        <Main activeSection={this.state.activeSection} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));