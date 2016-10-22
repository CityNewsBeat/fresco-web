import React, { PropTypes } from 'react';
import reject from 'lodash/reject';
import capitalize from 'lodash/capitalize';
import utils from 'utils';
import get from 'lodash/get';
import api from 'app/lib/api';
import Tag from '../global/tag';

/**
 * AutocompletChipInput
 *
 * @extends React.Component
 */
class ChipInput extends React.Component {

    static propTypes = {
        items: PropTypes.array.isRequired,
        updateItems: PropTypes.func.isRequired,
        modifyChipText: PropTypes.func,
        model: PropTypes.string.isRequired,
        queryAttr: PropTypes.string,
        altAttr: PropTypes.string,
        initMaterial: PropTypes.bool,
        className: PropTypes.string,
        autocomplete: PropTypes.bool,
        createNew: PropTypes.bool,
        multiple: PropTypes.bool,
        idLookup: PropTypes.bool,
        search: PropTypes.bool,
        disabled: PropTypes.bool,
        placeholder: PropTypes.string,
        params: PropTypes.object,
    };

    static defaultProps = {
        items: [],
        params: {},
        initMaterial: false,
        className: '',
        autocomplete: false,
        search: false,
        createNew: true,
        multiple: true,
        disabled: false,
    };

    state = {
        suggestions: [],
        query: '',
    };

    componentWillMount() {
        document.addEventListener('click', this.onClick);
    }

    componentDidMount() {
        if (this.props.initMaterial) {
            $.material.init();
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onClick);
    }

    onClick = (e) => {
        if (this.area && this.area.contains(e.target)) {
            return;
        }

        this.setState({ query: '' });
    }

    onChangeQuery = (e) => {
        const query = e.target.value;
        if (!query.length === 0) {
            this.setState({ suggestions: [] });
            return;
        }

        this.setState({ query }, this.getSuggestions);
    }

    /**
     * onKeyUpQuery
     * on typing enter, checks if query is a suggestion,
     * adds suggestion if so, new story if not
     * @param {object} e key up event
     */
    onKeyUpQuery = (e) => {
        const { queryAttr, createNew } = this.props;
        const { suggestions, query } = this.state;

        // Enter is pressed, and query is present
        if (e.keyCode === 13 && query.length > 0) {
            if (!queryAttr) {
                this.addItem(query);
                return;
            }

            const matched = suggestions.find((s) => (
                s.title.toLowerCase() === query.toLowerCase()
            )) || suggestions[0];

            if (matched) this.addItem(matched);
            else if (createNew) this.addItem({ [queryAttr]: query, new: true });
        }
    }

    getSuggestions = () => {
        const {
            model,
            queryAttr,
            altAttr,
            autocomplete,
            idLookup,
            search,
            params,
        } = this.props;
        const { query } = this.state;
        if (!autocomplete && !search) return;

        if (search) {
            api
            .get('search', { [`${model}[q]`]: query, ...params })
            .then(res => {
                if (get(res, `${model}.results.length`)) {
                    this.setState({ suggestions: res[model].results });
                } else if (idLookup) {
                    this.getModelById(query);
                }
            });
            return;
        }

        api
        .get('search', { [`${model}[a][${queryAttr}]`]: query, ...params })
        .then(res => {
            if (get(res, `${model}.results.length`)) {
                this.setState({ suggestions: res[model].results });
            } else if (idLookup) {
                this.getModelById(query);
            }
        });
    }

    getModelById(id) {
        const { model } = this.props;
        api
        .get(`${utils.pluralToSingularModel(model)}/${id}`)
        .then(res => {
            if (res) {
                this.setState({ suggestions: [res] });
            }
        })
        .catch(err => err);
    }

    /**
     * Adds story element, return if story exists in prop stories.
     */
    addItem(newItem) {
        let { items, queryAttr, multiple, altAttr } = this.props;

        if (queryAttr) {
            if (!newItem[queryAttr] && !newItem[altAttr]) return;
            if (newItem.id && items.some((i) => (i.id === newItem.id))) return;
        } else if (items.some(i => i === newItem)) return;

        if (multiple) items = items.concat(newItem);
        else items = [newItem];

        this.setState({ query: '' }, this.props.updateItems(items));
    }

    /**
     * Removes story and updates to parent
     */
    onClickTag(item) {
        if (this.props.disabled) return;
        let { items, queryAttr } = this.props;

        if (!queryAttr) items = items.filter(i => i !== item);
        else if (item.id) items = reject(items, { id: item.id });
        else items = reject(items, { [queryAttr]: item[queryAttr] });

        this.props.updateItems(items);
    }

    renderSuggestion(suggestion, key) {
        const { queryAttr, altAttr } = this.props;
        let text;
        if (!altAttr) text = suggestion[queryAttr];
        else if (suggestion[queryAttr]) {
            text = (
                <span className="chip__primary-text">
                    {`${suggestion[queryAttr]} `}
                    <span className="chip__alt-text">
                        {suggestion[altAttr] || ''}
                    </span>
                </span>
            );
        } else if (suggestion[altAttr]) {
            text = (
                <span className="chips__primary-text" >
                    suggestion[altAttr]
                </span>
            );
        }

        return (
            <li onClick={() => this.addItem(suggestion)} key={key}>
                {text}
            </li>
        );
    }

    render() {
        const { query, suggestions } = this.state;
        const { items, queryAttr, altAttr, model, placeholder, disabled, modifyChipText } = this.props;
        const itemsJSX = items.map((item, i) => {
            const text = queryAttr ? item[queryAttr] : item;

            return (
                <Tag
                    text={modifyChipText ? modifyChipText(text) : text}
                    altText={altAttr ? item[altAttr] : ''}
                    plus={false}
                    onClick={() => this.onClickTag(item)}
                    key={i}
                    hasAlt={altAttr === true}
                />
            )
        });

        const suggestionsJSX = suggestions.map((suggestion, i) => (
            this.renderSuggestion(suggestion, i)
        ));

        return (
            <div
                ref={r => { this.area = r; }}
                className={`split chips form-group-default ${this.props.className}`}
            >
                <div className="split-cell">
                    <input
                        type="text"
                        className="form-control floating-label"
                        placeholder={placeholder || capitalize(model)}
                        onChange={this.onChangeQuery}
                        onKeyUp={this.onKeyUpQuery}
                        value={query}
                        disabled={disabled}
                    />

                    <ul
                        style={{ display: `${query.length ? 'block' : 'none'}` }}
                        className="dropdown"
                    >
                        {suggestionsJSX}
                    </ul>

                    <ul className="chips">
                        {itemsJSX}
                    </ul>
                </div>
            </div>
        );
    }
}

export default ChipInput;