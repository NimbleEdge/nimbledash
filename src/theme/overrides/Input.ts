/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Input component to override default Mui Input's style.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 29/Mar/2023
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/**
 * Input contains the styles to override default Mui Input and it's children's styles.
 *
 * @component
 * @param theme - global theme object to provide colors, fonts, spacing, shadows etc.
 * @returns Add-on styles for MuiInput
 */
export default function Input(theme: any): any {
  /* Output */
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          ...theme.typography.body2,
          overflow: 'hidden',
          '& .MuiInputAdornment-root': {
            '& .MuiIconButton-root': {
              marginRight: 0
            }
          }
        },
        inputSizeSmall: {
          height: 40,
          padding: '9.5px 1px'
        },
        input: {
          height: 48,
          padding: '13.5px 1px',
          boxSizing: 'border-box',
          '&::placeholder': {
            opacity: 1,
            color: theme.palette.text.disabled
          },
          '&:-webkit-autofill': {
            WebkitBoxShadow: `0 0 0 1000px ${theme.palette.common.white} inset`
          }
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.grey[500_32]
          },
          '&:after': {
            borderBottomWidth: 1
          },
          '&:hover': {
            '&:before': {
              borderBottomWidth: '1px !important'
            }
          },
          '&.Mui-disabled': {
            '&:before': {
              borderColor: theme.palette.action.disabledBackground
            }
          }
        }
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadiusXs,
          backgroundColor: theme.palette.grey[500_12],
          '&:hover': {
            backgroundColor: theme.palette.grey[500_16]
          },
          '&.Mui-focused': {
            backgroundColor: theme.palette.action.focus
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground,
            opacity: theme.palette.action.disabledOpacity
          }
        },
        inputSizeSmall: {
          padding: '9.5px 14px'
        },
        input: {
          padding: '13.5px 14px'
        },
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.grey[500_32]
          },
          '&:after': {
            borderBottomWidth: 1
          },
          '&:hover': {
            '&:before': {
              borderBottomWidth: '1px !important'
            }
          },
          '&.Mui-disabled': {
            '&:before': {
              borderColor: theme.palette.action.disabledBackground
            }
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadiusXs,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.grey[500_32]
          },
          '&.Mui-disabled': {
            opacity: theme.palette.action.disabledOpacity,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.action.disabledBackground
            }
          },
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: 1
            }
          }
        },
        inputSizeSmall: {
          padding: '9.5px 14px'
        },
        input: {
          padding: '13.5px 14px'
        }
      }
    }
  };
}
