import React from 'react';
import { mount } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ImageCropDin from 'material-ui/svg-icons/image/crop-din';
import ActionRoom from 'material-ui/svg-icons/action/room';
import { TypeaheadMenuItem } from '../../components/MapTools/TypeaheadMenuItem';


describe('TypeaheadMenuItem component', () => {
    const muiTheme = getMuiTheme();
    const getProps = () => ({
        result: {},
        index: 1,
    });

    const getContext = () => ({
        activeIndex: -1,
        onActiveItemChange: () => {},
        onInitialItemChange: () => {},
        onMenuItemClick: () => {},
        muiTheme,
    });

    it('should return a MenuItem with proper child components', () => {
        const props = getProps();
        const context = getContext();
        const wrapper = mount(<TypeaheadMenuItem {...props} />, {
            context,
            childContextTypes: {
                activeIndex: React.PropTypes.number.isRequired,
                onActiveItemChange: React.PropTypes.func.isRequired,
                onInitialItemChange: React.PropTypes.func.isRequired,
                onMenuItemClick: React.PropTypes.func.isRequired,
                muiTheme: React.PropTypes.object,
            },
        });
        expect(wrapper.find(TypeaheadMenuItem)).toHaveLength(1);
        expect(wrapper.find('div')).toHaveLength(6);
        expect(wrapper.find('.menuItem')).toHaveLength(1);
        expect(wrapper.find('.qa-TypeaheadMenuItem-icon-div')).toHaveLength(1);
        expect(wrapper.find(ActionRoom)).toHaveLength(0);
        expect(wrapper.find('.qa-TypeaheadMenuItem-name')).toHaveLength(1);
        expect(wrapper.find('.qa-TypeaheadMenuItem-description')).toHaveLength(1);
        expect(wrapper.find('.qa-TypeaheadMenuItem-source')).toHaveLength(1);
    });

    it('createDescription should return the proper description', () => {
        const result = {
            name: 'test name', province: 'province', region: 'region', country: 'country name',
        };
        const props = getProps();
        const context = getContext();
        const wrapper = mount(<TypeaheadMenuItem {...props} />, {
            context,
            childContextTypes: {
                activeIndex: React.PropTypes.number.isRequired,
                onActiveItemChange: React.PropTypes.func.isRequired,
                onInitialItemChange: React.PropTypes.func.isRequired,
                onMenuItemClick: React.PropTypes.func.isRequired,
                muiTheme: React.PropTypes.object,
            },
        });
        const description = wrapper.instance().createDescription(result);
        expect(description).toEqual('province, region, country name');
    });

    it('should have the proper text and icon', () => {
        const props = getProps();
        const context = getContext();
        props.result = { geometry: { type: 'Polygon' } };
        props.result.name = 'test name';
        props.result.province = 'province';
        props.result.region = 'region';
        props.result.country = 'country name';
        const wrapper = mount(<TypeaheadMenuItem {...props} />, {
            context,
            childContextTypes: {
                activeIndex: React.PropTypes.number.isRequired,
                onActiveItemChange: React.PropTypes.func.isRequired,
                onInitialItemChange: React.PropTypes.func.isRequired,
                onMenuItemClick: React.PropTypes.func.isRequired,
                muiTheme: React.PropTypes.object,
            },
        });
        expect(wrapper.find(ImageCropDin)).toHaveLength(1);
        expect(wrapper.find('.qa-TypeaheadMenuItem-name').text()).toEqual('test name');
        expect(wrapper.find('.qa-TypeaheadMenuItem-description').text()).toEqual('province, region, country name');
    });
});
