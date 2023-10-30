export const orallyTheme = {
  token: {
    colorBgBase: 'var(--background-color, #020915)',
    colorPrimaryBg: 'var(--background-color, #020915)',
    colorPrimary: 'var(--primary-color, rgb(48, 36, 246))',
    colorBgLayout: 'var(--background-color, #020915)',
    colorText: 'white',
    fontSize: 12,
    controlHeightLG: 40,
    fontSizeHeading5: 14,
  },
  components: {
    Layout: {
      headerBg: '#0C172B',
      siderBg:'#0C172B',
    },
    Button: {
      colorPrimary: 'var(--primary-color, rgb(48, 36, 246))',
      colorPrimaryHover: '#5393FF',
      colorPrimaryActive: '#1C5FCE',
      colorBgContainer: 'var(--background-color, #020915)',
      colorBgContainerDisabled: 'grey',
      colorTextDisabled: '#7D8FA9',
      colorText: '#B9D6FA',
      colorBorder: '#B9D6FA',
      defaultShadow: 'none',
      primaryShadow: 'none',
      borderRadius: 12,
      contentFontSizeLG: 12,
 
      // colorBgTextHover: 'red',
      // textHoverBg: 'green',
    },
    Input: {
      // colorPrimary: '#eb2f96',
      // colorPrimaryHover: 'gray',
      colorBgContainer: 'transparent',
      colorText: 'white',
      colorTextPlaceholder: '#7D8FA9',
      colorFillAlter: '#7D8FA9',
      colorBgContainerDisabled: '#7D8FA9'
    },
    Switch: {
      colorPrimary: 'rgb(48, 36, 246)',
      colorPrimaryHover: 'gray',
      // colorBgContainer: 'green',
      // handleBg: 'yellow',
      // colorText: 'pink',
      colorTextTertiary: '#7D8FA9',
      colorTextQuaternary: '#B9D6FA',
    },
    Radio: {
      colorPrimaryActive: 'white !important',
      colorText: 'white !important',
      buttonBg: '#0C172B',
      buttonCheckedBg: 'var(--primary-color, rgb(48, 36, 246))',
      buttonColor: 'white !important',
      buttonPaddingInline: 30,
      buttonSolidCheckedBg: 'white',
      fontSizeLG: 12,
      borderRadius: 12,
      colorPrimaryBorder: '#020915',
      colorBorder: '#020915',  
    },
    Select: {
      colorBgContainer: 'transparent',
      colorText: '#B9D6FA',
      colorBgElevated: '#7dc1ff',
      colorTextQuaternary: '#B9D6FA',
      controlItemBgActive: '#005098',
      colorTextPlaceholder: 'gray',
      // colorTextTertiary: 'green',
      // colorFillSecondary: 'blue',
    },
    Modal: {
      colorBgElevated: 'rgb(26,21,41)',
      colorText: '#B9D6FA',
      titleColor: '#B9D6FA',
      colorBgMask: 'rgba(0, 0, 0, .8)',
      colorIcon: '#B9D6FA',
      boxShadow:
        '0px 4px 4px 0px rgba(255,255,255,.15) inset, 0px 0px 68px 0px rgba(255,255,255,.05) inset',
      headerBg: 'transparent',
    },
    Menu: {
      // controlItemBgActive: 'red',
      // itemSelectedBg: 'green',
      // colorText: 'red',
      // colorTextDescription: 'green',
      // itemColor: 'red', // try in light theme
      // itemActiveBg: 'brown',
      // itemBg: 'white',
      colorTextDisabled: '#4A6293',
      colorPrimary: '#0C172B', // bg color of menu item
      darkItemBg: 'transparent',
      darkItemHoverBg: 'transparent',
      darkItemHoverColor: '#1766F9',
      darkItemColor: '#4A6293',
      darkItemSelectedColor: '#1766F9',
      darkItemSelectedBg: 'transparent',
      iconSize: '20px !important',
    },
    Drawer: {
      colorBgElevated: '#0C172B'
    },
    Card: {
      colorBgContainer: '#0C172B',
      borderRadiusLG: 24,
      colorText: '#4A6293',
    }
  },
};


export const lightTheme = {
  token: {
    colorBgBase: 'lightgray',
    colorPrimaryBg: 'lightgray',
    colorPrimary: 'rgb(48, 36, 246)',
    colorBgLayout: 'lightgray',
  },
  components: {
    Layout: {
      colorBgHeader: 'gray',
      siderBg:'gray',
    },
    Button: {
      contentFontSizeLG: 14,
    },
    Menu: {
      itemBg: 'gray'
    }
  },
 
}