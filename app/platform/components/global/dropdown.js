import React, { PropTypes } from 'react';

/**
 * Generic Dropdown Element
 * @param {function} onSelected A function called with the user's selection
 */
class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: this.props.selected,
            active: false,
        };
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = () => {
        const domNode = ReactDOM.findDOMNode(this.refs.toggle);

        if ((!domNode || !domNode.contains(event.target)) && this.props.toggled) {
            this.props.toggle(false);
        }
    };

    componentDidMount() {
        // Click event for outside clicking
        $(document).click((e) => {
            if ($(e.target).parents('.nav-dropdown').size() === 0 && e.target !== this.refs.drop) {
                this.setState({ active: false });
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selected !== this.props.selected) {
            this.setState({ selected: nextProps.selected });
        }

        if(nextProps.active !== this.props.active) {
            this.setState({ active: nextProps.active });
        }
    }

    componentWillUnmount() {
        // Clean up click event on unmount
        $(document).unbind('click');
    }

    getCaretIconClassName() {
        const { active } = this.state;
        const { reverseCaretDirection, icon } = this.props;
        if (icon) {
            return `mdi mdi-${icon}`;
        }

        if (reverseCaretDirection) {
            return `mdi ${active ? 'mdi-menu-down' : 'mdi-menu-up'}`;
        }
        return `mdi ${active ? 'mdi-menu-up' : 'mdi-menu-down'}`;
    }

	/**
	 * Called whenever the master button is clicked
	 */
    toggle() {
        this.setState({ active: !this.state.active }, () => {
            this.props.onToggled();
        });
    }

    /**
     * Called whenever an option is selected from the dropdown
     */
    optionClicked(e, i) {
        // Get the span tag from the list item
        const selected = e.currentTarget.getElementsByTagName('span')[0].innerHTML;

        // If the user chose the already selected option, don't do anything
        if (this.state.selected === selected) {
            this.toggle();
            return;
        }

        this.setState({ selected });

        this.toggle();

        if (this.props.onSelected) {
            this.props.onSelected(selected, i);
        }
    }

    render() {
        const {
            options,
            dropdownClass,
            inList,
            title,
            dropdownActions,
            children,
            modalList = false,
            modalFunctions
        } = this.props;
        const { active } = this.state;
        let list = '';
        if (options) {
            list = (
                <ul className="list">
                    {options.map((option, i) => (
                        <li
                            className={option === this.state.selected ? 'active' : ''}
                            key={i}
                            onClick={ modalList ? modalFunctions[i] : (e) => this.optionClicked(e, i)}
                            >
                            <span>{option}</span>
                        </li>
                    ))}
                </ul>
            );
            // If options are passed, use those
        }

        return (
            <div
                className={`nav-dropdown ${inList ? 'pull-right' : ''} ${dropdownClass} ${active ? 'active' : ''}`}
            >
                <div
                    className="toggle"
                    ref='toggle'
                    onClick={() => this.toggle()}
                >
                    <span>{title || this.state.selected}</span>

                    <i className={this.getCaretIconClassName()} />

                    {dropdownActions}
                </div>

                <div className="dropdown-body">{list}{children}</div>
            </div>
		);
    }
}

Dropdown.defaultProps = {
    reverseCaretDirection: false,
    inList: false,
    onToggled() {},
};

Dropdown.propTypes = {
    selected: PropTypes.string,
    onToggled: PropTypes.func,
    onSelected: PropTypes.func,
    options: PropTypes.array,
    inList: PropTypes.bool,
    dropdownClass: PropTypes.string,
    title: PropTypes.string,
    active: PropTypes.bool,
    reverseCaretDirection: PropTypes.bool,
    dropdownActions: PropTypes.node,
    children: PropTypes.node,
};

export default Dropdown
