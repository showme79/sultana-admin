import { Component } from 'react';
import ReactDOM from 'react-dom';

import { ChildrenPropType } from 'consts/prop-types';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    document.getElementById('id-modal-main').appendChild(this.el);
  }

  componentWillUnmount() {
    document.getElementById('id-modal-main').removeChild(this.el);
  }

  render() {
    const { children } = this.props;

    return ReactDOM.createPortal(children, this.el);
  }
}

Modal.propTypes = {
  children: ChildrenPropType,
};

Modal.defaultProps = {
  children: undefined,
};

export default Modal;
