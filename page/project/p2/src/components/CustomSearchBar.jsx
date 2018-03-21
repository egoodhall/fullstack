import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete, IconButton, Paper } from 'material-ui';
import SearchIcon from 'material-ui/svg-icons/action/search';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import FilterListIcon from 'material-ui/svg-icons/content/filter-list';
import { grey500 } from 'material-ui/styles/colors';
import windowSize from 'react-window-size';
import { threeMux } from '../helpers';

const getStyles = (props, state) => {
  const {disabled, iconButtonStyle, windowWidth} = props;
  const { value, filters: { display, hidden } } = state;
  const nonEmpty = value.length > 0;

  return {
    root: {
      // position: 'fixed',
      display: 'flex',
      justifyContent: 'space-between'
    },
    iconButtonFilter: {
      style: {
        zIndex: 5,
        opacity: 0.54,
        marginRight: 0,
        ...iconButtonStyle
      },
      iconStyle: {
        opacity: 1,
        transition: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)'
      }
    },
    iconButtonClose: {
      style: {
        zIndex: 5,
        opacity: !disabled ? 0.54 : 0.38,
        transform: nonEmpty ? 'scale(1, 1)' : 'scale(0, 0)',
        transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        ...iconButtonStyle
      },
      iconStyle: {
        opacity: nonEmpty ? 1 : 0,
        transition: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)'
      }
    },
    iconButtonSearch: {
      style: {
        zIndex: 5,
        opacity: !disabled ? 0.54 : 0.38,
        transform: nonEmpty ? 'scale(0, 0)' : 'scale(1, 1)',
        transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        marginRight: -48,
        ...iconButtonStyle
      },
      iconStyle: {
        opacity: nonEmpty ? 0 : 1,
        transition: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)'
      }
    },
    filterContainer: {
      display: display,
      transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      width: '100%',
      padding: 8,
      height: threeMux(windowWidth > 991, 64, windowWidth > 768, 128, 192),
      position: 'absolute',
      top: hidden ? 0 : 64,
      left: 0,
      opacity: hidden ? 0 : 1,
      zIndex: 3
    },
    input: {
      width: '100%'
    },
    searchContainer: {
      zIndex: 5,
      height: 48,
      marginLeft: 16,
      marginRight: 16,
      width: '100%'
    }
  };
};

class CustomSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      value: this.props.value,
      active: false,
      filters: {
        hidden: true,
        display: 'none'
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({...this.state, value: nextProps.value});
    }
  }

  focus() {
    this.autoComplete.focus();
  }

  blur() {
    this.autoComplete.blur();
  }

  handleFocus() {
    this.setState({focus: true});
  }

  handleBlur() {
    this.setState({focus: false});
    if (this.state.value.trim().length === 0) {
      this.setState({value: ''});
    }
  }

  handleInput(e) {
    this.setState({value: e});
    this.props.onChange(e);
  }

  handleCancel() {
    this.setState({
      active: false,
      value: ''
    });
    if (this.props.handleClear) {
      this.props.handleClear();
    }
  }

  toggleFilters() {
    if (!this.state.filters.hidden) {
      console.log('hiding');
      this.setState({filters: {...this.state.filters, hidden: true}}, () => {
        setTimeout(() => {
          this.setState({filters: {...this.state.filters, display: 'none'}});
        }, 200);
        this.props.onFiltersToggled(!this.state.filters.hidden);
      });
    } else {
      this.setState({filters: {...this.state.filters, display: 'inline-block'}}, () => {
        setTimeout(() => {
          this.setState({filters: {...this.state.filters, hidden: false }});
        }, 1);
        this.props.onFiltersToggled(!this.state.filters.hidden);
      });
    }
  }

  handleKeyPressed(e) {
    if (e.charCode === 13) {
      this.props.onRequestSearch();
    }
  }

  render() {
    const styles = getStyles(this.props, this.state);
    const {value} = this.state;
    const {
      closeIcon,
      filterIcon,
      disabled,
      onRequestSearch,
      searchIcon,
      spellCheck,
      style,
      ...inputProps
    } = this.props;

    return (
      <div style={{ position: 'fixed', zIndex: 5, justifyContent: 'center', display: 'flex' }}>
        <Paper
          style={{
            ...style,
            padding: 4
          }}
        >
          <div style={{
            ...styles.root
          }}>
            <Paper
              style={{
                ...style,
                ...styles.filterContainer
              }}
              zDepth={1}
            >
              { this.props.filters || ''}
            </Paper>
            <div style={styles.searchContainer}>
              <AutoComplete
                ref={(ref) => {
                  this.autoComplete = ref;
                }}
                onBlur={() => this.handleBlur()}
                searchText={value}
                onUpdateInput={(e) => this.handleInput(e)}
                onKeyPress={(e) => this.handleKeyPressed(e)}
                onFocus={() => this.handleFocus()}
                fullWidth
                style={styles.input}
                underlineShow={false}
                disabled={disabled}
                spellCheck={spellCheck}
                {...inputProps}
              />
            </div>
            {this.props.filters &&
              <IconButton onClick={() => this.toggleFilters()} iconStyle={styles.iconButtonFilter.iconStyle}
                style={styles.iconButtonFilter.style} disabled={disabled}>
                {filterIcon}
              </IconButton>
            }
            <IconButton onClick={onRequestSearch} iconStyle={styles.iconButtonSearch.iconStyle}
              style={styles.iconButtonSearch.style} disabled={disabled}>
              {searchIcon}
            </IconButton>
            <IconButton onClick={() => this.handleCancel()} iconStyle={styles.iconButtonClose.iconStyle}
              style={styles.iconButtonClose.style} disabled={disabled}>
              {closeIcon}
            </IconButton>
          </div>
        </Paper>
      </div>
    );
  }
}

CustomSearchBar.defaultProps = {
  onFiltersToggled: () => {},
  filters: undefined,
  closeIcon: <CloseIcon color={grey500} />,
  filterIcon: <FilterListIcon color={grey500} />,
  dataSource: [],
  dataSourceConfig: {text: 'text', value: 'value'},
  disabled: false,
  hintText: 'Search',
  searchIcon: <SearchIcon color={grey500} />,
  spellCheck: false,
  value: ''
};

CustomSearchBar.propTypes = {
  /** Fires when filters are toggled */
  onFiltersToggled: PropTypes.func,
  /** An array of filter elements to be held in the search table */
  filters: PropTypes.array,
  /** Fired when the 'x' icon is clicked. */
  handleClear: PropTypes.func.isRequired,
  /** Override the close icon. */
  closeIcon: PropTypes.node,
  /** Override the close icon. */
  filterIcon: PropTypes.node,
  /** Array of strings or nodes used to populate the list. */
  dataSource: PropTypes.array,
  /** Config for objects list dataSource. */
  dataSourceConfig: PropTypes.object,
  /** Disables text field. */
  disabled: PropTypes.bool,
  /** Sets hintText for the embedded text field. */
  hintText: PropTypes.string,
  /** Override the inline-styles of the button element. */
  iconButtonStyle: PropTypes.object,
  /** Fired when the text value changes. */
  onChange: PropTypes.func.isRequired,
  /** Fired when the search icon is clicked. */
  onRequestSearch: PropTypes.func.isRequired,
  /** Override the search icon. */
  searchIcon: PropTypes.node,
  /** Specifies whether the element to have its spelling and grammar checked or not. */
  spellCheck: PropTypes.bool,
  /** Override the inline-styles of the root element. */
  style: PropTypes.object,
  /** The value of the text field. */
  value: PropTypes.string
};

export default windowSize(CustomSearchBar);
