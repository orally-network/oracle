export const orallyTheme = {
  token: {
    colorBgBase: 'var(--background-color, #050B15)',
    colorPrimaryBg: 'var(--background-color, #050B15)',
    colorPrimary: 'var(--primary-color, #1890FF)',
    colorBgLayout: 'var(--background-color, #050B15)',
    colorText: 'white',
    fontSize: 12,
    controlHeightLG: 40,
    fontSizeHeading5: 14,
    lineHeight: 1.2,
  },
  components: {
    Layout: {
      headerBg: '#0C172B',
      siderBg: '#0C172B',
      headerHeight:  48,
      headerPadding: '0 24px 0 15px',
      footerPadding: '10px 0',
    },
    Button: {
      colorPrimary: 'var(--primary-color, #1890FF)',
      colorPrimaryHover: '#5393FF',
      colorPrimaryActive: '#1C5FCE',
      colorBgContainer: 'var(--background-color, #020915)',
      colorBgContainerDisabled: 'grey',
      colorTextDisabled: '#7D8FA9',
      colorText: '#B9D6FA',
      colorBorder: '#B9D6FA',
      defaultShadow: 'none',
      primaryShadow: 'none',
      borderRadius: 8,
      contentFontSizeLG: 12,
      colorBgTextHover: 'var(--primary-color, #1890FF)',
    },
    Progress: {
      remainingColor: '#253554',
    },
    Input: {
      colorBorder: '#4A6293 !important',
      colorBgContainer: '#091325',
      colorTextPlaceholder: '#4A6293',
      colorText: 'white',
      colorFillAlter: '#091325',
      colorTextDisabled: 'white',
      colorIcon: 'red',
      borderRadius: '8px'
    },
    Switch: {
      colorPrimary: '#1890FF',
      colorPrimaryHover: 'gray',
      colorTextTertiary: '#6B75FF',
      colorTextQuaternary: '#696C94',
    },
    Radio: {
      colorPrimaryActive: 'white !important',
      colorText: 'white !important',
      buttonBg: 'transparent',
      colorPrimary: 'transparent',
      buttonCheckedBg: 'transparent',
      buttonPaddingInline: 30,
      buttonSolidCheckedBg: 'white',
      fontSizeLG: 12,
      borderRadius: 8,
      colorBorder: '#4A6293 !important',
    },
    Select: {
      colorBgContainer: 'transparent',
      colorText: 'white !important',
      colorBgElevated: '#091325',
      colorTextQuaternary: 'white',
      controlItemBgActive: '#081A3C',
      colorTextPlaceholder: 'white',
      colorTextTertiary: 'white',
    },
    Modal: {
      colorBgElevated: '#111F37',
      colorText: '#4A6293',
      titleColor: 'white',
      colorBgMask: 'rgba(0, 0, 0, .8)',
      colorIcon: 'var(--primary-color, #1890FF)',
      boxShadow:
        '0px 4px 4px 0px rgba(255,255,255,.15) inset, 0px 0px 68px 0px rgba(255,255,255,.05) inset',
      headerBg: 'transparent',
    },
    Menu: {
      colorTextDisabled: '#4A6293',
      colorPrimary: '#0C172B', // bg color of menu item
      darkItemBg: 'transparent',
      darkItemHoverBg: '#192438',
      darkItemHoverColor: '#1890FF',
      darkItemColor: '#4A6293',
      darkItemSelectedColor: '#1890FF',
      darkItemSelectedBg: '#192438',
      iconSize: '16px !important',
      fontSize: 14,
      itemMarginBlock: '5px 0',
      itemMarginInline: 0,
      itemBorderRadius: 0,
      itemPaddingInline: 0,
      itemPaddingBlock: 0,
      padding: 0
    },
    Drawer: {
      colorBgElevated: '#0C172B',
    },
    Card: {
      colorBgContainer: '#0C172B',
      borderRadiusLG: 12,
      colorText: '#4A6293',
      colorBorderSecondary: '#15223B',
      paddingLG: 15,
    },
    Spin: {
      colorPrimary: 'var(--primary-color, #1890FF)',
    },
    Pagination: {
      itemBg: '#0C172B',
      colorBgContainer: '#0C172B',
      colorBorder: 'red',
      borderRadius: 12,
      colorPrimary: 'var(--primary-color, #1766F9)',
      colorPrimaryHover: '#5393FF',
      colorText: '#4A6293',
    },
    Tag: {
      borderRadiusSM: 12,
      lineWidth: 2,
      colorBorder: '#696C94',
    },
    Skeleton: {
      colorFill: '#111F37',
    },
    Breadcrumb: {
      iconFontSize: 16,
      itemColor: '#4A6293',
      lastItemColor: 'var(--primary-color, #1890FF)',
      separatorColor: '#4A6293',
      linkColor: '#4A6293',
      fontSize: 14,
    },
    Table: {
      borderColor: '#020915',
      colorBgContainer: '#0C172B',
      colorFillSecondary: '#4A6293',
      colorTextHeading: '#4A6293',
    },
    Empty: {
      colorText: 'var(--primary-color, #1890FF)'
    }
  },
};

export const lightTheme = {
  token: {
    colorBgBase: 'lightgray',
    colorPrimaryBg: 'lightgray',
    colorPrimary: '#1890FF',
    colorBgLayout: 'lightgray',
  },
  components: {
    Layout: {
      colorBgHeader: 'gray',
      siderBg: 'gray',
      headerBg: 'transparent',
    },
    Button: {
      contentFontSizeLG: 14,
    },
    Menu: {
      itemBg: 'gray',
    },
  },
};
