import { OverrideToken } from 'antd/es/theme/interface'

const components: OverrideToken = {
  Menu: {
    colorText: '#D8D8D8',
    fontSize: 16,
    itemMarginInline: 0,
    itemBorderRadius: 0,
    subMenuItemBg: 'inherit',
    itemMarginBlock: 0,
    itemHeight: 50,
    itemSelectedBg: '#fff',
    itemHoverBg: 'transparent',
    itemSelectedColor: '#005B91',
  },
  Table: {
    colorBorderSecondary: '#EFEFEF',
  },
  Typography: {
    fontWeightStrong: 700,
    fontSize: 16,
  },
  Button: {
    colorLink: '#307DC1',
    colorLinkHover: '#307DC1',
    borderRadius: 4,
    colorTextLightSolid: '#FDFDFD',
    // colorBgContainerDisabled: '#ABCAE5',
    // colorTextDisabled: '#FDFDFD',
  },
  Input: {
    colorBgContainer: '#FDFDFD',
    colorTextPlaceholder: '#AFAFAF',
    controlHeight: 34,
    borderRadius: 4,
  },
  Checkbox: {
    controlInteractiveSize: 18,
  },
  Layout: {
    colorBgBody: '#F5F6F8',
  },
  Form: {
    marginLG: 40,
  },
  Radio: {
    radioSize: 24,
    dotSize: 14,
    wrapperMarginInlineEnd: 32,
  },
  Modal: {
    colorBgElevated: '#FDFDFD',
  },
  DatePicker: {
    fontSize: 12,
    colorText: '#000',
    borderRadius: 4,
  },
  Select: {
    controlHeight: 34,
    borderRadius: 4,
  },
  Tabs: {
    colorPrimary: '#005B91',
  },
  InputNumber: {
    borderRadius: 4,
  },
}

export default components
